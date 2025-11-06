import logging
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
from datetime import datetime, timedelta
from pydantic import BaseModel, Field
from typing import List, Optional
import json
import os
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

logger = logging.getLogger("google-calendar-api")
logger.setLevel(logging.INFO)

SCOPES = [
    'https://www.googleapis.com/auth/calendar',
]

class CreateEventInput(BaseModel):
    title: str = Field(description="Event title")
    start_datetime: str = Field(description="ISO8601 start datetime")
    end_datetime: str = Field(description="ISO8601 end datetime")
    # FIX 1 (Previous Request): Allowed 'null' for attendees
    attendees: Optional[List[str]] = Field(default=[], description="List of attendee emails")
    description: Optional[str] = Field(default="", description="Event description")
    location: Optional[str] = Field(default="", description="Event location")

class ListEventsInput(BaseModel):
    start_datetime: str = Field(description="ISO8601 start datetime for range")
    end_datetime: str = Field(description="ISO8601 end datetime for range")
    # FIX 2 (New): Allowed 'null' for max_results
    max_results: Optional[int] = Field(default=10, description="Max events to return")

class UpdateEventInput(BaseModel):
# ... (unchanged)
    event_id: Optional[str] = Field(default=None, description="Event ID to update")
    title: Optional[str] = Field(default=None, description="Event title to match")
    start_datetime: Optional[str] = Field(default=None, description="Start datetime to match (ISO8601)")
    event_number: Optional[int] = Field(default=None, description="Event number from list")
    new_title: Optional[str] = Field(default=None, description="New title")
    new_start_datetime: Optional[str] = Field(default=None, description="New start ISO")
    new_end_datetime: Optional[str] = Field(default=None, description="New end ISO")
    new_description: Optional[str] = Field(default=None, description="New description")

class DeleteEventInput(BaseModel):
# ... (unchanged)
    event_id: Optional[str] = Field(default=None, description="Event ID to delete")
    title: Optional[str] = Field(default=None, description="Event title to match")
    start_datetime: Optional[str] = Field(default=None, description="Start datetime to match (ISO8601)")
    event_number: Optional[int] = Field(default=None, description="Event number from list")

def build_service_from_refresh_token(refresh_token):
    # ... (unchanged)
    creds = Credentials(
        token=None,
        refresh_token=refresh_token,
        token_uri='https://oauth2.googleapis.com/token',
        client_id=os.getenv('GOOGLE_CLIENT_ID'),
        client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
        scopes=SCOPES
    )
    creds.refresh(Request())
    return build('calendar', 'v3', credentials=creds)

def create_event_func(input: CreateEventInput, refresh_token: str, timezone: str = 'America/Phoenix') -> str:
    try:
        service = build_service_from_refresh_token(refresh_token)
        # Safely handle Optional[List[str]] being None
        attendees_list = input.attendees if input.attendees is not None else []
        event_body = {
            "summary": input.title,
            "start": {"dateTime": input.start_datetime, "timeZone": timezone},
            "end": {"dateTime": input.end_datetime, "timeZone": timezone},
            "attendees": [{"email": a} for a in attendees_list if "@" in a],
            "description": input.description,
            "location": input.location,
            "conferenceData": {"createRequest": {"requestId": f"meet-{datetime.now().timestamp()}"}} if input.location and input.location.lower() in ["google meet", "online meeting"] else None
        }
        created = service.events().insert(calendarId="primary", body=event_body, conferenceDataVersion=1).execute()
        description = f" Description: {input.description}" if input.description else ""
        return f"Your event is created: {created.get('summary')} at {created['start']['dateTime']}{description}"
    except Exception as e:
        logger.error(f"Error creating event: {str(e)}")
        return f"Error creating event: {str(e) if str(e) else 'Unknown error'}"

def list_events_func(input: ListEventsInput, refresh_token: str) -> str:
    try:
        service = build_service_from_refresh_token(refresh_token)
        # Safely get max_results, defaulting to 10 if None is received
        max_results = input.max_results if input.max_results is not None else 10
        events = service.events().list(
            calendarId='primary',
            timeMin=input.start_datetime,
            timeMax=input.end_datetime,
            maxResults=max_results, # Use the safe value
            singleEvents=True,
            orderBy='startTime'
        ).execute()
        items = events.get('items', [])
        # ... (rest of function unchanged)
        if not items:
            return "No events found."
        result = []
        for idx, e in enumerate(items, 1):
            start = e['start'].get('dateTime', e['start'].get('date'))
            try:
                dt = datetime.fromisoformat(start.replace("Z", ""))
                natural_time = dt.strftime("%I:%M %p, %b %d").lstrip("0").lower()
            except:
                natural_time = start
            result.append({"id": e['id'], "summary": e.get('summary', 'No title'), "start": natural_time})
        return json.dumps(result)
    except Exception as e:
        logger.error(f"Error listing events: {str(e)}")
        return f"Error listing events: {str(e) if str(e) else 'Unknown error'}"


def update_event_func(input: UpdateEventInput, refresh_token: str, timezone: str = 'America/Phoenix') -> str:
    try:
        service = build_service_from_refresh_token(refresh_token)
        if input.event_number and not input.event_id:
            events = service.events().list(
                calendarId='primary',
                timeMin=(datetime.now() - timedelta(days=30)).isoformat() + 'Z',
                timeMax=(datetime.now() + timedelta(days=30)).isoformat() + 'Z',
                maxResults=10,
                singleEvents=True,
                orderBy='startTime'
            ).execute().get('items', [])
            if input.event_number < 1 or input.event_number > len(events):
                return f"Invalid event number: {input.event_number}. Choose between 1 and {len(events)}."
            input.event_id = events[input.event_number - 1]['id']
        if not input.event_id and input.title and input.start_datetime:
            events = service.events().list(
                calendarId='primary',
                timeMin=input.start_datetime,
                timeMax=input.start_datetime,
                q=input.title,
                singleEvents=True,
                maxResults=1
            ).execute().get('items', [])
            if not events:
                return "No event found with that title and time."
            input.event_id = events[0]['id']
        if not input.event_id:
            return "Event ID, event number, or title with time required."
        event = service.events().get(calendarId='primary', eventId=input.event_id).execute()
        if input.new_title:
            event['summary'] = input.new_title
        if input.new_start_datetime:
            event['start'] = {"dateTime": input.new_start_datetime, "timeZone": timezone}
        if input.new_end_datetime:
            event['end'] = {"dateTime": input.new_end_datetime, "timeZone": timezone}
        if input.new_description:
            event['description'] = input.new_description
        updated = service.events().update(calendarId='primary', eventId=input.event_id, body=event).execute()
        return f"Updated event: {updated.get('summary')} at {updated['start']['dateTime']}"
    except Exception as e:
        logger.error(f"Error updating event: {str(e)}")
        return f"Error updating event: {str(e) if str(e) else 'Unknown error'}"
def delete_event_func(input: DeleteEventInput, refresh_token: str, timezone_str: str = "America/Phoenix") -> str:
    """
    Delete a calendar event using one of:
      - event_id directly
      - title + start_datetime (preferred)
      - event_number (N-th upcoming event in next 30 days)
    """

    def to_rfc3339_utc(dt: datetime, tz: ZoneInfo) -> str:
        """Convert a datetime to RFC3339 UTC string, e.g. 2025-11-06T16:00:00Z"""
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=tz)
        return (
            dt.astimezone(timezone.utc)
            .replace(microsecond=0)
            .isoformat()
            .replace("+00:00", "Z")
        )

    try:
        service = build_service_from_refresh_token(refresh_token)
        tz = ZoneInfo(timezone_str)
        event_id = input.event_id

        # ─── 1) If we have event_id, delete directly ──────────────────────────────
        if event_id:
            try:
                service.events().delete(calendarId="primary", eventId=event_id).execute()
                return "Event deleted successfully."
            except Exception as e:
                logger.error(f"Error deleting event by ID: {e}")
                return f"Error deleting event: {str(e) if str(e) else 'Unknown error'}"

        # ─── 2) Try title + start_datetime search ─────────────────────────────────
        if not event_id and input.title and input.start_datetime:
            try:
                raw = input.start_datetime.strip()
                # datetime.fromisoformat doesn't like 'Z', so strip it if present
                if raw.endswith("Z"):
                    raw = raw[:-1]

                start_dt = datetime.fromisoformat(raw)
                if start_dt.tzinfo is None:
                    start_dt = start_dt.replace(tzinfo=tz)

                # look in a 1-day window around the provided time
                end_dt = start_dt + timedelta(days=1)

            except ValueError as ve:
                return (
                    f"Invalid date/time format: {ve}. "
                    "Please use a date/time like '2025-09-23T18:00:00-07:00'."
                )

            try:
                events_resp = service.events().list(
                    calendarId="primary",
                    timeMin=to_rfc3339_utc(start_dt, tz),
                    timeMax=to_rfc3339_utc(end_dt, tz),
                    q=input.title,
                    singleEvents=True,
                    maxResults=10,
                ).execute()
            except Exception as e:
                logger.error(f"Error listing events for delete: {e}")
                return f"Error looking up events to delete: {str(e) if str(e) else 'Unknown error'}"

            events = events_resp.get("items", [])

            if not events:
                return f"No event found with title '{input.title}' around that time."

            if len(events) > 1 and not input.event_number:
                # Let the agent ask a clarifying question
                return (
                    f"Multiple events found with title '{input.title}' near that time. "
                    "Please specify which one (for example, 'delete the first one')."
                )

            # If user gave an event_number, use it; otherwise default to the first match.
            idx = (input.event_number or 1) - 1
            if idx < 0 or idx >= len(events):
                return f"Invalid event number: {input.event_number}. Please choose between 1 and {len(events)}."

            event_id = events[idx]["id"]

        # ─── 3) If we still don't have event_id but have event_number ─────────────
        if not event_id and input.event_number:
            try:
                now = datetime.now(tz)
                events_resp = service.events().list(
                    calendarId="primary",
                    timeMin=to_rfc3339_utc(now - timedelta(days=30), tz),
                    timeMax=to_rfc3339_utc(now + timedelta(days=30), tz),
                    maxResults=10,
                    singleEvents=True,
                    orderBy="startTime",
                ).execute()
            except Exception as e:
                logger.error(f"Error listing events by number: {e}")
                return f"Error looking up events by number: {str(e) if str(e) else 'Unknown error'}"

            events = events_resp.get("items", [])
            if not events:
                return "No events found in the next 30 days."

            if input.event_number < 1 or input.event_number > len(events):
                return f"Invalid event number: {input.event_number}. Choose between 1 and {len(events)}."

            event_id = events[input.event_number - 1]["id"]

        # ─── 4) If we STILL don't have an ID, ask user for more info ─────────────
        if not event_id:
            return (
                "I couldn't figure out which event to delete. "
                "Please either give me the event title and date/time, or ask to list events first."
            )

        # ─── 5) Final delete call ────────────────────────────────────────────────
        try:
            service.events().delete(calendarId="primary", eventId=event_id).execute()
            return "Event deleted successfully."
        except Exception as e:
            logger.error(f"Error deleting event: {e}")
            return f"Error deleting event: {str(e) if str(e) else 'Unknown error'}"

    except Exception as e:
        logger.error(f"Error in delete_event_func: {e}")
        return f"Error deleting event: {str(e) if str(e) else 'Unknown error'}"

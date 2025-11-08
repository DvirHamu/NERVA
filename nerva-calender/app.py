import os
import logging
import asyncio
from datetime import datetime

from dotenv import load_dotenv

from livekit import rtc
from livekit.agents import (
    JobContext,
    WorkerOptions,
    cli,
    RunContext,
    get_job_context,
)
from livekit.agents.llm import (
    function_tool,
    LLM,
    ChatContext,
    ChatMessage,
    ImageContent,
)
from livekit.agents.voice import Agent, AgentSession
from livekit.plugins import deepgram, openai, silero

from tools.google_calendar_api import (
    CreateEventInput,
    ListEventsInput,
    UpdateEventInput,
    DeleteEventInput,
    create_event_func,
    list_events_func,
    update_event_func,
    delete_event_func,
)
from livekit import agents
from livekit.agents import AgentSession, Agent, RoomInputOptions
from livekit.plugins import noise_cancellation

logger = logging.getLogger("google-calendar-voice-agent")
logger.setLevel(logging.INFO)

# This .env is for Google (client ID/secret, refresh token, etc.)
load_dotenv(dotenv_path="./tokens/.env")


class GoogleCalendarAgent(Agent):
    def __init__(self, refresh_token: str) -> None:
        # video-related state (for screen share / camera)
        self.refresh_token = refresh_token
        self.timezone = "America/Phoenix"
        self._latest_frame = None
        self._video_stream: rtc.VideoStream | None = None
        self._tasks: list[asyncio.Task] = []

        super().__init__(
            instructions="""
You are Nerva, a friendly voice-first assistant that helps the user manage time, plans, and day-to-day life.

Core behavior:
- Talk like a helpful human, not a robot. Be concise, clear, and conversational.
- The user is speaking to you; assume real-time, back-and-forth voice interaction.
- If the user shares their screen or camera, you may use it as extra visual context to help them.

Google Calendar:
- Use these tools when appropriate:
  • create_event   schedule new events
  • list_events    see what's on the calendar
  • update_event   reschedule or modify existing events
  • delete_event   remove events when asked
- You are allowed to create new events when the user asks.
- When talking about what is already on the calendar, only describe events you actually see from the tools. Do not guess or invent existing events or times.

Neurodivergent-friendly support:
- Assume the user may be neurodivergent (e.g., ADHD, autism, anxiety, executive function challenges).
- Be patient, non-judgmental, and encouraging. Never guilt-trip or shame them.
- Break plans into small, concrete steps when helping with scheduling or tasks.
- Validate that its normal to forget things, feel overwhelmed, or have trouble starting tasks.
- Offer gentle options like: “Would it help if we put this on your calendar?” or “Do you want a small block just to get started?”

General help:
- You can also answer questions about school, coding, productivity, or anything else the user asks.
- If the user sounds unsure, suggest simple next steps rather than long lectures.

Time & timezone:
- Always assume the user is in the America/Phoenix timezone.
- Current local time: {current_time}.

Style:
- Prefer short answers first, then offer more detail if the user asks.
- If you use visual context (screen share / camera), only describe what’s relevant to their question.
            """.format(
                current_time=datetime.now().strftime("%I:%M %p, %b %d, %Y")
            ),
            stt=deepgram.STT(),
            llm=openai.LLM(model="gpt-4o-mini"),
            tts=openai.TTS(),
            vad= silero.VAD.load(
            activation_threshold=0.6,    # higher -> needs clearer speech to trigger
            min_speech_duration=0.15,    # ignore super tiny blips
            min_silence_duration=0.3,    # wait ~0.5s of quiet before ending a turn
            max_buffered_speech=60.0,
            )
        )

    # ------------- GOOGLE CALENDAR TOOLS -------------

    @function_tool
    async def create_event(self, context: RunContext, input: CreateEventInput):
        logger.info(f"Creating event: {input}")
        result = create_event_func(input, self.refresh_token, self.timezone)
        return None, result

    @function_tool
    async def list_events(self, context: RunContext, input: ListEventsInput):
        logger.info(f"Listing events: {input}")
        result = list_events_func(input, self.refresh_token)
        return None, result

    @function_tool
    async def update_event(self, context: RunContext, input: UpdateEventInput):
        logger.info(f"Updating event: {input}")
        result = update_event_func(input, self.refresh_token, self.timezone)
        return None, result

    @function_tool
    async def delete_event(self, context: RunContext, input: DeleteEventInput):
        logger.info(f"Deleting event: {input}")
        result = delete_event_func(input, self.refresh_token, self.timezone)
        return None, result

    # ------------- VIDEO / SCREEN-SHARE HANDLING -------------

    async def _create_video_stream(self, track: rtc.Track):
        # Close old stream if we already had one
        if self._video_stream is not None:
            await self._video_stream.aclose()

        self._video_stream = rtc.VideoStream(track)

        async def _read_stream():
            async for event in self._video_stream:
                # Keep only the latest frame
                self._latest_frame = event.frame

        task = asyncio.create_task(_read_stream())
        self._tasks.append(task)
        task.add_done_callback(lambda t: self._tasks.remove(t))

    async def on_enter(self):
        """
        Called when the agent joins the room.
        We greet the user and subscribe to any existing or future video tracks.
        """
        if not self.refresh_token:
            await self.session.say("Please authenticate with Google Calendar first.")
            return

        await self.session.say(
            "Hey, I’m Nerva, your calendar buddy. "
            "I can help you remember things, plan your day, and move events around. "
            "You can say things like ‘what do I have today?’ or ‘add a study session tomorrow at 3 p.m.’ "
            "Take your time, it’s okay to pause, repeat yourself, or change your mind while we talk."
        )

        room = get_job_context().room

        # If there's already a remote participant with video, attach to it.
        if room.remote_participants:
            remote_participant = list(room.remote_participants.values())[0]
            for pub in remote_participant.track_publications.values():
                if pub.track and pub.track.kind == rtc.TrackKind.KIND_VIDEO:
                    await self._create_video_stream(pub.track)

        @room.on("track_subscribed")
        def _on_track_subscribed(
            track: rtc.Track,
            publication: rtc.RemoteTrackPublication,
            participant: rtc.RemoteParticipant,
        ):
            if track.kind == rtc.TrackKind.KIND_VIDEO:
                logger.info(f"Subscribed to video track from {participant.identity}")
                asyncio.create_task(self._create_video_stream(track))

    async def on_user_turn_completed(
        self,
        turn_ctx: ChatContext,
        new_message: ChatMessage,
    ) -> None:
        """
        Called after the user finishes speaking, before the LLM is called.
        Attach the latest video frame as vision input, if we have one.
        """
        if self._latest_frame is not None:
            new_message.content.append(
                ImageContent(image=self._latest_frame)
            )
            # Clear so we don't keep reusing old frames
            self._latest_frame = None


# ------------- ENTRYPOINT / WORKER SETUP -------------


async def entrypoint(ctx: JobContext):
    refresh_token = os.getenv("GOOGLE_REFRESH_TOKEN")
    if not refresh_token:
        logger.error(
            "No refresh token found. Set GOOGLE_REFRESH_TOKEN in ./tokens/.env or your environment."
        )
        return

    session = AgentSession()

    await session.start(
        agent=GoogleCalendarAgent(refresh_token=refresh_token),
        room=ctx.room,
        room_input_options=RoomInputOptions(
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )

    # connect to the room (LiveKit handles the rest)
    await ctx.connect()


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))

from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = [
    'https://www.googleapis.com/auth/calendar'
]

def get_refresh_token():
    flow = InstalledAppFlow.from_client_secrets_file(
        '../client_secret.json',
        SCOPES
    )
    creds = flow.run_local_server(port=8080)
    print("Access token:", creds.token)
    print("Refresh token:", creds.refresh_token)
    print("Client ID:", creds.client_id)
    print("Client Secret:", creds.client_secret)
    return creds.refresh_token

if __name__ == "__main__":
    get_refresh_token()
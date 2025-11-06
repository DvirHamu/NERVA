# NERVA
Voice Assistant for the Hackathon
Setup
1. Install Dependencies
Clone the repository and install the required packages:

git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
pip install -r requirements.txt

2. Configure Google Cloud Project
  Go to the Google Cloud Console. https://console.cloud.google.com/
  Enable api and search calender
  Create OAuth 2.0 credentials:
    Go to APIs & Services > Credentials > Create Credentials > OAuth client ID.
    Choose Desktop application and name it idk "Assistant".
    Add http://localhost:8080/ to Authorized redirect URIs (ensure the trailing slash is included).
    Download the client_secret.json file and place it in the tokens project directory.
    Also add yourself as a user on the audience tab with your email

<img width="1577" height="733" alt="image" src="https://github.com/user-attachments/assets/38a3edd2-ecf9-41c4-870a-2032409d4f56" />
<img width="1756" height="552" alt="image" src="https://github.com/user-attachments/assets/be41e0d5-f5d6-4984-a7a7-c8f9d23ad97c" />
<img width="1908" height="927" alt="image" src="https://github.com/user-attachments/assets/3853a052-8523-4d97-a432-a5740e9b0f31" />
<img width="1463" height="987" alt="image" src="https://github.com/user-attachments/assets/731cdbf5-afe2-410f-9654-487737fe3452" />

3. Obtain a Refresh Token
   Run the get_refresh_token.py script to authenticate and obtain a refresh token:
   you will connect to your gmail and allow access
   make sure all token private info is in the .env file
   Copy the refresh_token, client_id, and client_secret to your .env file.
   Example:
    GOOGLE_CLIENT_ID="12347890-abc123def456.apps.googleusercontent.com"
    GOOGLE_CLIENT_SECRET="GOCSPX-abc123d456ghi789"
    GOOGLE_REFRESH_TOKEN="1//04abc123def456ghi789j12mn345op678"

4. Configure LiveKit
  Set up a LiveKit server (see LiveKit documentation).
  Ensure you have API keys for LiveKit and the necessary credentials for Deepgram and OpenAI (if required by your setup).

  Update .env with any additional LiveKit or plugin-specific variables (e.g., DEEPGRAM_API_KEY, OPENAI_API_KEY) 
  You will also need to create an account with open ai and deepgram and get the keys. For open ai you will need to add 5$

  .env should look like this

GOOGLE_REFRESH_TOKEN=""

GOOGLE_CLIENT_ID=""

GOOGLE_CLIENT_SECRET=""

LIVEKIT_URL=""

LIVEKIT_API_KEY=""

LIVEKIT_API_SECRET=""

OPENAI_API_KEY=""

DEEPGRAM_API_KEY=""

6. Run the Application
Start the voice assistant:
python .\app.py console
you can tell it to read events you have or create etc.

//update on a couple things 11/6/25
  - changed a little bit of the function of the app.py and the calender api to work, before it had some bugs with the time zones and instuctions
  - added front end by cloning the repo
    -   https://github.com/livekit-examples/agent-starter-react
    - Also change the file .env.example to .env.local and add the keys 

  - to run start by going to app.py and running python app.py dev
  - and then pnpm dev to run the local environment
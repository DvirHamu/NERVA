from flask import Flask, request, jsonify
from flask_cors import CORS

# Shared configuration dictionary for TTS
tts_config = {
    "voice": "onyx",
    "speed": 1.0,
}

flask_app = Flask(__name__)
CORS(flask_app)

@flask_app.route("/get_tts", methods=["GET"])
def get_tts():
    return jsonify(tts_config)

@flask_app.route("/update_tts", methods=["POST"])
def update_tts():
    data = request.json
    tts_config.update(data)
    print("Updated TTS config:", tts_config)
    return jsonify({"status": "ok", "new_config": tts_config})

def run_flask():
    """Run Flask app on a separate port/thread"""
    flask_app.run(port=5000, debug=False)

from flask import Flask, request, jsonify
from flask_cors import CORS

import asyncio

# Shared configuration dictionary for TTS
tts_config = {
    "voice": "nova",
    "speed": 1.0,
}

flask_app = Flask(__name__)
CORS(flask_app)

update_callbacks = []
def register_tts_update_callback(call_back):
    update_callbacks.append(call_back)

@flask_app.route("/get_tts", methods=["GET"])
def get_tts():
    return jsonify(tts_config)

@flask_app.route("/update_tts", methods=["POST"])
def update_tts():
    data = request.json
    tts_config.update(data)
    print("Updated TTS config:", tts_config)

    for cb in update_callbacks:
        print(f"[Flask] Calling callback {cb}")
        try:
            cb(tts_config)
        except Exception as e:
            print(f"[Flask] Callback failed: {e}")

    return jsonify({"status": "ok", "new_config": tts_config})

def run_flask():
    """Run Flask app on a separate port/thread"""
    flask_app.run(port=5000, debug=False)

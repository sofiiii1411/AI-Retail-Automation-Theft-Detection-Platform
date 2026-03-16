import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from datetime import datetime

# Load Firebase key
cred = credentials.Certificate("serviceAccountKey.json")

firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://retailpulseai-e2a4a-default-rtdb.firebaseio.com/'
})

def send_theft_alert():

    ref = db.reference("theft_alert")

    ref.set({
        "status": "THEFT",
        "time": str(datetime.now())
    })

    print("⚠ Theft Alert Sent to Dashboard")


# Example trigger
theft_detected = True

if theft_detected:
    send_theft_alert()
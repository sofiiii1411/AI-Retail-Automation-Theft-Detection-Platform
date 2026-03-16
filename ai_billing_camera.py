import cv2
from ultralytics import YOLO
import firebase_admin
from firebase_admin import credentials, db
import datetime
import random

# Firebase setup
cred = credentials.Certificate("firebase_key.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://retailpulseai-e2a4a-default-rtdb.firebaseio.com'
})

# Load YOLO model
model = YOLO("yolov8n.pt")

# Open camera
cap = cv2.VideoCapture(0)

print("AI Camera Billing Started")

while True:

    ret, frame = cap.read()

    results = model(frame)

    for r in results:
        for box in r.boxes:

            cls = int(box.cls[0])
            label = model.names[cls]

            # Example: treat "bottle" as product
            if label in ["bottle","cup","apple","banana"]:

                bill_id = "BILL-" + str(random.randint(10000,99999))

                data = {
                    "product": label,
                    "price": 50,
                    "qty": 1,
                    "time": str(datetime.datetime.now())
                }

                ref = db.reference("ai_detected_items")
                ref.child(bill_id).set(data)

                print("Product detected:", label)

    cv2.imshow("AI Retail Camera", frame)

    if cv2.waitKey(1) == 27:
        break

cap.release()
cv2.destroyAllWindows()
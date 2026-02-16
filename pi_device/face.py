def scan_face():
    return input("Scan Face (enter face id): ")

import cv2
import face_recognition
import numpy as np


def capture_face_images(count=5):

    cam = cv2.VideoCapture(0)
    images = []

    print("Capturing face images...")

    while len(images) < count:

        ret, frame = cam.read()

        if not ret:
            continue

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        faces = face_recognition.face_locations(rgb)

        if faces:
            images.append(rgb)
            print(f"Captured {len(images)}/{count}")

        cv2.imshow("Capture Face", frame)

        if cv2.waitKey(1) == 27:
            break

    cam.release()
    cv2.destroyAllWindows()

    return images


def generate_embedding(images):

    embeddings = []

    for img in images:

        enc = face_recognition.face_encodings(img)

        if enc:
            embeddings.append(enc[0])

    if not embeddings:
        return None

    return np.mean(embeddings, axis=0)


def match_face(known_embedding, live_image):

    live_enc = face_recognition.face_encodings(live_image)

    if not live_enc:
        return False

    distance = np.linalg.norm(
        known_embedding - live_enc[0]
    )

    return distance < 0.5   

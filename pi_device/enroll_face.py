import requests
import numpy as np

from face import capture_face_images, generate_embedding


API_URL = "http://127.0.0.1:8000"


def enroll_face(emp_id):

    print("Starting Face Enrollment...")

    images = capture_face_images(5)

    embedding = generate_embedding(images)

    if embedding is None:
        print("Face not detected ")
        return

    payload = {
        "emp_id": emp_id,
        "face_embedding": embedding.tobytes()
    }

    res = requests.post(
        f"{API_URL}/biometrics/face",
        json=payload
    )

    if res.status_code == 200:
        print("Face Enrolled ")
    else:
        print("Enroll Failed ", res.text)


if __name__ == "__main__":

    emp_id = input("Enter Employee ID: ")
    enroll_face(emp_id)

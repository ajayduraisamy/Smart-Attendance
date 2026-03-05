import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


DB_HOST='127.0.0.1'
DB_PORT=5432
DB_NAME='attendance_db'
DB_USER='postgres'
DB_PASSWORD='Ajaycode'


# ===============================
# SECURITY CONFIGURATION
# ===============================
SECRET_KEY = os.getenv("SECRET_KEY", "change_this_secret")
ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 900)
)
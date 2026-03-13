import pandas as pd
import base64
import io
from PIL import Image

def read_and_display_from_xl(file_name, employee_id):
    try:
        # 1. Excel file-ah read pandrom
        df = pd.read_excel(file_name)

        # 2. Specific Employee ID irukura row-ah edukkurom
        row = df[df['Employee_ID'] == employee_id]

        if not row.empty:
            # Base64 string-ah column-la irunthu edukkurom
            base64_str = str(row['Image_Base64'].values[0])
            print(f"Base64 string for {employee_id}: {base64_str}")

            # --- PADDING FIX (Incorrect padding error varaama irukka) ---
            missing_padding = len(base64_str) % 4
            if missing_padding:
                base64_str += '=' * (4 - missing_padding)
            # -------------------------------------------------------

            # 3. Base64-ah thirumbavum binary-ah maathi image-ah preview pandrom
            img_data = base64.b64decode(base64_str)
            img = Image.open(io.BytesIO(img_data))
            
            print(f"Displaying image for {employee_id}...")
            img.show() # Inga thaan image display aagum
        else:
            print(f"Error: {employee_id} find panna mudila.")

    except PermissionError:
        print("ERROR: Excel file-ah close pannitu thirumba run pannunga!")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    file_name = "employees_data.xlsx"
    emp_id = "EMP001" # Unga Excel-la irukura ID
    
    read_and_display_from_xl(file_name, emp_id)
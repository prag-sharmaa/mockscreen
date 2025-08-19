import os
import json
import pdfplumber

# PATH SETUP 
pdf_dir = "ccac_docs"                     # Folder containing your 9 CCAC PDFs
output_json = "vs_text_table_data.json"   # Output file for text & table data

final_data = []

#  LOOP THROUGH PDFS 
for filename in os.listdir(pdf_dir):
    if filename.endswith(".pdf"):
        pdf_path = os.path.join(pdf_dir, filename)
        print(f" Processing: {filename}")

        with pdfplumber.open(pdf_path) as pdf:
            for page_num, page in enumerate(pdf.pages):

                #  EXTRACT AND CLEAN TEXT
                text = page.extract_text() or ""
                if text:
                    lines = text.split("\n")
                    cleaned_lines = [
                        line for line in lines
                        if not line.startswith("CCAC O&G Methane Partnership")
                        and not line.startswith("CLIMATE & CLEAN AIR COALITION")
                        and not line.strip().startswith("Modified:")
                    ]
                    text = "\n".join(cleaned_lines)

                #  EXTRACT TABLES
                tables = page.extract_tables() or []

                #  BUILD PAGE DATA
                page_data = {
                    "file_name": filename,
                    "page_number": page_num + 1,
                    "text": text,
                    "tables": tables,
                    "images": []  # Placeholder – Colab will update this
                }

                final_data.append(page_data)

#  SAVE FINAL OUTPUT
with open(output_json, "w", encoding="utf-8") as f:
    json.dump(final_data, f, indent=2, ensure_ascii=False)

print(" Done: Cleaned text & tables saved to vs_text_table_data.json")

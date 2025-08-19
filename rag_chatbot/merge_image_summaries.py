import json

# Load the existing page-wise JSON 
with open("vs_text_table_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

#  Load the diagram summaries text file 
with open("diagram_summaries.txt", "r", encoding="utf-8") as f:
    content = f.read()

# Parse into dictionary {filename: {title, summary}} 
diagram_dict = {}
entries = content.strip().split("\n\n")
for entry in entries:
    if ":\n" in entry:
        filename, rest = entry.split(":\n", 1)
        lines = rest.strip().split("\n")

        # Extract title and full summary
        title_line = lines[0].strip().split(".")[0] if len(lines) > 0 else ""
        summary_text = "\n".join(lines[1:]).strip() if len(lines) > 1 else ""

        diagram_dict[filename.strip()] = {
            "title": title_line,
            "summary": summary_text
        }

# Define logo keywords to skip 
logo_keywords = [
    "climate and clean air coalition",
    "blue and white logo",
    "features a globe",
    "written in white text",
    "logo is designed",
    "commitment to reducing climate pollution",
    "logo features a globe",
    "blue circle in the center",
    "blue and white globe"
]

#  Merge summaries into the JSON 
count_added = 0
count_skipped = 0
count_empty_summary = 0
count_no_match = 0

for page in data:
    file_base = page["file_name"].replace(".pdf", "").strip()
    page_number = page["page_number"]
    image_prefix = f"{file_base}_page_{page_number}_"

    matched = False

    for image_filename, entry in diagram_dict.items():
        image_filename_cleaned = image_filename.strip()

        # Flexible matching: if image_prefix is found anywhere in the filename
        if image_prefix in image_filename_cleaned:
            matched = True
            summary = entry["summary"]

            # Skip logo entries 
            if any(kw in summary.lower() for kw in logo_keywords):
                count_skipped += 1
                continue

            #  Warn for empty summaries
            if not summary.strip():
                print(f" No summary found for: {image_filename_cleaned}")
                count_empty_summary += 1

            #  Ensure 'images' list exists 
            if "images" not in page:
                page["images"] = []

            # Prevent duplicates 
            existing_image_names = [img["image_name"] for img in page["images"]]
            if image_filename_cleaned not in existing_image_names:
                page["images"].append({
                    "image_name": image_filename_cleaned,
                    "title": entry["title"],
                    "summary": summary
                })
                count_added += 1
            else:
                print(f" Skipped duplicate image: {image_filename_cleaned}")

    if not matched:
        print(f"No images matched for: {file_base} page {page_number}")
        count_no_match += 1

# Save the updated JSON 
with open("vs_text_table_data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

#  Final report 
print("\n Merge Complete!")
print(f" {count_added} diagram summaries added")
print(f" {count_skipped} logo-based entries skipped")
print(f" {count_empty_summary} entries had missing or empty summaries")
print(f" {count_no_match} pages had no matching images at all\n")

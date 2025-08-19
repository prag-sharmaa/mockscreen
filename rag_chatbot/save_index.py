import os
import json
from langchain_community.embeddings import GPT4AllEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.docstore.document import Document
from langchain.text_splitter import CharacterTextSplitter

# Load combined JSON
documents = []

with open("vs_text_table_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

    for page in data:
        text_block = ""

        if page.get("text"):
            text_block += page["text"] + "\n"

        if page.get("tables"):
            for i, table in enumerate(page["tables"]):
                title = f"Table {page['page_number']}.{i+1}"
                table_text = "\n".join([
                    "\t".join(str(cell) if cell is not None else "" for cell in row)
                    for row in table
                ])
                text_block += f"\n[{title}]\n{table_text}\n"

        if page.get("images"):
            image_summary = "\n".join(page["images"])
            text_block += "\nImage Summary:\n" + image_summary + "\n"

        if text_block.strip():
            documents.append(Document(page_content=text_block.strip()))

# Chunking
splitter = CharacterTextSplitter(chunk_size=300, chunk_overlap=50)
chunks = splitter.split_documents(documents)

# Embedding and saving FAISS vector store
embedding_model = GPT4AllEmbeddings()
vectorstore = FAISS.from_documents(chunks, embedding_model)

os.makedirs("vectorstore", exist_ok=True)
vectorstore.save_local("vectorstore")

print(" Vector index built from vs_text_table_data.json (text + tables + image summaries)")

from flask import Flask, render_template, request, jsonify
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, Settings
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.llms.groq import Groq
import os

app = Flask(__name__)

# Configure LlamaIndex settings
Settings.embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-base-en-v1.5")
Settings.llm = Groq(model="llama3-70b-8192", api_key="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")

# Load documents and create a query engine globally
data_dir = "./data"
os.makedirs(data_dir, exist_ok=True)

if not os.listdir(data_dir):  # Ensure the directory isn't empty
    with open(os.path.join(data_dir, "sample.txt"), "w") as f:
        f.write("This is a sample document for the chatbot.")

documents = SimpleDirectoryReader(data_dir).load_data()
query_engine = VectorStoreIndex.from_documents(documents).as_query_engine()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/ask', methods=['POST'])
def ask():
    data = request.json
    user_question = data.get('question', '')

    if not user_question:
        return jsonify({"error": "No question provided"}), 400

    try:
        response = query_engine.query(user_question)
        return jsonify({"answer": str(response)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7860)

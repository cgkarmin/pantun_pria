from flask import Flask, render_template, request, jsonify
import csv
import os

app = Flask(__name__)

# Lokasi fail database CSV
DB_FILE = "db.csv"

# Fungsi untuk membaca database CSV
def read_database():
    suku_kata = {}
    if os.path.exists(DB_FILE):
        with open(DB_FILE, mode="r", encoding="utf-8") as file:
            reader = csv.reader(file)
            for row in reader:
                if len(row) == 2:
                    suku_kata[row[0].strip().lower()] = row[1].strip()
    return suku_kata

# Fungsi untuk menambah data ke dalam database CSV
def write_to_database(perkataan, pecahan):
    with open(DB_FILE, mode="a", encoding="utf-8", newline="") as file:
        writer = csv.writer(file)
        writer.writerow([perkataan.lower(), pecahan])

# Halaman utama (Paparkan HTML)
@app.route("/")
def home():
    return render_template("index.html")

# API untuk mendapatkan database suku kata
@app.route("/get_database", methods=["GET"])
def get_database():
    return jsonify(read_database())

# API untuk menambah perkataan baru ke dalam database
@app.route("/add_word", methods=["POST"])
def add_word():
    data = request.json
    perkataan = data.get("perkataan", "").strip().lower()
    pecahan = data.get("pecahan", "").strip()
    
    if perkataan and pecahan:
        write_to_database(perkataan, pecahan)
        return jsonify({"message": "Perkataan ditambah!", "success": True})
    return jsonify({"message": "Data tidak sah!", "success": False})

if __name__ == "__main__":
    app.run(debug=True)

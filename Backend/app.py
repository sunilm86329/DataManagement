from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import uuid

app = Flask(__name__)
CORS(app)  # Allow requests from Angular

DATA_FILE = 'data.json'

def read_data():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def write_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

@app.route('/api/data', methods=['POST'])
def add_data():
    new_entry = request.json
    new_entry['id'] = str(uuid.uuid4())  # Assign a unique ID
    data = read_data()
    data.append(new_entry)
    write_data(data)
    return jsonify({'message': 'Data added successfully', 'id': new_entry['id']}), 201

@app.route('/api/data', methods=['GET'])
def get_data():
    data = read_data()
    return jsonify(data), 200

@app.route('/api/data/<id>', methods=['PUT'])
def update_data(id):
    updated_entry = request.json
    data = read_data()

    for index, entry in enumerate(data):
        if entry.get('id') == id:
            updated_entry['id'] = id  # Ensure ID consistency
            data[index] = updated_entry
            write_data(data)
            return jsonify({'message': 'Data updated successfully'}), 200

    return jsonify({'error': 'Data not found'}), 404

@app.route('/api/data/<id>', methods=['DELETE'])
def delete_data(id):
    try:
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)

        new_data = [item for item in data if item['id'] != id]

        with open(DATA_FILE, 'w') as f:
            json.dump(new_data, f, indent=2)

        return jsonify({'message': 'Deleted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)

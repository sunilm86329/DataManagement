from flask import Flask, request, jsonify
import json
import os
import time
from datetime import datetime
from flask_cors import CORS
from uuid import uuid4

app = Flask(__name__)
CORS(app)


DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)


DATA_FILE = os.path.join(DATA_DIR, 'user_data.json')


if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w') as f:
        json.dump([], f)

def read_data():
    """Read data from JSON file"""
    try:
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error reading data: {e}")
        return []

def write_data(data):
    """Write data to JSON file"""
    try:
        with open(DATA_FILE, 'w') as f:
            json.dump(data, f, indent=2)
        return True
    except Exception as e:
        print(f"Error writing data: {e}")
        return False

@app.route('/api/data', methods=['GET'])
def get_data():
    """Retrieve all user data"""
    data = read_data()
    return jsonify(data)

@app.route('/api/data', methods=['POST'])
def add_data():
    """Add new user data"""
    try:
        new_data = request.json
        
        # Validate required fields
        required_fields = ['name', 'email', 'phone', 'age', 'occupation']
        for field in required_fields:
            if field not in new_data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Add id and timestamp
        new_data['id'] = str(uuid4())
        new_data['createdAt'] = datetime.now().isoformat()
        
        # Read existing data
        data = read_data()
        
        # Add new data
        data.append(new_data)
        
       
        if write_data(data):
            return jsonify({'success': True, 'message': 'Data added successfully', 'data': new_data}), 201
        else:
            return jsonify({'error': 'Failed to save data'}), 500
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
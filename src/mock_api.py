# File: src/mock_api.py - GSCR Agent Digital Skills Backend

from flask import Flask, jsonify, request
from flask_cors import CORS  # Critical for local fetching (CORS Fix)
import json
import time 

app = Flask(__name__)
# Kadam 24 ka final fix: Har origin se /api/ calls ko allow karein
CORS(app, resources={r"/api/*": {"origins": "*"}}) 

# --- Load Mock Data ---
try:
    # Ensure these files are correctly saved in the 'data' folder
    with open('data/suppliers.json', 'r') as f:
        SUPPLIERS = json.load(f)
    with open('data/critical_skus.json', 'r') as f:
        CRITICAL_SKUS = json.load(f)
except FileNotFoundError:
    print("ERROR: Make sure 'data/suppliers.json' and 'data/critical_skus.json' exist in the 'data' directory.")
    SUPPLIERS = []
    CRITICAL_SKUS = []
except json.JSONDecodeError:
    print("ERROR: JSON files are empty or improperly formatted. Please check brackets [] or commas.")
    SUPPLIERS = []
    CRITICAL_SKUS = []

# --- 1. Risk Alert Simulation API (Digital Skill 1) ---
@app.route('/api/check_risk/<port_name>', methods=['GET'])
def check_risk(port_name):
    """ Agent isse call karega yeh dekhne ke liye ki supply chain mein koi bada khatra hai ya nahi. """
    time.sleep(1) 
    
    # Hum 'Port X' ko critical risk zone maante hain jisse agent trigger ho
    if port_name.upper().replace('%20', ' ') == 'PORT X':
        risk_status = "CRITICAL_SHUTDOWN"
        
        # Is port se jude hue SKUs dhoondhna (Mock logic)
        impacted_skus = [
            sku['sku_id'] for sku in CRITICAL_SKUS 
            if any(s['port_of_entry'] == 'Port X' for s in SUPPLIERS if s['supplier_id'] == sku['supplier_id'])
        ]
        
        return jsonify({
            "status": risk_status,
            "port": port_name.replace('%20', ' '),
            "impact_detected": True,
            "impacted_skus": impacted_skus,
            "message": f"CRITICAL: {port_name.replace('%20', ' ')} is currently non-operational due to a major geopolitical incident. Immediate re-routing required."
        }), 200
    
    return jsonify({
        "status": "NORMAL",
        "port": port_name.replace('%20', ' '),
        "impact_detected": False,
        "message": f"NORMAL: {port_name.replace('%20', ' ')} is operating normally."
    }), 200

# --- 2. Alternative Logistics Quote API (Digital Skill 2) ---
@app.route('/api/get_alternatives/<sku_id>', methods=['GET'])
def get_alternatives(sku_id):
    """ Agent isse call karke teen best mitigation options niklega. """
    time.sleep(2) # Simulate complex logistics quoting

    if sku_id == "CRIT-A101":
        # Teen pre-calculated options
        options = [
            {"route_name": "Route B: Air Freight", "lead_time_days": 5, "cost_increase_percent": 12, "supplier_id": "SUP003"},
            {"route_name": "Route C: Rail/Truck", "lead_time_days": 18, "cost_increase_percent": 5, "supplier_id": "SUP002"},
            {"route_name": "Route D: Sea Cargo (Delayed)", "lead_time_days": 35, "cost_increase_percent": 0, "supplier_id": "SUP001"}
        ]
        return jsonify({"sku_id": sku_id, "options": options, "message": "Three executable mitigation options retrieved."}), 200
    
    return jsonify({"sku_id": sku_id, "options": [], "message": "No critical alternatives found."}), 200

# --- 3. Execute Order Change API (Digital Skill 3) ---
@app.route('/api/execute_change', methods=['POST'])
def execute_change():
    """ Agent isse final decision execute karne ke liye call karega. """
    data = request.json
    required_fields = ['sku_id', 'new_supplier_id', 'route_name']
    
    if not all(field in data for field in required_fields):
        return jsonify({"status": "FAILED", "message": "Missing required execution parameters."}), 400

    time.sleep(1)
    
    # Real-world SCM system mein, yahan database update hota.
    return jsonify({
        "status": "SUCCESS",
        "order_id": f"ORD-{int(time.time())}",
        "message": f"Order change for SKU {data['sku_id']} successfully executed and routed via {data['route_name']} with new supplier {data['new_supplier_id']}."
    }), 200


if __name__ == '__main__':
    # Server ko Port 5000 par chalaein
    app.run(port=5000, debug=False)
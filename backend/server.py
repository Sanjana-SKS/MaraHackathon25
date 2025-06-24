from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from bson import json_util
import os
from datetime import datetime
import logging
from dotenv import load_dotenv
from optimization_function_multiple_sites import optimize_static_config, extract_site_params

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# MongoDB Atlas configuration
MONGO_URI = os.getenv('MONGO_URI', 'mongodb+srv://rmaskey:f9Rdxe4TXDfiZkkI@cluster0.8ytdjij.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
DB_NAME = os.getenv('DB_NAME','mara')
SITES_COLLECTION = os.getenv('SITES_COLLECTION', 'sites')

# Initialize MongoDB client
try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    # Test the connection
    client.admin.command('ping')
    db = client[DB_NAME]
    collection = db[SITES_COLLECTION]
    logger.info("Successfully connected to MongoDB Atlas")
except (ConnectionFailure, ServerSelectionTimeoutError) as e:
    logger.error(f"Failed to connect to MongoDB Atlas: {e}")
    client = None
    db = None
    collection = None

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
#         if client:
#             client.admin.command('ping')
#             return jsonify({
#                 'status': 'healthy',
#                 'database': 'connected',
#                 'timestamp': datetime.utcnow().isoformat()
#             }), 200
#         else:
#             return jsonify({
#                 'status': 'unhealthy',
#                 'database': 'disconnected',
#                 'timestamp': datetime.utcnow().isoformat()
#             }), 503
#     except Exception as e:
#         logger.error(f"Health check failed: {e}")
#         return jsonify({
#             'status': 'unhealthy',
#             'database': 'error',
#             'error': str(e),
#             'timestamp': datetime.utcnow().isoformat()
#         }), 503
    
# @app.route('/optimize', methods=['POST'])
# def optimize():
#     sites_data = list(collection.find())
#     # Extract parameters from sites data
#     T = 12

#     # Get all unique device types from the sites data
#     devices = set()
#     for site in sites_data:
#         devices.update(site["miners"].keys())
#         if "inference" in site:
#             devices.update(site["inference"].keys())
#     devices = list(devices)

#     print("Devices", devices)
#     sites, power, N, P_MAX, energy_prices, site_states, r_hash, r_tok = (
#         extract_site_params(sites_data)
#     )

#     # Read CSV forecasts
#     import pandas as pd

#     # Hash price forecast
#     h = pd.read_csv("../datasets/forecasts/hash_forecast.csv").iloc[:, 1].tolist()[:T]

#     # Token price forecast
#     g = pd.read_csv("../datasets/forecasts/token_forecast.csv").iloc[:, 1].tolist()[:T]

#     # Energy price forecasts per state
#     e_states = {
#         "California": pd.read_csv("../datasets/forecasts/cali_energy_forecast.csv")
#         .iloc[:, 1]
#         .tolist()[:T],
#         "Texas": pd.read_csv("../datasets/forecasts/texas_energy_forecast.csv")
#         .iloc[:, 1]
#         .tolist()[:T],
#         "Ohio": pd.read_csv("../datasets/forecasts/ohio_energy_forecast.csv")
#         .iloc[:, 1]
#         .tolist()[:T],
#         "Nevada": pd.read_csv("../datasets/forecasts/nevada_energy_forecast.csv")
#         .iloc[:, 1]
#         .tolist()[:T],
#         "Wyoming": pd.read_csv("../datasets/forecasts/wyoming_energy_forecast.csv")
#         .iloc[:, 1]
#         .tolist()[:T],
#     }

#     # Map energy prices to sites based on their states
#     e = {site: e_states[state] for site, state in site_states.items()}

#     try:
#         # Calculate energy budget based on sites' power capacity
#         E_BUDGET = sum(site["powerCapacity"] * 1000 * 24 * 30 for site in sites_data)
#         logger.info(f"Using energy budget: {E_BUDGET} Wh")

#         # Run optimization
#         result = optimize_static_config(
#             sites=sites,
#             devices=devices,
#             T=T,
#             r_hash=r_hash,
#             r_tok=r_tok,
#             power=power,
#             N=N,
#             h=h,
#             g=g,
#             e=e,
#             P_MAX=P_MAX,
#             E_BUDGET=E_BUDGET,
#         )

#         # Update site configurations in MongoDB
#         for (site_id, device_type), count in result.items():
#             # Update miners configuration
#             update_field = f"miners.{device_type}.optimal_machines"
#             collection.update_one(
#                 {"_id": site_id},
#                 {"$set": {update_field: count}},
#                 upsert=True
#             )
            
#             # If it's an inference device, update that too
#             for site in sites_data:
#                 if site["id"] == site_id and "inference" in site and device_type in site["inference"]:
#                     update_field = f"inference.{device_type}.optimal_machines"
#                     collection.update_one(
#                         {"_id": site_id},
#                         {"$set": {update_field: count}},
#                         upsert=True
#                     )
#                     break

#         # Prepare response
#         response = {
#             "status": "success",
#             "message": "Optimization completed and configurations updated successfully",
#             "results": [
#                 {
#                     "site_id": site_id,
#                     "device_type": device_type,
#                     "optimal_machines": count
#                 }
#                 for (site_id, device_type), count in result.items()
#             ]
#         }
        with open("sites.json", "r") as f:
            sites_data = json.load(f)

        # Extract parameters from sites data
        T = 12

        # Get all unique device types from the sites data
        devices = set()
        for site in sites_data:
            devices.update(site["miners"].keys())
            if "inference" in site:
                devices.update(site["inference"].keys())
        devices = list(devices)

        sites, power, N, P_MAX, energy_prices, site_states, r_hash, r_tok = (
            extract_site_params(sites_data)
        )

        # Read CSV forecasts
        import pandas as pd

        # Hash price forecast
        h = pd.read_csv("../datasets/forecasts/hash_forecast.csv").iloc[:, 1].tolist()[:T]

        # Token price forecast
        g = pd.read_csv("../datasets/forecasts/token_forecast.csv").iloc[:, 1].tolist()[:T]

        # Energy price forecasts per state
        e_states = {
            "California": pd.read_csv("../datasets/forecasts/cali_energy_forecast.csv")
            .iloc[:, 1]
            .tolist()[:T],
            "Texas": pd.read_csv("../datasets/forecasts/texas_energy_forecast.csv")
            .iloc[:, 1]
            .tolist()[:T],
            "Ohio": pd.read_csv("../datasets/forecasts/ohio_energy_forecast.csv")
            .iloc[:, 1]
            .tolist()[:T],
            "Nevada": pd.read_csv("../datasets/forecasts/nevada_energy_forecast.csv")
            .iloc[:, 1]
            .tolist()[:T],
            "Wyoming": pd.read_csv("../datasets/forecasts/wyoming_energy_forecast.csv")
            .iloc[:, 1]
            .tolist()[:T],
        }

        # Map energy prices to sites based on their states
        e = {site: e_states[state] for site, state in site_states.items()}

        # Calculate a more realistic energy budget based on sites' power capacity
        E_BUDGET = sum(
            site["powerCapacity"] * 1000 * 24 * 30 for site in sites_data
        )  
        print(f"\nEnergy Budget: {E_BUDGET/1000000:.2f} MWh")

        # Run optimization
        result = optimize_static_config(
            sites=sites,
            devices=devices,
            T=T,
            r_hash=r_hash,
            r_tok=r_tok,
            power=power,
            N=N,
            h=h,
            g=g,
            e=e,
            P_MAX=P_MAX,
            E_BUDGET=E_BUDGET,
        )

        print("\nOptimization Results:")
        
        # Load current sites data
        with open("sites.json", "r") as f:
            sites_data = json.load(f)
        
        # Create a mapping of site_id to site index for easy updates
        site_index = {site['id']: idx for idx, site in enumerate(sites_data) if 'id' in site}
        
        # Update sites with optimization results
        updated_sites = 0
        for (site_id, device_type), count in result.items():
            print(f"Site: {site_id}, Device: {device_type}, Count: {count}")
            
            if site_id not in site_index:
                print(f"Warning: Site ID {site_id} not found in sites.json")
                continue
                
            site_idx = site_index[site_id]
            site = sites_data[site_idx]
            
            # Determine if it's a mining or inference device
            if device_type in ['asic', 'gpu']:
                if 'inference' not in site:
                    site['inference'] = {}
                if device_type not in site['inference']:
                    site['inference'][device_type] = {}
                site['inference'][device_type]['optimal_machines'] = count
            else:
                if 'miners' not in site:
                    site['miners'] = {}
                if device_type not in site['miners']:
                    site['miners'][device_type] = {}
                site['miners'][device_type]['optimal_machines'] = count
            
            updated_sites += 1
        
        # Save updated data back to sites.json
        with open("sites.json", "w") as f:
            json.dump(sites_data, f, indent=2)
        
        print(f"\nUpdated {updated_sites} sites in sites.json")
        
        return jsonify({
            "status": "success",
            "message": f"Optimization completed and {updated_sites} sites updated",
            "updated_sites": updated_sites
        }), 200

    except Exception as e:
        logger.error(f"Error during optimization: {str(e)}", exc_info=True)
        return jsonify({
            "status": "error",
            "message": f"Failed to complete optimization: {str(e)}"
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/debug/site-structure', methods=['GET'])
def debug_site_structure():
    """Debug endpoint to check the structure of site documents"""
    try:
        site = db[SITES_COLLECTION].find_one({})
        if not site:
            return jsonify({'error': 'No sites found'}), 404
            
        # Remove _id for cleaner output since it's an ObjectId
        site.pop('_id', None)
        return jsonify({
            'fields': list(site.keys()),
            'sample': site
        }), 200
    except Exception as e:
        logger.error(f"Error in debug endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/sites', methods=['GET'])
def get_sites():
    """
    Retrieve all documents from the sites collection
    Returns:
        JSON: List of all site documents
    """
    try:
        sites = list(db[SITES_COLLECTION].find({}))
        # Use json_util to handle BSON types like ObjectId
        return json_util.dumps({'sites': sites}), 200, {'Content-Type': 'application/json'}
    except Exception as e:
        logger.error(f"Error retrieving sites: {str(e)}")
        return jsonify({'error': 'Failed to retrieve sites'}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    
    logger.info(f"Starting Flask server on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)

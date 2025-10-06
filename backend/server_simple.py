from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)


@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return (
        jsonify({"status": "healthy", "timestamp": datetime.utcnow().isoformat()}),
        200,
    )


@app.route("/optimize", methods=["POST"])
def optimize():
    """Mock optimization endpoint that returns sample values"""
    try:
        # Load the sites data
        with open("sites.json", "r") as f:
            sites_data = json.load(f)

        # Create mock optimization results
        updated_sites = 0
        for site in sites_data:
            site_id = site["id"]

            # Add mock optimal_machines values to miners
            if "miners" in site:
                for miner_type in site["miners"]:
                    # Mock optimal values (random-ish but realistic)
                    mock_optimal = max(
                        1, site["miners"][miner_type].get("max_machines", 10) // 2
                    )
                    site["miners"][miner_type]["optimal_machines"] = mock_optimal

            # Add mock optimal_machines values to inference if it exists
            if "inference" in site:
                for inference_type in site["inference"]:
                    mock_optimal = max(
                        1, site["inference"][inference_type].get("max_machines", 5) // 3
                    )
                    site["inference"][inference_type]["optimal_machines"] = mock_optimal

            updated_sites += 1

        # Save the updated data back to sites.json
        with open("sites.json", "w") as f:
            json.dump(sites_data, f, indent=2)

        logger.info(f"Mock optimization completed for {updated_sites} sites")

        return (
            jsonify(
                {
                    "status": "success",
                    "message": f"Mock optimization completed and {updated_sites} sites updated with sample values",
                    "updated_sites": updated_sites,
                    "note": "These are mock optimization results for frontend testing",
                }
            ),
            200,
        )

    except Exception as e:
        logger.error(f"Error during mock optimization: {str(e)}", exc_info=True)
        return (
            jsonify(
                {
                    "status": "error",
                    "message": f"Failed to complete mock optimization: {str(e)}",
                }
            ),
            500,
        )


@app.route("/sites", methods=["GET"])
def get_sites():
    """Get all sites data"""
    try:
        with open("sites.json", "r") as f:
            sites_data = json.load(f)
        return jsonify(sites_data), 200
    except Exception as e:
        logger.error(f"Error getting sites: {str(e)}")
        return (
            jsonify({"status": "error", "message": f"Failed to get sites: {str(e)}"}),
            500,
        )


@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal Server Error"}), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "False").lower() == "true"

    logger.info(f"Starting Flask server on port {port}")
    app.run(host="0.0.0.0", port=port, debug=debug)

# Mining Optimization API

This FastAPI backend provides endpoints for mining site optimization using time series data and the `optimize_static_config` function.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Populate the sites table with sample data:
```bash
cd backend
python populate_sites.py
```

3. Start the server:
```bash
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

## Endpoints

### GET /sites
Returns all sites from the database.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Texas Solar Farm Alpha",
    "state": "TX",
    "lat": 31.9686,
    "lng": -99.9018,
    "power_capacity": 150000.0,
    "power_used": 87000.0,
    "status": "optimal",
    "profit_per_watt": 0.0234,
    "carbon_intensity": 0.45,
    "energy_price": 0.04,
    "revenue": 12500.0
  }
]
```

### GET /optimization-data
Fetches all sites from the database and processes the latest 12 time series data points from each CSV file to create optimization-ready data structures.

**Response:**
```json
{
  "sites": ["TX", "NV", "MT", "CA", "WY", "OH"],
  "devices": ["air", "hydro", "immersion", "gpu", "asic"],
  "T": 12,
  "r_hash": {
    "TX": {
      "air": 1000,
      "hydro": 5000,
      "immersion": 10000,
      "gpu": 0,
      "asic": 0
    }
  },
  "r_tok": {
    "TX": {
      "air": 0,
      "hydro": 0,
      "immersion": 0,
      "gpu": 100,
      "asic": 500
    }
  },
  "power": {
    "TX": {
      "air": 3500,
      "hydro": 5000,
      "immersion": 10000,
      "gpu": 500,
      "asic": 15000
    }
  },
  "N": {
    "TX": {
      "air": 10,
      "hydro": 5,
      "immersion": 2,
      "gpu": 30,
      "asic": 5
    }
  },
  "h": [8.1, 8.4, 8.7, 8.3, 7.9, 8.2, 8.6, 8.9, 8.5, 8.0, 7.8, 8.1],
  "g": [2.5, 2.7, 2.9, 2.8, 2.6, 2.4, 2.5, 2.8, 3.0, 2.9, 2.7, 2.6],
  "e": {
    "TX": [0.50, 0.52, 0.49, 0.48, 0.47, 0.46, 0.48, 0.50, 0.51, 0.49, 0.48, 0.47]
  },
  "P_MAX": {
    "TX": 150000.0
  },
  "E_BUDGET": 1234567.89
}
```

## Usage with optimize_static_config

The `/optimization-data` endpoint returns data in exactly the format expected by the `optimize_static_config` function:

```python
import requests
from optimization_function_multiple_sites import optimize_static_config

# Get optimization data from API
response = requests.get("http://localhost:8000/optimization-data")
data = response.json()

# Run optimization
config = optimize_static_config(
    sites=data['sites'],
    devices=data['devices'],
    T=data['T'],
    r_hash=data['r_hash'],
    r_tok=data['r_tok'],
    power=data['power'],
    N=data['N'],
    h=data['h'],
    g=data['g'],
    e=data['e'],
    P_MAX=data['P_MAX'],
    E_BUDGET=data['E_BUDGET']
)

# Print results
for (site, device), count in config.items():
    if count > 0:
        print(f"{site} | {device} = {count} units")
```

## Data Sources

The endpoint automatically loads the latest 12 time series data points from:

- `../datasets/hash_price_timeseries.csv` - Hash price data
- `../datasets/token_price_timeseries.csv` - Token price data
- `../datasets/energy_price_{state}_timeseries.csv` - Energy prices per state

## Testing

Run the test script to verify everything works:

```bash
python test_optimization.py
```

This will:
1. Test the sites endpoint
2. Test the optimization endpoint
3. Run the optimization function with the API data
4. Display the optimal configuration results

## Database Schema

### Sites Table
- `id`: Primary key
- `name`: Site name
- `state`: State code (TX, CA, etc.)
- `lat`, `lng`: Coordinates
- `power_capacity`: Maximum power capacity (MW)
- `power_used`: Current power usage (MW)
- `status`: Site status (optimal, high-load, warning, high-carbon)
- `profit_per_watt`: Profit per watt
- `carbon_intensity`: Carbon intensity
- `energy_price`: Energy price per kWh
- `revenue`: Current revenue

### Configurations Table
- `id`: Primary key
- `site_id`: Foreign key to sites table
- `updated_at`: Timestamp
- `inference`: JSON configuration for inference devices
- `miners`: JSON configuration for mining devices 
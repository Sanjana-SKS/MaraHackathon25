import pulp
import json

# from autogluon.timeseries import TimeSeriesPredictor  # Temporarily commented out
import pandas as pd


def extract_site_params(sites_data):
    """
    Extract necessary parameters from sites data
    """
    sites = []
    power = {}
    N = {}
    P_MAX = {}
    energy_prices = {}
    site_states = {}
    r_hash = {}
    r_tok = {}

    # First pass: Get all unique device types
    all_devices = set()
    for site in sites_data:
        all_devices.update(site["miners"].keys())
        if "inference" in site:
            all_devices.update(site["inference"].keys())

    # Initialize all dictionaries with all device types for each site
    for site in sites_data:
        site_id = site["id"]
        sites.append(site_id)
        P_MAX[site_id] = site["powerCapacity"] * 1000  # Convert to watts
        energy_prices[site_id] = site["energyPrice"]
        site_states[site_id] = site["state"]

        # Initialize all device types with default values
        power[site_id] = {d: 0 for d in all_devices}
        N[site_id] = {d: 0 for d in all_devices}
        r_hash[site_id] = {d: 0 for d in all_devices}
        r_tok[site_id] = {d: 0 for d in all_devices}

        # Extract miner parameters
        for miner_type, miner_data in site["miners"].items():
            power[site_id][miner_type] = miner_data["power"]
            N[site_id][miner_type] = miner_data["max_machines"]
            r_hash[site_id][miner_type] = miner_data["hashrate"]

        # Extract inference parameters
        if "inference" in site:
            for infer_type, infer_data in site["inference"].items():
                power[site_id][infer_type] = infer_data["power"]
                N[site_id][infer_type] = infer_data["max_machines"]
                r_tok[site_id][infer_type] = infer_data["tokens"]

    return sites, power, N, P_MAX, energy_prices, site_states, r_hash, r_tok


def optimize_static_config(
    sites,
    devices,
    T,
    r_hash,  # r_hash[s][d]
    r_tok,  # r_tok[s][d]
    power,  # power[s][d]
    N,  # N[s][d]
    h,  # list length T
    g,  # list length T
    e,  # e[s][t]
    P_MAX,  # P_MAX[s]
    E_BUDGET,  # total energy-$ budget
):
    # 1) Precompute profit & energy sums over T
    profit_coeff = {
        s: {
            d: sum(
                r_hash[s][d] * h[t] + r_tok[s][d] * g[t] - power[s][d] * e[s][t]
                for t in range(T)
            )
            for d in devices
        }
        for s in sites
    }
    energy_coeff = {
        s: {d: sum(power[s][d] * e[s][t] for t in range(T)) for d in devices}
        for s in sites
    }

    prob = pulp.LpProblem("static_multi_site", pulp.LpMaximize)

    # 2) Decision vars x[s,d]
    x = {
        (s, d): pulp.LpVariable(
            f"x_{s}_{d}", lowBound=0, upBound=N[s][d], cat="Integer"
        )
        for s in sites
        for d in devices
    }

    # 3) Objective
    prob += pulp.lpSum(profit_coeff[s][d] * x[s, d] for s in sites for d in devices)

    # 4) Per-site power caps
    for s in sites:
        prob += (
            pulp.lpSum(power[s][d] * x[s, d] for d in devices) <= P_MAX[s],
            f"power_cap_{s}",
        )

    # 5) Global energy budget
    prob += (
        pulp.lpSum(energy_coeff[s][d] * x[s, d] for s in sites for d in devices)
        <= E_BUDGET,
        "energy_budget",
    )

    # 6) Solve
    status = prob.solve(pulp.PULP_CBC_CMD(msg=False))
    print("Status:", pulp.LpStatus[status])
    print("Max Total Profit:", pulp.value(prob.objective))

    # 7) Extract config
    return {(s, d): int(x[s, d].value()) for s in sites for d in devices}


if __name__ == "__main__":
    # Load sites data from JSON file
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
    E_BUDGET = sum(site["powerCapacity"] * 1000 * 24 * 30 for site in sites_data)
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
    for (site, device), value in result.items():
        print(f"Site: {site}, Device: {device}, Count: {value}")

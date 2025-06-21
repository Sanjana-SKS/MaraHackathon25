import pulp
from autogluon.timeseries import TimeSeriesPredictor
import pandas as pd


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
    # Devices configuration
    devices = ["air", "hydro", "immersion", "gpu", "asic"]
    T = 12

    # Mock sites data (example - replace with actual database data)
    sites_data = [
        {"id": "site-001", "state": "Texas", "powerCapacity": 150, "energyPrice": 0.04},
        {
            "id": "site-002",
            "state": "Nevada",
            "powerCapacity": 200,
            "energyPrice": 0.06,
        },
        {
            "id": "site-003",
            "state": "Ohio",
            "powerCapacity": 95,
            "energyPrice": 0.03,
        },
        {
            "id": "site-004",
            "state": "California",
            "powerCapacity": 180,
            "energyPrice": 0.08,
        },
        {
            "id": "site-005",
            "state": "Wyoming",
            "powerCapacity": 220,
            "energyPrice": 0.035,
        },
    ]

    # Extract site IDs and states
    sites = [site["id"] for site in sites_data]
    site_states = {site["id"]: site["state"] for site in sites_data}
    P_MAX = {site["id"]: site["powerCapacity"] * 1000 for site in sites_data}

    # Read CSV forecasts
    import pandas as pd

    # Hash price forecast
    h = pd.read_csv("datasets/forecasts/hash_forecast.csv").iloc[:, 1].tolist()[:T]

    # Token price forecast
    g = pd.read_csv("datasets/forecasts/token_forecast.csv").iloc[:, 1].tolist()[:T]

    # Energy price forecasts per state
    e_states = {
        "California": pd.read_csv("datasets/forecasts/cali_energy_forecast.csv")
        .iloc[:, 1]
        .tolist()[:T],
        "Texas": pd.read_csv("datasets/forecasts/texas_energy_forecast.csv")
        .iloc[:, 1]
        .tolist()[:T],
        "Ohio": pd.read_csv("datasets/forecasts/ohio_energy_forecast.csv")
        .iloc[:, 1]
        .tolist()[:T],
        "Nevada": pd.read_csv("datasets/forecasts/nevada_energy_forecast.csv")
        .iloc[:, 1]
        .tolist()[:T],
        "Wyoming": pd.read_csv("datasets/forecasts/wyoming_energy_forecast.csv")
        .iloc[:, 1]
        .tolist()[:T],
    }

    # Map energy prices to sites based on their states
    e = {site: e_states[state] for site, state in site_states.items()}

    # Device specs
    # Device specs (updated values for better distribution)
    # Device specs (more balanced distribution)
    r_hash = {
        "site-001": {
            "air": 1500,
            "hydro": 1800,
            "immersion": 2000,
            "gpu": 1200,
            "asic": 2500,
        },
        "site-002": {
            "air": 1600,
            "hydro": 1900,
            "immersion": 2100,
            "gpu": 1300,
            "asic": 2600,
        },
        "site-003": {
            "air": 1700,
            "hydro": 2000,
            "immersion": 2200,
            "gpu": 1400,
            "asic": 2700,
        },
        "site-004": {
            "air": 1800,
            "hydro": 2100,
            "immersion": 2300,
            "gpu": 1500,
            "asic": 2800,
        },
        "site-005": {
            "air": 1900,
            "hydro": 2200,
            "immersion": 2400,
            "gpu": 1600,
            "asic": 2900,
        },
    }
    r_tok = {
        "site-001": {"air": 50, "hydro": 50, "immersion": 50, "gpu": 50, "asic": 50},
        "site-002": {"air": 45, "hydro": 45, "immersion": 45, "gpu": 45, "asic": 45},
        "site-003": {"air": 55, "hydro": 55, "immersion": 55, "gpu": 55, "asic": 55},
        "site-004": {"air": 60, "hydro": 60, "immersion": 60, "gpu": 60, "asic": 60},
        "site-005": {"air": 65, "hydro": 65, "immersion": 65, "gpu": 65, "asic": 65},
    }
    # Power requirements per device per site (more balanced distribution)
    power = {
        "site-001": {
            "air": 1500,
            "hydro": 2000,
            "immersion": 2500,
            "gpu": 1000,
            "asic": 3000,
        },
        "site-002": {
            "air": 1600,
            "hydro": 2100,
            "immersion": 2600,
            "gpu": 1100,
            "asic": 3100,
        },
        "site-003": {
            "air": 1700,
            "hydro": 2200,
            "immersion": 2700,
            "gpu": 1200,
            "asic": 3200,
        },
        "site-004": {
            "air": 1800,
            "hydro": 2300,
            "immersion": 2800,
            "gpu": 1300,
            "asic": 3300,
        },
        "site-005": {
            "air": 1900,
            "hydro": 2400,
            "immersion": 2900,
            "gpu": 1400,
            "asic": 3400,
        },
    }
    # Maximum device counts per site (increased values for better distribution)
    # Maximum device counts per site (more balanced distribution)
    N = {
        "site-001": {"air": 10, "hydro": 10, "immersion": 8, "gpu": 10, "asic": 8},
        "site-002": {"air": 10, "hydro": 10, "immersion": 8, "gpu": 10, "asic": 8},
        "site-003": {"air": 12, "hydro": 12, "immersion": 10, "gpu": 12, "asic": 10},
        "site-004": {"air": 12, "hydro": 12, "immersion": 10, "gpu": 12, "asic": 10},
        "site-005": {"air": 14, "hydro": 14, "immersion": 12, "gpu": 14, "asic": 12},
    }

    # Global energy‐spend budget
    # Calculate power capacities and energy budget
    P_MAX = {
        site["id"]: site["powerCapacity"] * 1000 for site in sites_data
    }  # Convert MW to W
    E_BUDGET = sum(site["powerCapacity"] * 1000 * 4 for site in sites_data) * 100

    config = optimize_static_config(
        sites, devices, T, r_hash, r_tok, power, N, h, g, e, P_MAX, E_BUDGET
    )

    print("\nOptimal static config (units per site & device):")
    for (s, d), cnt in config.items():
        print(f"{s} | {d:10} = {cnt}")

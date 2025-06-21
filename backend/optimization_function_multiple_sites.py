import pulp


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
    sites = ["CA", "TX", "OH"]
    devices = ["air", "hydro", "immersion", "gpu", "asic"]
    T = 12

    # Price forecasts
    h = [8.1, 8.4, 8.7, 8.3, 7.9, 8.2, 8.6, 8.9, 8.5, 8.0, 7.8, 8.1]
    g = [2.5, 2.7, 2.9, 2.8, 2.6, 2.4, 2.5, 2.8, 3.0, 2.9, 2.7, 2.6]

    # Per-site energy prices
    e = {
        "CA": [0.60, 0.62, 0.58, 0.55, 0.57, 0.59, 0.61, 0.63, 0.60, 0.58, 0.56, 0.57],
        "TX": [0.50, 0.52, 0.49, 0.48, 0.47, 0.46, 0.48, 0.50, 0.51, 0.49, 0.48, 0.47],
        "OH": [0.55, 0.57, 0.56, 0.54, 0.53, 0.52, 0.54, 0.56, 0.55, 0.54, 0.53, 0.52],
    }

    # Device specs
    r_hash = {
        "CA": {"air": 1000, "hydro": 5000, "immersion": 10000, "gpu": 0, "asic": 0},
        "TX": {"air": 800, "hydro": 4500, "immersion": 9000, "gpu": 0, "asic": 0},
        "OH": {"air": 1200, "hydro": 5200, "immersion": 11000, "gpu": 0, "asic": 0},
    }
    r_tok = {
        "CA": {"air": 0, "hydro": 0, "immersion": 0, "gpu": 100, "asic": 500},
        "TX": {"air": 0, "hydro": 0, "immersion": 0, "gpu": 90, "asic": 400},
        "OH": {"air": 0, "hydro": 0, "immersion": 0, "gpu": 110, "asic": 600},
    }
    power = {
        "CA": {
            "air": 3500,
            "hydro": 5000,
            "immersion": 10000,
            "gpu": 500,
            "asic": 15000,
        },
        "TX": {
            "air": 3000,
            "hydro": 4800,
            "immersion": 9500,
            "gpu": 450,
            "asic": 15000,
        },
        "OH": {
            "air": 3600,
            "hydro": 5200,
            "immersion": 10500,
            "gpu": 550,
            "asic": 15000,
        },
    }
    N = {
        "CA": {"air": 10, "hydro": 5, "immersion": 2, "gpu": 30, "asic": 5},
        "TX": {"air": 8, "hydro": 4, "immersion": 2, "gpu": 25, "asic": 4},
        "OH": {"air": 12, "hydro": 6, "immersion": 3, "gpu": 35, "asic": 6},
    }
    P_MAX = {"CA": 80000, "TX": 70000, "OH": 75000}

    # Global energy‐spend budget
    E_BUDGET = 0.60 * 80000 * 4 + 0.50 * 70000 * 4 + 0.55 * 75000 * 4

    config = optimize_static_config(
        sites, devices, T, r_hash, r_tok, power, N, h, g, e, P_MAX, E_BUDGET
    )

    print("\nOptimal static config (units per site & device):")
    for (s, d), cnt in config.items():
        print(f"{s} | {d:10} = {cnt}")

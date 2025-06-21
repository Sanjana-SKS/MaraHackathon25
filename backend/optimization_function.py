import pulp


def optimize_dispatch(r_hash, r_tok, power, N, h, g, e, P_MAX):
    """
    r_hash, r_tok, power, N: dicts keyed by device-name
    h, g, e: lists of length T of hash_price, token_price, energy_price
    P_MAX: scalar max power
    """
    devices = list(r_hash.keys())
    T = len(h)

    # 1) Problem
    prob = pulp.LpProblem("compute_arbitrage", pulp.LpMaximize)

    # 2) Variables
    x = pulp.LpVariable.dicts("x", (devices, range(T)), lowBound=0, cat="Integer")
    y = pulp.LpVariable.dicts("y", range(1, T), lowBound=0, upBound=1, cat="Binary")

    # 3) Objective
    prob += pulp.lpSum(
        (r_hash[d] * h[t] + r_tok[d] * g[t] - power[d] * e[t]) * x[d][t]
        for d in devices
        for t in range(T)
    )

    # 4) Power constraint
    for t in range(T):
        prob += pulp.lpSum(power[d] * x[d][t] for d in devices) <= P_MAX

    # 5) Downtime logic
    for t in range(1, T):
        for d in devices:
            # detect any change
            prob += x[d][t] - x[d][t - 1] <= N[d] * y[t]
            prob += x[d][t - 1] - x[d][t] <= N[d] * y[t]
            # force offline during change
            prob += x[d][t] <= N[d] * (1 - y[t])

    # 6) Solve
    status = prob.solve(pulp.PULP_CBC_CMD(msg=False))
    print("Status:", pulp.LpStatus[status])
    print("Total Profit:", pulp.value(prob.objective))

    # 7) Extract schedule
    schedule = {d: [int(x[d][t].value()) for t in range(T)] for d in devices}
    return schedule


# === Example usage ===
if __name__ == "__main__":
    # 1) Define your devices
    r_hash = {"air": 1000, "hydro": 5000, "immersion": 10000, "gpu": 0}
    r_tok = {"air": 0, "hydro": 0, "immersion": 0, "gpu": 100}
    power = {"air": 3500, "hydro": 5000, "immersion": 10000, "gpu": 500}
    N = {"air": 10, "hydro": 5, "immersion": 2, "gpu": 30}

    # 2) Load or simulate your prices for T intervals
    #    here T=4 for demo
    h = [8.4, 8.6, 8.5, 8.7]  # hash_price
    g = [2.9, 3.0, 2.8, 2.95]  # token_price
    e = [0.65, 0.63, 0.66, 0.64]  # energy_price
    P_MAX = 100000  # total kW available

    schedule = optimize_dispatch(r_hash, r_tok, power, N, h, g, e, P_MAX)
    print("Optimal Schedule (units per interval):")
    for d, seq in schedule.items():
        print(f"  {d}: {seq}")

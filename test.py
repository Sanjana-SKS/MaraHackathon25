# best_config_for_hour.py
from typing import Dict, Any, List
import pulp


def optimise_over_hour(
    config: Dict[str, Any],
    price_series: List[Dict[str, float]],) -> Dict[str, int]:
    """Find the best single config that maximizes cumulative profit over the next hour."""
    entries = {}

    # Flatten the config
    for kind, spec in config["inference"].items():
        entries[f"inference_{kind}"] = {
            "power": spec["power"],
            "hashrate": 0,
            "tokens": spec["tokens"],
            "max": spec["max_machines"],
        }
    for kind, spec in config["miners"].items():
        entries[f"miner_{kind}"] = {
            "power": spec["power"],
            "hashrate": spec["hashrate"],
            "tokens": 0,
            "max": spec["max_machines"],
        }

    # Compute cumulative profit per machine type across time horizon
    for e in entries.values():
        total_profit = 0
        for snap in price_series:
            cE, cH, cT = snap["energy_price"], snap["hash_price"], snap["token_price"]
            revenue = e["hashrate"] * cH + e["tokens"] * cT
            cost = e["power"] * cE
            total_profit += (revenue - cost)
        e["cumulative_profit"] = total_profit

    # Build MILP
    prob = pulp.LpProblem("best_config_over_hour", pulp.LpMaximize)
    x = {
        name: pulp.LpVariable(name, 0, spec["max"], cat="Integer")
        for name, spec in entries.items()
    }

    # Objective: Maximize total profit across all 12 time slices
    prob += pulp.lpSum(x[name] * spec["cumulative_profit"] for name, spec in entries.items())

    # Power cap applies per time slice, so divide by number of intervals
    prob += (
        pulp.lpSum(x[name] * spec["power"] for name, spec in entries.items())
        <= config["power"],
        "power_cap"
    )

    prob.solve(pulp.PULP_CBC_CMD(msg=False))

    return {name: int(var.value()) for name, var in x.items()}

if __name__ == "__main__":
    from pprint import pprint

    config = {
        "inference": {
            "asic": {"max_machines": 10, "power": 3000, "tokens": 50},
            "gpu": {"max_machines": 5, "power": 5000, "tokens": 1000}
        },
        "miners": {
            "air": {"max_machines": 20, "hashrate": 1000, "power": 3500},
            "hydro": {"max_machines": 10, "hashrate": 5000, "power": 5000},
            "immersion": {"max_machines": 5, "hashrate": 10000, "power": 10000}
        },
        "power": 50000,
        "id": 5,
        "site_id": 2,
        "updated_at": "2025-06-21T13:17:50.126193"
    }

    price_series = [
        {
            "timestamp": "2025-06-21T13:00:00",
            "energy_price": 0.647889223893815,
            "hash_price": 8.448180236220946,
            "token_price": 2.91225594861526
        },
        {
            "timestamp": "2025-06-21T12:55:00",
            "energy_price": 0.6811324570646737,
            "hash_price": 9.255307305610396,
            "token_price": 2.532149968985806
        },
        {
            "timestamp": "2025-06-21T12:50:00",
            "energy_price": 0.6491505669853906,
            "hash_price": 8.32135884623703,
            "token_price": 3.0
        }
        # Add more as needed to fill the full hour
    ]

    result = optimise_over_hour(config, price_series)
    pprint(result)

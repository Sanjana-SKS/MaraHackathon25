#!/usr/bin/env python3
import requests
import pandas as pd
from datetime import datetime, timedelta

# ── CONFIG ─────────────────────────────────────────────────────────────────────
EIA_API_KEY = "ceSdX9VnmCtbyjydwYNRZPCHOtHcDKFCHvVnGzur"
SERIES_ID = "EBA.CISO-ALL.D.HL"  # all-node hourly LMP
TOTAL_BARS = 10000  # number of 5-min points
FREQ = "5T"  # pandas freq string for 5-minute


def fetch_hourly_lmp():
    """Fetch hourly CAISO all-node LMP from EIA."""
    r = requests.get(
        "https://api.eia.gov/series/",
        params={"api_key": EIA_API_KEY, "series_id": SERIES_ID},
    )
    r.raise_for_status()
    data = r.json()["series"][0]["data"]
    df = pd.DataFrame(data, columns=["time", "price"])
    df["time"] = pd.to_datetime(df["time"])
    df = df.set_index("time").sort_index()
    df.index = df.index.tz_localize("UTC")
    return df["price"].astype(float)


def expand_to_5min(hourly: pd.Series):
    """Upsample hourly series to 5-min by forward-filling."""
    end = hourly.index[-1]
    start = end - timedelta(minutes=5 * (TOTAL_BARS - 1))
    full_idx = pd.date_range(start=start, end=end, freq=FREQ, tz="UTC")
    return hourly.reindex(full_idx, method="ffill").rename("energy_price")


def main():
    hourly = fetch_hourly_lmp()
    energy_5m = expand_to_5min(hourly)

    out = energy_5m.reset_index()
    out.columns = ["timestamp", "energy_price"]
    out["timestamp"] = out["timestamp"].dt.strftime("%Y-%m-%dT%H:%M:%S")
    out.to_csv("energy_price_timeseries.csv", index=False)
    print(f"Wrote {len(out)} rows to energy_price_timeseries.csv")


if __name__ == "__main__":
    main()

import streamlit as st
import requests
from datetime import datetime

st.title("Bitcoin Mining Site Configuration")

# Site Information
site_id = st.number_input("Site ID", min_value=1, step=1)

# Inference - ASIC
st.header("Inference - ASIC")
asic_max = st.number_input("ASIC Max Machines", min_value=0, step=1)
asic_power = st.number_input("ASIC Power (W)", min_value=0, step=1)
asic_tokens = st.number_input("ASIC Tokens", min_value=0, step=1)

# Inference - GPU
st.header("Inference - GPU")
gpu_max = st.number_input("GPU Max Machines", min_value=0, step=1)
gpu_power = st.number_input("GPU Power (W)", min_value=0, step=1)
gpu_tokens = st.number_input("GPU Tokens", min_value=0, step=1)

# Miners - Air Cooling
st.header("Miners - Air Cooling")
air_max = st.number_input("Air Max Machines", min_value=0, step=1)
air_hashrate = st.number_input("Air Hashrate (MH/s)", min_value=0, step=1)
air_power = st.number_input("Air Power (W)", min_value=0, step=1)

# Miners - Hydro Cooling
st.header("Miners - Hydro Cooling")
hydro_max = st.number_input("Hydro Max Machines", min_value=0, step=1)
hydro_hashrate = st.number_input("Hydro Hashrate (MH/s)", min_value=0, step=1)
hydro_power = st.number_input("Hydro Power (W)", min_value=0, step=1)

# Miners - Immersion Cooling
st.header("Miners - Immersion Cooling")
imm_max = st.number_input("Immersion Max Machines", min_value=0, step=1)
imm_hashrate = st.number_input("Immersion Hashrate (MH/s)", min_value=0, step=1)
imm_power = st.number_input("Immersion Power (W)", min_value=0, step=1)

if st.button("Submit Configuration"):
    payload = {
        "inference": {
            "asic": {"max_machines": asic_max, "power": asic_power, "tokens": asic_tokens},
            "gpu": {"max_machines": gpu_max, "power": gpu_power, "tokens": gpu_tokens},
        },
        "miners": {
            "air": {"max_machines": air_max, "hashrate": air_hashrate, "power": air_power},
            "hydro": {"max_machines": hydro_max, "hashrate": hydro_hashrate, "power": hydro_power},
            "immersion": {"max_machines": imm_max, "hashrate": imm_hashrate, "power": imm_power},
        },
        "site_id": site_id,
        "updated_at": datetime.utcnow().isoformat(),
    }
    try:
        response = requests.post("http://localhost:8000/config", json=payload)
        if response.ok:
            st.success("Configuration submitted successfully!")
            st.json(response.json())
        else:
            st.error(f"Error {response.status_code}: {response.text}")
    except Exception as e:
        st.error(f"Request failed: {e}")

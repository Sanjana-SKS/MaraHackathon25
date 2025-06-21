# MaraHackathon25
Our repo for the 2025 Mara Holdings Hackathon!

## Mining Site Management Application

This application consists of a FastAPI backend and a Streamlit frontend for managing bitcoin mining site data.

### Prerequisites

- Python 3.8+
- pip (Python package manager)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd MaraHackathon25
   ```

2. Create and activate a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```

3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Running the Application

#### 1. Start the FastAPI Backend

Open a terminal and run:

```bash
cd backend
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

#### 2. Start the Streamlit Frontend

Open another terminal and run:

```bash
cd frontend
streamlit run app.py
```

The Streamlit app will open in your default web browser at `http://localhost:8501`

### API Documentation

Once the FastAPI server is running, you can access the interactive API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Features

- Create new mining sites with detailed configuration
- View existing site details
- Real-time form validation
- Responsive UI for all device sizes

### Project Structure

```
MaraHackathon25/
├── backend/
│   ├── models/
│   │   ├── __init__.py
│   │   ├── Site.py
│   │   ├── Inference.py
│   │   └── Miner.py
│   └── main.py
├── frontend/
│   └── app.py
├── requirements.txt
└── README.md
```

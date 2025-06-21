# server.py
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime
from typing import Dict
from sqlalchemy import (
    create_engine, Column, BigInteger, DateTime, JSON
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

DATABASE_URL = "postgresql://admin:83aYLeQhTn0f1m8y2Wl077K6I0cpO0QT@dpg-d1a9jo3e5dus73eculjg-a.oregon-postgres.render.com/project_database_vccc"

# --- SQLAlchemy setup ---
engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

class MiningConfig(Base):
    __tablename__ = "configurations"
    id = Column(BigInteger, primary_key=True, index=True)
    site_id = Column(BigInteger, index=True, nullable=False)
    updated_at = Column(DateTime, nullable=False)
    inference = Column(JSON, nullable=False)
    miners = Column(JSON, nullable=False)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Pydantic models ---
class ASICModel(BaseModel):
    max_machines: int
    power: int
    tokens: int

class GPUModel(BaseModel):
    max_machines: int
    power: int
    tokens: int

class InferenceModel(BaseModel):
    asic: ASICModel
    gpu: GPUModel

class MinerModel(BaseModel):
    max_machines: int
    hashrate: int
    power: int

class MinersModel(BaseModel):
    air: MinerModel
    hydro: MinerModel
    immersion: MinerModel

class SiteConfig(BaseModel):
    inference: InferenceModel
    miners: MinersModel
    site_id: int
    updated_at: datetime

# --- FastAPI app ---
app = FastAPI()

@app.post("/config")
def create_config(cfg: SiteConfig, db: Session = Depends(get_db)):
    db_obj = MiningConfig(
        site_id=cfg.site_id,
        updated_at=cfg.updated_at,
        inference=cfg.inference.dict(),
        miners=cfg.miners.dict(),
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return {
        "id": db_obj.id,
        "site_id": db_obj.site_id,
        "updated_at": db_obj.updated_at.isoformat(),
        "inference": db_obj.inference,
        "miners": db_obj.miners,
    }

from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from prometheus_fastapi_instrumentator import Instrumentator

from .config import settings
from .db import Base, engine, get_db
from .models import Deployment
from .schemas import DeploymentCreate, DeploymentOut, DeploymentUpdate, StatsOut


@asynccontextmanager
async def lifespan(_app: FastAPI):
    # Containers run Alembic before Uvicorn; create_all keeps local tests self-contained.
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title=settings.app_name, version="1.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
Instrumentator().instrument(app).expose(app, endpoint="/metrics")

@app.get("/")
def root():
    return {"service": settings.app_name, "version": "1.0.0", "docs": "/docs"}

@app.get("/health")
def health():
    return {"status": "UP"}

@app.get("/ready")
def ready(db: Session = Depends(get_db)):
    db.execute(select(func.count(Deployment.id)))
    return {"status": "READY"}

@app.get("/api/deployments", response_model=list[DeploymentOut])
def list_deployments(db: Session = Depends(get_db)):
    return list(db.scalars(select(Deployment).order_by(Deployment.id.desc())))

@app.get("/api/deployments/stats", response_model=StatsOut)
def stats(db: Session = Depends(get_db)):
    rows = db.execute(select(Deployment.status, func.count(Deployment.id)).group_by(Deployment.status)).all()
    counts = dict(rows)
    return StatsOut(total=sum(counts.values()), planned=counts.get("PLANNED", 0), running=counts.get("RUNNING", 0), succeeded=counts.get("SUCCEEDED", 0), failed=counts.get("FAILED", 0))

@app.get("/api/deployments/{deployment_id}", response_model=DeploymentOut)
def get_deployment(deployment_id: int, db: Session = Depends(get_db)):
    deployment = db.get(Deployment, deployment_id)
    if not deployment:
        raise HTTPException(status_code=404, detail="Deployment not found")
    return deployment

@app.post("/api/deployments", response_model=DeploymentOut, status_code=status.HTTP_201_CREATED)
def create_deployment(payload: DeploymentCreate, db: Session = Depends(get_db)):
    deployment = Deployment(**payload.model_dump())
    db.add(deployment)
    db.commit()
    db.refresh(deployment)
    return deployment

@app.put("/api/deployments/{deployment_id}", response_model=DeploymentOut)
def update_deployment(deployment_id: int, payload: DeploymentUpdate, db: Session = Depends(get_db)):
    deployment = db.get(Deployment, deployment_id)
    if not deployment:
        raise HTTPException(status_code=404, detail="Deployment not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(deployment, key, value)
    db.commit()
    db.refresh(deployment)
    return deployment

@app.delete("/api/deployments/{deployment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_deployment(deployment_id: int, db: Session = Depends(get_db)):
    deployment = db.get(Deployment, deployment_id)
    if not deployment:
        raise HTTPException(status_code=404, detail="Deployment not found")
    db.delete(deployment)
    db.commit()

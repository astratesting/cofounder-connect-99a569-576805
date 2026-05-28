import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routers import api, auth

Base.metadata.create_all(bind=engine)

app = FastAPI(title='CoFounder Connect API', version='1.0.0')
origins = [origin.strip() for origin in os.getenv('BACKEND_CORS_ORIGINS', 'http://localhost:3000').split(',') if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(auth.router)
app.include_router(api.router)


@app.get('/health')
def health():
    return {'status': 'ok', 'service': 'cofounder-connect'}

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize APScheduler
    from services.scheduler import start_scheduler, stop_scheduler
    start_scheduler()
    yield
    # Shutdown
    stop_scheduler()


app = FastAPI(title="Deluxe Opt Service API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routes.products import router as products_router
from routes.cart import router as cart_router
from routes.upload import router as upload_router
from routes.orders import router as orders_router

app.include_router(products_router, prefix="/api")
app.include_router(cart_router, prefix="/api")
app.include_router(upload_router, prefix="/api")
app.include_router(orders_router, prefix="/api")

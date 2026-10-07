from fastapi import FastAPI

from app.api.routes.candidates import router as candidates_router


app = FastAPI(
    title="AI Interview Coach API",
    description="Backend API for the AI Interview Coach.",
    version="0.1.0",
)


app.include_router(
    candidates_router,
    prefix="/api/v1",
)


@app.get("/health")
async def health_check() -> dict[str, str]:
    """Health check endpoint."""

    return {"status": "healthy"}
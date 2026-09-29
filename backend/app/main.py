from fastapi import FastAPI

app = FastAPI(
    title="AI Interview Coach API",
    description="Backend API for the AI Interview Coach.",
    version="0.1.0",
)


@app.get("/")
async def root():
    return {
        "message": "AI Interview Coach API is running"
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy"
    }
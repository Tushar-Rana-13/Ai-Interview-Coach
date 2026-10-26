
import asyncio

from app.services.resume_analysis import analyze_resume


async def main() -> None:
    try:
        await analyze_resume("Test resume")
    except RuntimeError as exc:
        print(exc)


if __name__ == "__main__":
    asyncio.run(main())

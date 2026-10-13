
from pathlib import Path
from uuid import uuid4
from zipfile import BadZipFile, ZipFile

from fastapi import HTTPException, UploadFile, status


MAX_RESUME_SIZE = 5 * 1024 * 1024  # 5 MB

STORAGE_DIR = Path(__file__).resolve().parent.parent / "storage" / "resumes"

ALLOWED_EXTENSIONS = {
    ".pdf": "application/pdf",
    ".docx": (
        "application/vnd.openxmlformats-officedocument."
        "wordprocessingml.document"
    ),
}


async def save_resume(upload: UploadFile) -> tuple[str, str]:
    """Validate and store a PDF or DOCX resume.

    Returns:
        A tuple containing the generated filename and relative storage path.
    """

    original_name = upload.filename or ""
    extension = Path(original_name).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Only PDF and DOCX files are supported.",
        )

    STORAGE_DIR.mkdir(parents=True, exist_ok=True)

    generated_name = f"{uuid4().hex}{extension}"
    final_path = STORAGE_DIR / generated_name
    temporary_path = STORAGE_DIR / f"{uuid4().hex}.uploading"

    total_size = 0
    first_bytes = b""

    try:
        with temporary_path.open("wb") as destination:
            while chunk := await upload.read(64 * 1024):
                total_size += len(chunk)

                if total_size > MAX_RESUME_SIZE:
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail="Resume file must not exceed 5 MB.",
                    )

                if len(first_bytes) < 8:
                    first_bytes += chunk[: 8 - len(first_bytes)]

                destination.write(chunk)

        if total_size == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The uploaded file is empty.",
            )

        if extension == ".pdf":
            if not first_bytes.startswith(b"%PDF-"):
                raise HTTPException(
                    status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                    detail="The uploaded file is not a valid PDF signature.",
                )

        elif extension == ".docx":
            if not first_bytes.startswith(b"PK"):
                raise HTTPException(
                    status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                    detail="The uploaded file is not a valid DOCX archive.",
                )

            try:
                with ZipFile(temporary_path) as archive:
                    members = set(archive.namelist())

                    if (
                        "[Content_Types].xml" not in members
                        or "word/document.xml" not in members
                    ):
                        raise HTTPException(
                            status_code=(
                                status.HTTP_415_UNSUPPORTED_MEDIA_TYPE
                            ),
                            detail="The uploaded DOCX structure is invalid.",
                        )

            except BadZipFile as exc:
                raise HTTPException(
                    status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                    detail="The uploaded DOCX archive is corrupted.",
                ) from exc

        temporary_path.replace(final_path)

        relative_path = final_path.relative_to(
            STORAGE_DIR.parent.parent
        ).as_posix()

        return generated_name, relative_path

    except Exception:
        temporary_path.unlink(missing_ok=True)
        raise

    finally:
        await upload.seek(0)

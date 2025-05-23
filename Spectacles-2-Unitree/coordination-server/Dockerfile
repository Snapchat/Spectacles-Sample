FROM ubuntu:noble AS build

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    apt-transport-https \
    curl \
    gnupg \
    # Needed for some Python dependencies that want the full non-headless version of OpenCV.
    libgl1 \
    libglib2.0-0 \
    lsb-release \
    python3.12 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy UV_PYTHON_DOWNLOADS=0

WORKDIR /app

ADD . .

RUN uv sync --no-install-project --no-dev

RUN uv sync --no-dev

FROM ubuntu:noble AS runtime

LABEL org.opencontainers.image.description="Spectacles-2-Unitree Coordination Server"

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3.12 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=build /app /app
ENV PATH="/app/.venv/bin:${PATH}"
WORKDIR /app/src
EXPOSE 80
CMD ["python3.12", "main.py"]
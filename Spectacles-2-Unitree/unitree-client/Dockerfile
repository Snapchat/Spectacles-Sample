FROM nvcr.io/nvidia/l4t-cuda:11.4.19-runtime AS base

ARG UV_VERSION=0.6.2

ENV DEBIAN_FRONTEND=noninteractive \
    CYCLONEDDS_HOME=/usr/local

RUN apt-get update \
    && apt-get install -y \
    software-properties-common \
    bzip2 \
    curl \
    git \
    cmake \
    ca-certificates \
    libgl1 \
    libglib2.0-0 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN add-apt-repository -y ppa:deadsnakes/ppa \
    && apt-get update \
    && apt-get install -y \
    python3.10 \
    libpython3.10-dev \
    python3.10-dev \
    python3.10-venv \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://neuro.debian.net/_static/neuro.debian.net.asc \
    | gpg --dearmor -o /etc/apt/trusted.gpg.d/neurodebian.gpg \
    && curl -fsSL http://neuro.debian.net/lists/bookworm.us-ca.full > /etc/apt/sources.list.d/neurodebian.sources.list

FROM base AS builder

# Build CycloneDDS: the unitree-sdk2py depends on CycloneDDS 0.10.2
RUN git clone --branch=0.10.2 https://github.com/eclipse-cyclonedds/cyclonedds /tmp/cyclonedds \
    && cd /tmp/cyclonedds \
    && mkdir build && cd build \
    && cmake ..\
    -DCMAKE_INSTALL_PREFIX=/usr/local \
    -DENABLE_PACKAGING=ON \
    -DENABLE_TYPELIB=ON \
    && cmake --build . -j$(nproc) --target install \
    && cd / \
    && rm -rf /tmp/cyclonedds
RUN ln -s /usr/local/lib/pkgconfig/CycloneDDS.pc /usr/local/lib/pkgconfig/cyclonedds.pc

RUN curl -fsSL https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-aarch64.sh -o /tmp/miniforge.sh \
    && chmod +x /tmp/miniforge.sh \
    && /tmp/miniforge.sh -b -p /opt/conda \
    && rm /tmp/miniforge.sh

SHELL ["/bin/bash", "-c"]

ENV PATH="/opt/conda/bin:${PATH}"

COPY environment.yml environment.yml

RUN source /opt/conda/etc/profile.d/conda.sh \
    && conda env create -f environment.yml \
    && conda clean -afy

FROM base AS runtime

LABEL org.opencontainers.image.description="Spectacles-2-Unitree Robot Client"

ENV LD_LIBRARY_PATH="/app/.venv/lib64/python3.10/site-packages/casadi:$LD_LIBRARY_PATH"
ENV PATH="/opt/conda/bin:${PATH}"

COPY --from=builder /usr/local/ /usr/local
COPY --from=builder /opt/conda/ /opt/conda

RUN apt-get update && apt-get install -y \
    iproute2 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

SHELL ["/bin/bash", "-c"]

RUN source /opt/conda/etc/profile.d/conda.sh \
    && conda activate unitree-client \
    && pip install --no-cache-dir \
    meshcat@git+https://github.com/TastyDucks/meshcat-python.git \
    unitree_sdk2py@git+https://github.com/TastyDucks/unitree_sdk2_python.git \
    cyclonedds==0.10.2

WORKDIR /app

COPY . .

WORKDIR /app/src
ENTRYPOINT ["/bin/bash", "-c", "source /opt/conda/etc/profile.d/conda.sh && conda activate unitree-client && exec python main.py \"$@\"", "--"]
FROM ubuntu:noble AS dev

LABEL org.opencontainers.image.description="Spectacles-2-Unitree dev container"

ARG UV_VERSION=0.6.2

ENV CYCLONEDDS_HOME=/usr/local \
    DEBIAN_FRONTEND=noninteractive \
    PATH="/opt/conda/bin:${PATH}"

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

RUN . /etc/lsb-release \
    # Git LFS
    && curl -fsSL https://packagecloud.io/github/git-lfs/gpgkey \
    | gpg --dearmor -o /etc/apt/keyrings/github_git-lfs-archive-keyring.gpg \
    && curl -fsSL "https://packagecloud.io/install/repositories/github/git-lfs/config_file.list?os=${DISTRIB_ID}&dist=${DISTRIB_CODENAME}" > /etc/apt/sources.list.d/github_git-lfs.list \
    # GitHub CLI
    && curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg -o /usr/share/keyrings/githubcli.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli.gpg] https://cli.github.com/packages stable main" > /etc/apt/sources.list.d/github-cli.list \
    # Docker
    && curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" > /etc/apt/sources.list.d/docker.list

# Additional dev packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    cmake \
    docker-buildx-plugin \
    docker-ce-cli \
    gcc-aarch64-linux-gnu \
    gh \
    git \
    git-lfs \
    htop \
    iputils-ping \
    jq \
    less \
    linux-tools-common \
    linux-tools-generic \
    micro \
    net-tools \
    openssl \
    pipx \
    python3-pip \
    ssh \
    unzip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install act
RUN --mount=type=cache,target=/root/.cache/act \
    curl --proto '=https' --tlsv1.2 -sSf https://raw.githubusercontent.com/nektos/act/master/install.sh | bash

# Install uv
RUN pipx ensurepath && pipx install "uv==$UV_VERSION"

# Install conda
RUN curl -fsSL https://github.com/conda-forge/miniforge/releases/download/25.3.0-1/Miniforge3-25.3.0-1-Linux-aarch64.sh -o /tmp/miniforge.sh \
    && chmod +x /tmp/miniforge.sh \
    && /tmp/miniforge.sh -b -p /opt/conda \
    && rm /tmp/miniforge.sh

# Build CycloneDDS
RUN git clone https://github.com/eclipse-cyclonedds/cyclonedds /tmp/cyclonedds \
    && cd /tmp/cyclonedds \
    # The unitree-sdk2py depends on CycloneDDS 0.10.2
    && git checkout 0.10.2 \
    && mkdir build && cd build \
    && cmake -DCMAKE_INSTALL_PREFIX=/usr/local .. \
    && cmake --build . --target install \
    && cd / && rm -rf /tmp/cyclonedds

SHELL ["/bin/bash", "-c"]

COPY unitree-client/environment.yml environment.yml

RUN source /opt/conda/etc/profile.d/conda.sh \
    && conda env create -f environment.yml \
    && conda clean -afy

RUN source /opt/conda/etc/profile.d/conda.sh \
    && conda activate unitree-client \
    && pip install --no-cache-dir \
    meshcat@git+https://github.com/TastyDucks/meshcat-python.git \
    unitree_sdk2py@git+https://github.com/TastyDucks/unitree_sdk2_python.git \
    cyclonedds==0.10.2
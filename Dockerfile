FROM node:20

# Set environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_SKIP_DOWNLOAD=true

# Install system dependencies
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     build-essential \
#     ca-certificates \
#     ffmpeg \
#     git \
#     pkgconf \
#     tar \
#     unzip \
#     wget \
#     gnupg \
#     libjpeg-dev \
#     libpng-dev \
#     libopencv-dev \
#     libtiff-dev \
#     libv4l-dev \
#     libxvidcore-dev \
#     libx264-dev \
#     libavcodec-dev \
#     libavformat-dev \
#     libavutil-dev \
#     libswscale-dev \
#     libdc1394-dev \
#     libgstreamer-plugins-base1.0-dev \
#     libgstreamer1.0-dev \
#     make \
#     gcc \
#     g++ && \
#     rm -rf /var/lib/apt/lists/*

    RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    ca-certificates \
    git \
    pkgconf \
    tar \
    unzip \
    wget \
    gnupg \
    libjpeg-dev \
    libpng-dev \
    libopencv-dev \
    libtiff-dev \
    libv4l-dev \
    make \
    gcc \
    g++ && \
    rm -rf /var/lib/apt/lists/*

# Install Google Chrome Stable
RUN wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list && \
    apt-get update && \
    apt-get install google-chrome-stable -y --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Update npm to a compatible version
RUN npm install -g npm@^7

# Create a user with name 'app' and group that will be used to run the app
RUN groupadd -r app && useradd -rm -g app -G audio,video app

# Set up the app directory
RUN mkdir -p /opt/app
WORKDIR /opt/app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Copy the rest of the application
COPY src/ ./src

# Install npm dependencies
RUN npm install --force

# Build the application
#RUN npm run build

# Optimize permissions
RUN chown -R app:app /opt/app && \
    chmod -R 755 /opt/app

# Switch to non-root user
USER app

# Expose port
EXPOSE 4200

# Command to run the application
CMD [ "npm", "start" ]
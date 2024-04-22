# # Stage 1: Build stage
# FROM node:18.16.0-alpine3.17 AS build

# # Install build dependencies
# # RUN apk --no-cache add \
# #     build-base \
# #     cmake \
# #     ffmpeg \
# #     git \
# #     pkgconfig \
# #     tar \
# #     unzip \
# #     wget 

# # Update npm to a compatible version
# RUN npm install -g npm@^7

# # Set environment variables
# # ENV project=puppeteer-streamer
# # ENV cwd=/tmp/$project

# # Install dependencies for multimedia processing
# RUN apk --no-cache add \
#     libjpeg \
#     libjpeg-turbo-dev \
#     libpng \
#     libpng-dev \
#     v4l-utils \
#     ffmpeg \
#     ffmpeg-dev \
#     ffmpeg-libs \
#     libavc1394 \
#     libavc1394-dev \
#     udev \
#     ttf-freefont \
#     chromium \
#     chromium-chromedriver

# # Stage 2: Runtime stage
# FROM node:18.16.0-alpine3.17

# # Copy built dependencies from the previous stage
# COPY --from=build /usr/local/ /usr/local/

# # Set up the app directory
# RUN mkdir -p /opt/app
# WORKDIR /opt/app

# # Copy package.json and package-lock.json to leverage Docker cache
# COPY package.json ./

# # Install npm dependencies
# RUN npm install -f

# # Copy the rest of the application
# COPY src/ ./

# # Expose port
# EXPOSE 4200

# # Command to run the application
# CMD [ "npm", "start" ]
#########################################################################
#Old
####################################################################
# FROM node:20

# # We don't need the standalone Chromium
# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# ENV PUPPETEER_SKIP_DOWNLOAD true

# ENV DEBUG=puppeteer:*

# RUN apt-get update && apt-get install -y \
#     build-essential \
#     ca-certificates \
#     ffmpeg \
#     git \
#     pkgconf \
#     tar \
#     unzip \
#     wget \
#     gnupg

# RUN apt-get install -y \
#     libjpeg-dev \
#     libpng-dev\
#     libopencv-dev \
#     libjpeg-dev \
#     libpng-dev \
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
#     g++ 

# RUN apt-get update && apt list --all-versions chromium

# # Install Google Chrome Stable and fonts
# # Note: this installs the necessary libs to make the browser work with Puppeteer.
# RUN wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
# sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
# apt-get update && \
# apt-get install google-chrome-stable -y --no-install-recommends && \
# rm -rf /var/lib/apt/lists/*

# # Create a user with name 'app' and group that will be used to run the app
# RUN groupadd -r app && useradd -rm -g app -G audio,video app

# # RUN npx puppeteer browsers install chrome

# # Update npm to a compatible version
# RUN npm install -g npm@^7

# # Set up the app directory
# RUN mkdir -p /opt/app
# WORKDIR /opt/app

# # Copy package.json and package-lock.json to leverage Docker cache
# COPY package.json ./

# # Install npm dependencies
# RUN npm install

# RUN npm build

# # Copy the rest of the application
# COPY src/ ./

# # Expose port
# EXPOSE 4200

# # Give app user access to all the project folder
# RUN chown -R app:app /opt/app

# RUN chmod -R 777 /opt/app

# USER app

# # Command to run the application
# CMD [ "npm", "start" ]
#########################################################################
#NEW
###########################################3
FROM node:20

# Set environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_SKIP_DOWNLOAD=true \
    DEBUG=puppeteer:*

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    ca-certificates \
    ffmpeg \
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
    libxvidcore-dev \
    libx264-dev \
    libavcodec-dev \
    libavformat-dev \
    libavutil-dev \
    libswscale-dev \
    libdc1394-dev \
    libgstreamer-plugins-base1.0-dev \
    libgstreamer1.0-dev \
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
COPY src/ ./

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

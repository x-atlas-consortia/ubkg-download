# Parent image
FROM node:24-bookworm-slim

LABEL description="UBKG Download"

ARG HOST_GID
ARG HOST_UID
ARG IMAGE_USER

# Change to directory that contains the Dockerfile
WORKDIR /usr/src/app

COPY . .

# Install curl to be used healthcheck
# Create the non-root user
# Copy the entrypoint script and make it executible
# Ensure non-root user has access to the target directory
RUN apt-get update -y && \
    apt-get install curl -y && \
    groupadd -g ${HOST_GID} ${IMAGE_USER} && \
    useradd -u ${HOST_UID} -m -g ${HOST_GID} -s /bin/bash ${IMAGE_USER} && \
    chown -R ${IMAGE_USER}:${IMAGE_USER} /usr/src/app

# Change to source code directory
WORKDIR /usr/src/app/src

# Update to latest npm, install dependencies, and build app
RUN npm install npm@latest -g && \
    npm install && \
    npm run build

USER ${IMAGE_USER}

# Inform Docker that the container listens on the specified network ports at runtime. 
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]
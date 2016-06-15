FROM node:4
MAINTAINER Capra <kla@capraconsulting.no>

# Create app directory
RUN mkdir -p /app
WORKDIR /app

EXPOSE 9000

# Copy application
COPY . /app

# Build image
RUN set -ex \
	&& npm install \
    && npm run build

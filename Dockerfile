FROM node:4
MAINTAINER Capra <kla@capraconsulting.no>

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Copy application
COPY . /app

# Build image
RUN set -ex \
	&& npm install

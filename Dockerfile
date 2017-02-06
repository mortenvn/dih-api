FROM node:6
MAINTAINER Capra <kla@capraconsulting.no>

# Create app directory
RUN mkdir -p /app
WORKDIR /app

EXPOSE 9000

# Copy application
COPY . /app

# Build image
RUN npm install yarn -g
RUN yarn install
RUN yarn build

# Start the server
ENTRYPOINT ["yarn", "start"]

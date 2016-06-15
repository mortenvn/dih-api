# dih-api

## Setup
Here you have two options: Either start Postgres yourself, and set `PG_URL ` to your database. Start with `npm start`.

Or you can let Docker Compose do the work for you: Run `docker-compose up`, and reach the API on port 3000.


## Deployment
We have continious deployment with [Circle CI](http://circleci.com), which builds Docker-images and pushes to AWS EC2.

The `dev`-branch

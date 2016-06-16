# dih-api

__Build status:__

| `dev` | `master`|
| :--  |:--|
|[![CircleCI](https://circleci.com/gh/capraconsulting/dih-api/tree/dev.svg?style=svg&circle-token=31ea42d745bf7499e768623c89901f32adadcf9b)](https://circleci.com/gh/capraconsulting/dih-api/tree/dev)| [![CircleCI](https://circleci.com/gh/capraconsulting/dih-api/tree/master.svg?style=svg&circle-token=31ea42d745bf7499e768623c89901f32adadcf9b)](https://circleci.com/gh/capraconsulting/dih-api/tree/master) |

## Workflow

1. Get a task on JIRA by talking to you teammates and looking at the sprint backlog.
2. Create a new branch  from the `dev`-branch : If it's a feature (new functionality) name the branch `feature/DIH-num` where `DIH-num` is the task ID on JIRA. If it's a bugfix name the branch `bugfix/DIH_num`.
3. Code away and commit often. Try to follow [good commit practice](http://chris.beams.io/posts/git-commit/). Remember to write tests (and run them).
4. When you're done (see definition of done on GitHub), create a pull request with reference to the JIRA-issue (preferably a link) and an overview of what the pull request is about. Await code review (you can tag people or yell for them on Slack to get your review faster).
5. When you've reworked your code after the code review, the pull request will be merged


## Setup
To setup the project locally install Postgres and set `PG_URL ` to your database. Run `npm run build` to get a transpiled version of the API, then start with `npm start`.

If you're gonna develop:

1. Install nodemon `npm install -g nodemon`
2. Run  `npm run start:dev`

This will watch for changes and keep it open for you.

## Tests
Run unit tests with `npm test`. This will use your local database.

For testing everything isolated (without a local Postgres)  we use Docker Compose, which pulls a Postgres-image, sets it up with the API and runs the tests:

1. Build the image `docker build -t dih/api-dev .`
2.  Run `docker-compose up`

This is what happens on our CI-setup.

## Deployment
We have continuous deployment with [Circle CI](http://circleci.com), which builds Docker-images and pushes to AWS EC2.

* The `dev`-branch is the main branch, and has CI to our staging environment.
* The `master`-branch is the stable branch, and has CI to our production environment.

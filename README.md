# dih-api

## Setup
To setup the project locally you have two options: Either start Postgres yourself, and set `PG_URL ` to your database. Start with `npm start`.

Or you can let Docker Compose do the work for you: Run `docker-compose up`, and reach the API on port 3000.


## Deployment
We have continuous deployment with [Circle CI](http://circleci.com), which builds Docker-images and pushes to AWS EC2.

* The `dev`-branch is the main branch, and has CI to our staging environment.
* The `master`-branch is the stable branch, and has CI to our production environment.


## Workflow

1. Get a task on JIRA by talking to you teammates and looking at the sprint backlog.
2. Create a new branch: If it's a feature (new functionality) name the branch `feature/DIH-num` where `DIH-num` is the task ID on JIRA. If it's a bugfix name the branch `bugfix/DIH_num`.
3. Code away and commit often. Try to follow [good commit practice](http://chris.beams.io/posts/git-commit/). Remember to write tests (and run them).
4. When you're done (see definition of done on GitHub), create a pull request with reference to the JIRA-issue (preferably a link) and an overview of what the pull request is about. Await code review (you can tag people or yell for them on Slack to get your review faster).
5. When you've reworked your code after the code review, the pull request will be merged

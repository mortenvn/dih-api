/* eslint-disable */
import childProcess from 'child-process-promise';

const env = process.env.NODE_ENV;
const task = {
    "containerDefinitions": [
        {
            memory: 500,
            portMappings: [
                {
                    hostPort: parseInt(process.env.PG_URL, 10),
                    containerPort: 9000,
                    protocol: "tcp"
                }
            ],
            essential: true,
            name: `dih-api-${env}`,
            environment: [
                {
                    name: "PG_URL",
                    value: process.env.PG_URL
                },
                {
                    name: "NODE_ENV",
                    value: process.env.NODE_ENV
                },
                {
                    name: "SECRET",
                    value: process.env.SECRET
                },
                {
                    name: "REGION",
                    value: process.env.REGION
                },
                {
                    name: "EMAIL",
                    value: process.env.EMAIL
                },
                {
                    name: "WEB",
                    value: process.env.WEB
                },
                {
                    name: "SES_ACCESSID",
                    value: process.env.SES_ACCESSID
                },
                {
                    name: "SES_SECRETKEY",
                    value: process.env.SES_SECRETKEY
                }
            ],
            image: `036160847874.dkr.ecr.eu-west-1.amazonaws.com/dih-api:${env}-latest`,
            command: [
                "npm",
                "start"
            ],
            dockerLabels: {
                name: 'dih-api',
                environment: env
            },
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-group": `dih-api-${env}`,
                    "awslogs-region": "eu-west-1"
                }
            },
            cpu: 400,
        }
    ],
    "family": `dih-api-${env}`
}

function createTask() {
    let cmd = 'aws ecs register-task-definition';
    cmd += ` --cli-input-json '${JSON.stringify(task)}'`;
    return childProcess.exec(cmd);
}

function deployTask(definition) {
    let cmd = 'aws ecs update-service';
    cmd += ` --cluster dih-cluster`;
    cmd += ` --service dih-api-${env}`;
    cmd += ` --task-definition ${definition}`;
    return childProcess.exec(cmd);
}

createTask()
    .then(result => {
        console.log('Created new task revision');
        console.log(`Deploying new task to cluster dih-cluster`);
        const definition = JSON.parse(result.stdout)
        return deployTask(definition.taskDefinition.taskDefinitionArn);
    })
    .then(result => {
        console.log(result.stdout);
        console.log('Deployment in progress!');
    })
    .catch(err => {
        console.log(err);
    })

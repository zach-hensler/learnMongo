const localEnvironmentVariables = require('./environmentVariables');

const environmentVariables = {
    username: localEnvironmentVariables.username,
    userPassword: localEnvironmentVariables.userPassword,
    host: localEnvironmentVariables.host,
    database: localEnvironmentVariables.database
}

module.exports = environmentVariables;
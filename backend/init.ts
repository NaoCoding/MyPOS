import dotenvFlow from 'dotenv-flow';

function initServer() {
    // load environment variables from .env files
    dotenvFlow.config();
    console.log("Environment variables loaded");
}

initServer();

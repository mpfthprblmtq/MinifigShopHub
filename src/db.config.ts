import AWS from 'aws-sdk';

AWS.config.update({
    region: 'us-east-2',
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
});

const db = new AWS.DynamoDB.DocumentClient();
const env: string = process.env.REACT_APP_ENVIRONMENT === 'dev' ? '-dev' : '';
const ConfigurationTable = 'configuration' + env;
const PartsTable = 'parts' + env;

export {db, ConfigurationTable, PartsTable};
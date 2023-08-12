import AWS from 'aws-sdk';

AWS.config.update({
    region: 'us-east-2',
    accessKeyId: import.meta.env.REACT_APP_AWS_ACCESS_KEY,
    secretAccessKey: import.meta.env.REACT_APP_AWS_SECRET_ACCESS_KEY
});

const db = new AWS.DynamoDB.DocumentClient();
const Table = 'configuration';

export {db, Table};
const util = require('./../lib/util');

const AttributeName = 'artifact';

exports.up = next => {
  const params = {
    TableName: 'artifact_location',
    KeySchema: [{ AttributeName, KeyType: 'HASH' }], // Partition key
    AttributeDefinitions: [{ AttributeName, AttributeType: 'S' }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  };

  util.dynamodb.createTable(params, (err, data) => {
    util.logResult(err, data);
    next();
  });
};

exports.down = next => {
  next();
};

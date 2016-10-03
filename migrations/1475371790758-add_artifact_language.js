const util = require('./../lib/util');

exports.up = next => {
  const params = {
    TableName: 'artifact_language',
    KeySchema: [
      { AttributeName: 'artifact', KeyType: 'HASH' }, // Partition key
      { AttributeName: 'language', KeyType: 'RANGE' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'artifact', AttributeType: 'S' },
      { AttributeName: 'language', AttributeType: 'S' },
    ],
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

const util = require('./../lib/util');

exports.up = next => {
  const params = {
    TableName: 'language_location',
    KeySchema: [
      { AttributeName: 'language', KeyType: 'HASH' }, // Partition key
      { AttributeName: 'location', KeyType: 'RANGE' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'language', AttributeType: 'S' },
      { AttributeName: 'location', AttributeType: 'S' },
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

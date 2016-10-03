const util = require('./../lib/util');
const wikitable = require('wikitable');
const pick = require('lodash.pick');
const mapKeys = require('lodash.mapkeys');

const url = 'https://en.wikipedia.org/wiki/List_of_artifacts_in_biblical_archaeology';

const formatData = data => {
  const artifactLocation = pick(data, ['Name', 'Current Location']);
  return mapKeys(artifactLocation, (value, key) =>
    key.toLowerCase()
      .replace('current ', '') // current location › location
      .replace('name', 'artifact')); // name › artifact
}

const getParams = Item => ({
  TableName: 'artifact_location',
  Item,
});

exports.up = next => {

  const insertArtifact = (artificats, cb) => {
    const artificat = artificats[0];
    util.documentClient.put(getParams(artificat), (err, data) => {
      cb(artificats.slice(1));
    });
  };

  const insertArtifacts = artificats =>
  (!artificats.length) ? next() : insertArtifact(artificats, insertArtifacts);

  // scrape wikipedia for our table data
  wikitable({ url })
    .then(data => {
      // format into attributes we want
      const artifacts = data[0].map(formatData);
      // recursively insert into table
      insertArtifacts(artifacts)
    });
};

exports.down = next => {
  next();
};

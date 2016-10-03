const AWS = require('aws-sdk');
const React = require('react');
const ReactDOM = require('react-dom');
const { createStore, applyMiddleware, bindActionCreators, combineReducers } = require('redux');
const thunk = require('redux-thunk').default;
const { connect, Provider } = require('react-redux');
const { Panel, Table, Button, Tabs, Tab } = require('react-bootstrap');
// const { BootstrapTable, TableHeaderColumn } = require('react-bootstrap-table');

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: 'us-east-1',
  endpoint: 'http://localhost:8000',
});
const dynamodb = new AWS.DynamoDB();

dynamodb.scan({ TableName: 'artifact_language' }, (e, data) =>
  console.log('data', data));

// many reducers, each table has key in state object
const artifactLocation = (state = [], action) =>
  (action.type !== 'RECIEVED_ARTIFACT_LOCATION') ? state :
    action.payload.Items.map(({ artifact, location }) => ({
      artifact: artifact.S,
      location: location.S,
    }));

const artifactLanguage = (state = [], action) =>
  (action.type !== 'RECIEVED_ARTIFACT_LANGUAGE') ? state :
    action.payload.Items.map(({ artifact, language }) => ({
      artifact: artifact.S,
      language: language.S,
    }));

const languageLocation = (state = [], action) =>
  (action.type !== 'RECIEVED_LANGUAGE_LOCATION') ? state :
    action.payload.Items.map(({ language, location }) => ({
      language: language.S,
      location: location.S,
    }));

const store = createStore(
  combineReducers({ artifactLocation, artifactLanguage, languageLocation }),
  applyMiddleware(thunk)
);

const fetchArtifactLocation = () => dispatch =>
  dynamodb.scan({ TableName: 'artifact_location' }, (e, payload) =>
    dispatch({ type: 'RECIEVED_ARTIFACT_LOCATION', payload }));

const fetchArtifactLanguage = () => dispatch =>
  dynamodb.scan({ TableName: 'artifact_language' }, (e, payload) =>
    dispatch({ type: 'RECIEVED_ARTIFACT_LANGUAGE', payload }));

const fetchLanguageLocation = () => dispatch =>
  dynamodb.scan({ TableName: 'language_location' }, (e, payload) =>
    dispatch({ type: 'RECIEVED_LANGUAGE_LOCATION', payload }));

// const th = name => {
//   console.log(name);
//   return (<TableHeaderColumn key={name} dataField={name.toLowerCase()}>{name}</TableHeaderColumn>);
// };

// const ArtifactsTable = props => {
//   const artifacts = props.state;
//   const ths = ['Id', 'Artifact', 'Location'].map(th);
//   // const ths = (artifacts.length) ? Object.keys(artifacts[0]).map(th) : '';
//   return (
//     <div>
//       <BootstrapTable data={artifacts} striped hover>
//         {ths}
//       </BootstrapTable>
//       <Button bsStyle="primary" onClick={props.fetchData}>Get Artifacts</Button>
//     </div>
//   );
// };
// TODO: Add props validation

// const Row = ({ artifact, location }) =>
//   <tr><td>{artifact}</td><td>{location}</td></tr>

const th = title => <th key={title}>{title}</th>;
const td = value => <td>{value}</td>;
const tr = obj => {
  const tds = Object.keys(obj).map(k => td(obj[k]));
  return <tr>{tds}</tr>;
};

const ArtifactsTable = ({ data, fetchData }) => {
  // const rows = props.state.map(artifact => <Row {...artifact} />);
  const ths = (data.length) ? Object.keys(data[0]).map(th) : null;
  // [{a:'a', b: 'b'}] -> []
  const rows = (data.length) ? data.map(tr) : null;
  // const rows = (data.length) ? data.map(obj => Object.keys(obj).) : '';
  return (
    <div>
      <Button bsStyle="primary" onClick={fetchData}>Get Artifacts</Button>
      <br /><br />
      <Table striped bordered condensed hover>
        <thead>
          <tr>{ths}</tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </div>
  );
};

const RelationalTabs = props => (
  <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
    <Tab eventKey={1} title="One:One">
      <Panel header="Artifact:Location">
        <p>An artifact can only have one location; Primary Key: Artifact</p>
        <ArtifactsTable data={props.state.artifactLocation} fetchData={props.fetchArtifactLocation} />
      </Panel>
    </Tab>
    <Tab eventKey={2} title="One:Many">
      <Panel header="Artifact:Language">
        <p>Many artifacts may be written in the same language; Primary Key: Artifact(Hash), Language(Range)</p>
        <ArtifactsTable data={props.state.artifactLanguage} name="artifactLanguage" fetchData={props.fetchArtifactLanguage} />
      </Panel>
    </Tab>
    <Tab eventKey={3} title="Many:Many">
      <Panel>
        <p>Many artifacts with the same language can be at the same location; Primary Key: Language(Hash), Location(Range)</p>
        <ArtifactsTable data={props.state.languageLocation} name="languageLocation" fetchData={props.fetchLanguageLocation} />
      </Panel>
    </Tab>
  </Tabs>
);

// (state, ownProps)
const mapStateToProps = state => ({ state });
const mapDispatchToProps = dispatch => bindActionCreators({ fetchArtifactLocation, fetchArtifactLanguage, fetchLanguageLocation }, dispatch);

const App = connect(mapStateToProps, mapDispatchToProps)(RelationalTabs);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

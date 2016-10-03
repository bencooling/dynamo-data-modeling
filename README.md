# dynamo-data-modelling

> Relational data modeling with dynamodb. No server-side code all in the browser with react, redux, webpack, migrations, data scraping & seeding.

## dynamodb

- Denormalised data is accessible data; Normalised is organised. The downside to normalised is it requires caching for fast reads. Dynamodb provides managed  distributed data persistence with replication (many zones within a region), sharding & throttling out of the box.


## Features
- Scrapes data from wikipedia ([List of artifacts in biblical archaeology](https://en.wikipedia.org/wiki/List_of_artifacts_in_biblical_archaeology)).
- Migrations for automated provisioning dynamodb.  
- React + Redux for web client.  
- Webpack (dev server, bundling) + babel (jsx).  
- dotenv for secrets (aws credentials).  


## Relational data models  

### One:One Artifact:Location  
An artifact can only have one location.


### One:Many Artifact:Language  
Many artifacts may be written in the same language.  


### Many:Many Language:Location
Many artifacts with the same language can be at the same location.  


## Installation

**1. Run dynamodb locally**  
`docker run -d -p 8000:8000 --name dynamodb peopleperhour/dynamodb`

**2. Provision tables**  
`migrate up`

**3. Add AWS credentials**  
`cp .env.sample .env`

**4. Run**  
`npm start`


## Resources
- [Dynamodb relational data modeling](https://youtu.be/VuKu23oZp9Q?t=24m31s)


## TODO
- [ ] Add UI for querying primary key
- [ ] Convert ajax data fetching to [componentDidMount](https://facebook.github.io/react/tips/initial-ajax.html)
- [ ] Add more UI, inc. Topbar with github icon on right, Heading, par, panel, tabs.  
- [ ] Add deployment to s3

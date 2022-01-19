# Demo Project
This project is using Nest.js and Ether.js to structure a Node.JS application to read data off from a Ethereum Blockchain.

## Things we used
As part of this package we utilize the following main packages and tools:
* Docker Compose
* Postgres
* Nest JS
* TypeORM
* Ethers.js
* Ganache
* Cron
* Jest

## Setup
### Prerequisite
To order to this, we have to install Ganache CLI so we can test the code locally. Once installed, we have to:
1. Start ganache-cli
```
> ganache-cli
```
2. Now deploy or contract

```
> cd backend/packages/web3-tester
> node deploy.js
```
This should get our address for the contract deployed onto the chain

3. Setup the configuration 

Before we start our app, we need to feed the wallet and the contract address into our application configuration.
Navigate to `backend/pacakges/eth-tester/src/infrastructure/config/service.config.yaml`, and set:
* `ethers > contract`: The contract address received in step 2
* `ethers > wallet`: The address for any of the accounts from ganache-cli in step 1

### Startup
Once the pre-requisites are done, we then can start the project:
```
> cd backend/packages/eth-tester
> docker compose up -d
```
Just your preferred database agent, connect to Postgres server at http://localhost:5432 and create a new database
`eth-tester`.
After that we can start the app.
```
> yarn start:dev
```

## Testing with Swagger (Open API)
In order to test our application, we can use a browser and navigate to `http://localhost:3000/docs`. This will 
launch the Swagger Open API browser.

The commands available does the following:
### Post 
The request will simulate of recording the initial block number at the beginning of the day 

### PUT
The request will simulate the recording at the end of the day by extracting the block of the day (year, month, day) and then using `getBlock()` to extract the transactions and gas usage. After that will tabulate the total blocks and gas and write it onto the chain.

### GET
Getting all the blocks currently on chain for our checks.

## The Scheduler
The actually scheduler is operated by Cron and locate in the `backend/packages/eth-tester/src/domain/services/scheduler.service.ts`.




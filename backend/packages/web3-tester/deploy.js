/**
 * 
 */
var ethers = require('ethers');
var fs = require('fs');

console.log(`Platform: ${ethers.platform}`)

// create our local node connection
var provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');

// loading our contract
const contractByteCode = fs.readFileSync('gas-bill_contract_sol_GasRecord.bin').toString();
const contractAbiCode = fs.readFileSync('gas-bill_contract_sol_GasRecord.abi').toString();

console.debug(`Our ABI: ${contractAbiCode}`);
console.debug(`Our Bytecode: ${contractByteCode}`);

let contractAddress = null;

/**
 * 
 */
const deploy = async () => {
    try {
        // get a wallet
        console.debug(`loading our wallet`)
        const wallet = provider.getSigner(0);

        // prepare our factory
        const factory = new ethers.ContractFactory(
            contractAbiCode,
            contractByteCode,
            wallet
        );

        // get our contract instance address on chain
        const contract = await factory.deploy();

        // make sure we have the address
        contractAddress = contract.address;
        console.debug(`Our contract address: ${contractAddress}`);        
    } catch (ex) {
        console.debug(`Unable to deploy contract :-(`)
        console.error(ex);
    }
}

// do our deployment
deploy();
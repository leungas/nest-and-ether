// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * Assignment Contract
 */
contract GasRecord {

    /**
     * struct: Usage
     *
     * This is the record structure for us to organize our usage
     */
    struct Usage {
        uint date;
        uint blocks;
        uint gas;
    }

    
    address owner; // owner - we need this for the verification in require
    Usage[] internal usages; // usages - we store our actual data here

    // creating the contract with the owner ref
    constructor() {
       owner = msg.sender;
    }

    /**
     * this is our validation that only owner can do things
     */
    modifier onlyOwner {
       require (msg.sender == owner);
       _;
    }

    /**
     * function: record()
     * 
     * doing our write here into the block
     */
    function record(uint256 timestamp, uint blocks, uint gas) public onlyOwner {
        usages.push(Usage({
            date: timestamp,
            blocks: blocks,
            gas: gas
        }));
    }

    /**
     * function: getAllUsages()
     *
     * Usage this if we want to dump the whole lot down
     */
    function getTimeUsage(uint timestamp) public view onlyOwner returns (Usage memory) {
        Usage memory result;
        for (uint i = 0; i < usages.length; i++) {
            Usage memory item = usages[i];
            if (item.date == timestamp) {
                result = item;
                break;
            }
        }
        return result;
    }

    /**
     * function: getAll()
     * 
     * This will dump all usages together in one go
     */
    function getAll() public view onlyOwner returns (Usage[] memory) {        
        return usages;
    }
}
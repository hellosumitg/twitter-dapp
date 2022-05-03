// As deploying on ethereum will take time so we use async()
const hre = require("hardhat");

const main = async() => {
    // We get the contract to deploy below code in this async function is taken from `sample-script.js`
    const contractFactory = await hre.ethers.getContractFactory('TwitterContract'); // here we are using ethers.js to get/fetch the contract.
    const contract = await contractFactory.deploy();
    
    await contract.deployed();
  
    console.log("Contract deployed to: ", contract.address); // to get to know where all the contract methods lives(i.e the address) 
  }
  
  const runMain = async() => {
    try {
      await main();
      process.exit(0);
    } catch(error) {
      console.log(error);
      process.exit(1);
    }
  }
  
  runMain();
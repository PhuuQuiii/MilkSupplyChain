const MilkSupplyChain = artifacts.require("MilkSupplyChain");

module.exports = function (deployer) {
    // Triển khai contract MilkSupplyChain
    deployer.deploy(MilkSupplyChain);
};
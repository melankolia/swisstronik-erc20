const hre = require("hardhat");
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");

const sendShieldedTransaction = async (signer, destination, data, value) => {
  const rpcLink = hre.network.config.url;
  const [encryptedData] = await encryptDataField(rpcLink, data);
  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });
};

async function main() {
  const [signer] = await hre.ethers.getSigners();
  const contractFactory = await hre.ethers.getContractFactory("TestToken");
  const contract = contractFactory.attach("0x2a4EcCCaE00f848bFC026C820A947Aab6cA39204");
  const functionName = "mint100tokens";
  const mint100TokensTx = await sendShieldedTransaction(
    signer,
    "0x2a4EcCCaE00f848bFC026C820A947Aab6cA39204",
    contract.interface.encodeFunctionData(functionName),
    0
  );
  await mint100TokensTx.wait();
  console.log("Transaction Receipt: ", `Minting token has been success! Transaction hash: https://explorer-evm.testnet.swisstronik.com/tx/${mint100TokensTx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

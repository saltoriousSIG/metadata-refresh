const imxSDK = require("@imtbl/core-sdk");
const { Wallet } = require("@ethersproject/wallet");
const { InfuraProvider } = require("@ethersproject/providers");
const axios = require("axios");
const prompt = require("prompt-sync")();
require("dotenv").config();

const private_key = process.env.PRIVATE_KEY;
const infura_key = process.env.INFURA_API_KEY;

const provider = new InfuraProvider("homestead", infura_key);
const signer = new Wallet(private_key).connect(provider);

const main = async () => {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = await imxSDK.signRaw(timestamp, signer);

  const collection_address = prompt("Please enter your collection address");
  
  const address = prompt('Please enter the address that owns this collection');

  const ask_for_tokens = prompt(
    "Please enter all token ids separated by a comma"
  );
  const tokens = ask_for_tokens.split(",");

  const options = {
    method: "POST",
    url: "https://api.x.immutable.com/v1/metadata-refreshes",
    headers: {
      "Content-Type": "application/json",
      "x-imx-eth-signature": signature,
      "x-imx-eth-timestamp": timestamp,
      "x-imx-eth-address": address
    },
    data: { collection_address, token_ids: tokens },
  };

  axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
};

main();

const { ImmutableX, Config } = require("@imtbl/core-sdk");
const { Wallet } = require("@ethersproject/wallet");
const prompt = require("prompt-sync")();
require("dotenv").config();

const config = Config.PRODUCTION;
const client = new ImmutableX(config);
const private_key = process.env.PRIVATE_KEY;

const signer = new Wallet(private_key);

const collection_address = "0x42373fb90e871e6aa06758f58d093bb03db392da";
const main = async () => {
  const listAssetsResponse = await client.listAssets({
    pageSize: 1000,
    collection: collection_address,
  });

  const tokenIds = listAssetsResponse.result.map(
    (asset) => asset.token_id
  );
  console.log(tokenIds);

  const confirm_refresh = prompt(
    "would you like to proceed refreshing these ids? yes/no?"
  );

  if (confirm_refresh === "yes") {
    const createRefreshRequestParams = {
      collection_address: collection_address,
      token_ids: tokenIds, // Token ids for metadata refresh, limit to 1000 per request
    };

    const createMetadataRefreshResponse = await client.createMetadataRefresh(
      ethSigner,
      createRefreshRequestParams
    );
    console.log(createMetadataRefreshResponse);
  }
};

main();

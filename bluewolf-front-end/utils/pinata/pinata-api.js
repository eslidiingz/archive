const { PINATA_API_KEY, PINATA_API_SECRET } = require("../../secrets.json");
const fs = require('fs');

const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK(PINATA_API_KEY, PINATA_API_SECRET);

const options = {
    pinataMetadata: {
        name: "BW NFT",
        keyvalues: {
            customKey: 'customValue',
            customKey2: 'customValue2'
        }
    },
    pinataOptions: {
        cidVersion: 0
    }
};

const pinFileToIPFS = (data) => {
return pinata.pinFileToIPFS(data, options).then((result) => {
        return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
    }).catch((err) => {
        //handle error here
        console.log(err);
    });
}


export const getMetadata = async (data) => {
    const imageUrl = await pinFileToIPFS(data)
    console.log(data);
    return await imageUrl;
}

getMetadata();





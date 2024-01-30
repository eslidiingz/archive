import FormData from "form-data";
import { createReadStream, readFileSync, unlinkSync, writeFileSync } from "fs";
import fetch from "node-fetch";
import Config from "../../configs/config";

export default async function handler(req, res) {
  try {
    const { json, tokenId } = JSON.parse(req.body);
    writeFileSync(`public/upload/${tokenId}.json`, JSON.stringify(json));
    const jsonMetadata = createReadStream(`public/upload/${tokenId}.json`);

    let fd = new FormData();

    fd.append("file", jsonMetadata);

    let response = await fetch(Config.METADATA_SERVER_URI, {
      method: "POST",
      body: fd,
    });

    const { filename } = await response.json();

    unlinkSync(`public/upload/${tokenId}.json`);

    res.status(200).json({ result: filename });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "failed to load data" });
  }

  //   const result = await uploadFileToServer(jsonMetadata);

  //
  //   console.log(_result);
}

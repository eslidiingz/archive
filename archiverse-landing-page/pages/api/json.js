import FormData from "form-data";
import { createReadStream, readFileSync, unlinkSync, writeFileSync } from "fs";
import fetch from "node-fetch";
import Config from "../../configs/config";

export default async function handler(req, res) {
  try {
    const { json, tokenId } = req.body;
    writeFileSync(`public/upload/mock.json`, json);
    const jsonMetadata = createReadStream(`public/upload/mock.json`);

    let fd = new FormData();

    fd.append("file", jsonMetadata);

    let response = await fetch(Config.FILE_SERVER_URI, {
      method: "POST",
      body: fd,
    });

    const { filename } = await response.json();

    res.status(200).json({ result: filename });
  } catch (error) {
    res.status(500).json({ error: "failed to load data" });
  }

  //   const result = await uploadFileToServer(jsonMetadata);

  //   unlinkSync(`public/upload/mock.json`);
  //   console.log(_result);
}

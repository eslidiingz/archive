import Config from "../../configs/config";
import formidable, { IncomingForm } from "formidable";

export default async function handler(req, res) {
  console.log("req.body => ", req.body);
  const { fd } = req.body;
  console.log("🚀 ~ file: upload-3dmodel.js:6 ~ handler ~ fd:", fd);

  // let response = await fetch(Config.FILE3D_SERVER_URI, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //     body: {
  //       bundle: files.bundle,
  //       folder: "bundle",
  //     },
  //   });

  // const form = new IncomingForm();

  // form.parse(req, async (err, fields, files) => {
  //   console.log("=== files:", files);
  //   if (err)
  //     return res.status(405).json({ message: err.toString(), file_url: "" });
  //   let response = await fetch(Config.FILE3D_SERVER_URI, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //     body: {
  //       bundle: files.bundle,
  //       folder: "bundle",
  //     },
  //   });
  //   console.log("=== response:", response);

  //   let result = await response.json();
  //   console.log("=== result:", result);

  //   return res
  //     .status(200)
  //     .json({ message: "Get link Success", file_url: result.result });
  // });
}

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

const mongoose = require("mongoose");

const methods = {
  async onFileById(req, res) {
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "bitmonster-unity",
    });
    const _bucketID = await bucket
      .find({ _id: mongoose.Types.ObjectId(req.params.id) })
      .toArray();

    if (_bucketID.length === 0) {
      res.error({
        message: "File not found",
      });
    } else {
      try {
        var downloadStream = bucket.openDownloadStream(
          mongoose.Types.ObjectId(req.params.id)
        );
        downloadStream.pipe(res);
      } catch (error) {
        res.error(error);
      }
    }
  },
  async onIPFSCreate(req, res) {
    try {
      const heros = await mongoose.connection.db
        .collection("heros")
        .find()
        .toArray();
      const data = heros.map((item) => {
        const { no, name, name2 } = item;
        const keys = Object.keys(item);
        const attributes = keys.map((_key) => {
          return {
            trait_type: _key,
            value: item[_key],
          };
        });

        return { no, name: name2, description: name, image, attributes };
      });

      res.success(data);
    } catch (error) {
      res.error(error);
    }
  },
};

module.exports = { ...methods };

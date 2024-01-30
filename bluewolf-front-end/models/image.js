import Config from "utils/config";

const imageUri = `${Config.COLLECTION_API}/images`;

export const uploadImageToGirdFS = async (_data) => {
  try {
    const response = await fetch(`${imageUri}/upload`, {
      method: "POST",
      body: _data,
    });

    return await response.json();
  } catch (error) {
    console.log("error uploadImageToGirdFS()", error);
  }
};

export const getImageGridFS = (_filename) => {
  return `${imageUri}/${_filename}`;
};

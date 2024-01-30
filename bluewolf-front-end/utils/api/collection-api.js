import Config from "../config"

const collectionEndpoint = "collections"
const collectionUrl = `${Config.COLLECTION_API}/${collectionEndpoint}`

export const fetchImageBucket = (image) => {
  const url = `${Config.COLLECTION_API}/images/${image}`
  return url
}

export const fetchAllCollection = async () => {
  const findCollection = await fetch(`${collectionUrl}`)
  return await findCollection.json()
}

export const fetchCollectionList = async (account) => {
  const findCollection = await fetch(`${collectionUrl}?owner=${account}`)
  return await findCollection.json()
}

export const fetchAssetCollection = async (collection) => {
  const find = await fetch(`${collectionUrl}/${collection}`)
  return await find.json()
}

export const fetchCollectionByAssetId = async (id) => {
  const find = await fetch(`${collectionUrl}/asset/${id}`)
  return await find.json()
}

export const putAssetCollection = async (id, data) => {
  const json = await fetch(`${collectionUrl}/assets/${id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  return await json
}

export const putHolderCollection = async (id, data) => {
  const json = await fetch(`${collectionUrl}/holder/${id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  return await json
}

export const putTransactionCollection = async (id, data) => {
  const json = await fetch(`${collectionUrl}/transaction/${id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  return await json
}

export const fetchCollectionByTitle = async (title) => {
  const find = await fetch(`${collectionUrl}/title/${title}`)
  return await find.json()
}

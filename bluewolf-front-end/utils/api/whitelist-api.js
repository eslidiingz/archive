import Config from "../../utils/config"

const WhitelistEndpoint = "whitelists"
const WhitelistUrl = `${Config.COLLECTION_API}/${WhitelistEndpoint}`

export const fetchWhitelist = async () => {
  const _data = await fetch(`${WhitelistUrl}`)
  return await _data.json()
}

export const fetchWhitelistUser = async (address) => {
  const _data = await fetch(`${WhitelistUrl}?address=${address}`)
  return await _data.json()
}

export const updateWhitelistUser = async (id, data) => {
  const _result = await fetch(`${WhitelistUrl}/${id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  return await _result
}

export const saveWhitelistUser = async (data) => {
  const _result = await fetch(`${WhitelistUrl}`, {
    method: "post",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
  return await _result
}

export const deleteWhitelist = async (id) => {
  const _result = await fetch(`${WhitelistUrl}/${id}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
  })
  return await _result
}

export const getUsername = async (username) => {
  const _result = await fetch(`${WhitelistUrl}/username/${username}`)
  return await _result.json()
}

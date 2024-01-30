import Config from "../config"

const userEndpoint = "users"
const userUrl = `${Config.COLLECTION_API}/${userEndpoint}`

export const fetchUserData = async (account) => {
  const _result = await fetch(`${userUrl}?address=${account}`)
  return await _result.json()
}

export const saveUser = async (data) => {
  const _result = await fetch(`${userUrl}`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  return await _result
}

export const updateuserData = async (id, data) => {
  const _result = await fetch(`${userUrl}/${id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  return await _result
}

export const getUsername = async (username) => {
  const _result = await fetch(`${userUrl}/username/${username}`)
  return await _result.json()
}

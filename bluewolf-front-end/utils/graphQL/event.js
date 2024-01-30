import Config from "utils/config"

const gqlQuery = async (_query) => {
  const res = await fetch(`${Config.INDEXER_URI}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": "dev1Mex",
    },
    body: JSON.stringify({
      query: _query,
      variables: {},
    }),
  })

  return await res.json()
}

export const getTokenEventLogs = async (tokenId) => {
  const queryItemHistory = `
  query MyQuery {
    ItemHistory(where: {_and: [{
      event: {
        _neq: "CancelOfferEvent"
      }
    }, {
      event: {
        _neq: "CreateOfferEvent"
      }
    }], tokenId: {_eq: ${tokenId}} }) {
        blockHash
        buyWithTokenContract
        buyer
        event
        fee
        nftContract
        tokenId
        orderId
        price
        seller
        owner
        timestamp
    transactionHash
      }
     }
    `

  const data = await gqlQuery(queryItemHistory)

  return data.data.ItemHistory
}

export const getLatestOrderEvent = async (tokenId) => {
  if (typeof tokenId === "undefined") {
    return
  }
  const query = `
    query {
      ItemHistory(where: {tokenId: {_eq: ${tokenId}}, event: {_eq: "OrderCreatedEvent"}}) {
        timestamp
        tokenId
        transactionHash
      }
     }
    `
  const data = await gqlQuery(query)
  return data.data.ItemHistory[data.data.ItemHistory.length - 1]
}

export const getOrderEventByOwner = async (owner) => {
  const queryOrder = `
  query {
    ItemHistory(where: {event: {_eq: "OrderCreatedEvent"}, seller: {_eq: "${owner}"}}) {
      buyWithTokenContract
      buyer
      event
      fee
    
      nftContract
      tokenId
      orderId
      price
      
      seller
      owner
      timestamp
      transactionHash
    }}
    `
  const data = await gqlQuery(queryOrder)
  return data
}

export const getPurchaseEventByOwner = async (owner) => {
  const queryBought = `
  query {
    ItemHistory(where: {event: {_eq: "BougthEvent"}, buyer: {_eq: "${owner}"}}) {
      buyWithTokenContract
      buyer
      event
      fee
     
      nftContract
      tokenId
      orderId
      price
      
      seller
      owner
      timestamp
      transactionHash
    }}
    `
  const queryAccepted = `
    query {
      ItemHistory(where: {event: {_eq: "AcceptOfferEvent"}, buyer: {_eq: "${owner}"}}) {
        buyWithTokenContract
      buyer
      event
      fee
      
      nftContract
      tokenId
      orderId
      price
      
      seller
      owner
      timestamp
      transactionHash
      }
     }
    `
  const data1 = await gqlQuery(queryBought)
  const data2 = await gqlQuery(queryAccepted)

  const finalData = await data1.data.ItemHistory.concat(data2.data.ItemHistory)
  return finalData
}

export const getSaleEventByOwner = async (owner) => {
  const queryBought = `
  query {
    ItemHistory(where: {event: {_eq: "BougthEvent"}, seller: {_eq: "${owner}"}}) {
      buyWithTokenContract
      buyer
      event
      fee
      
      nftContract
      tokenId
      orderId
      price
      
      seller
      owner
      timestamp
      transactionHash
    }}
    `
  const queryAccepted = `
    query {
      ItemHistory(where: {event: {_eq: "AcceptOfferEvent"}, seller: {_eq: "${owner}"}}) {
        buyWithTokenContract
      buyer
      event
      fee
    
      nftContract
      tokenId
      orderId
      price
    
      seller
      owner
      timestamp
      transactionHash
      }
     }
    `
  const data1 = await gqlQuery(queryBought)
  const data2 = await gqlQuery(queryAccepted)
  const finalData = await data1.data.ItemHistory.concat(data2.data.ItemHistory)
  return finalData
}

import { objectForParams } from "../utils/misc";
import { gqlMutation, gqlQuery } from "./GraphQL";



const offerReturning = () => {
    return `{
        id
        offerer
        tokenAddress
        nftContract
        offerPrice
        tokenId
        offerId
        offerAccExp
        ownerAppExp
        isAccept
        isActive
        isOwnerApprove
        updatedAt
        createdAt
        offerTo
    }`;
}

export const getOfferList = async (_where) => {
    let query = `
        offers ${_where ? `(where: ${_where})` : ""}
        ${offerReturning()}
    `;
    console.log(query);
    return await gqlQuery(query);
}

export const insertOffer = async (_data) => {
    try {
        let mutation = `
            insert_offers_one (object: ${objectForParams(_data)})
            ${offerReturning()}
        `;
        console.log("Mutaion insertOffer : ", mutation);
        let resCreated = await gqlMutation(mutation);
        return resCreated.data;
    } catch (error) {
        console.log(
            `%c========== ERROR insertOffer()==========`,
            "color: red",
            error
        );
    }
}

export const updateOffer = async (_set, _where) => {
    try {
        let mutation = `
            update_offers(_set: {${_set}}, where: ${_where}) {
                returning ${offerReturning()}
            }
        `;
        console.log("Mutation : ", mutation);
        return await gqlMutation(mutation);
    } catch (error){
        console.log(
            `%c========== ERROR updateOffer()==========`,
            "color: red",
            error
        )
    }
}
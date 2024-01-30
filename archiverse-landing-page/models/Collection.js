import { gqlQuery, gqlMutation } from "./GraphQL";
import { objectForParams, objectForParamsNotKey } from "../utils/misc";

export const gqlCollectionReturning = `{
	id
	name
	coverUrl
	backgroundUrl
	creatorWallet
	description
	nftUtility
	createdAt
	updatedAt
}`;

export const getCollection = async (_condition = null) => {
	let query = `
		collections ${_condition ? `(where: ${_condition})` : ""}
		${gqlCollectionReturning}
	`;

	return gqlQuery(query);
};

export const createCollection = async (_data) => {
	try {

		let mutation = `
			insert_collections_one(object: ${objectForParams(_data)})
			${gqlCollectionReturning}
		`;
		console.log("insert_collections_one", mutation)
		let resCreated = await gqlMutation(mutation);
		if (resCreated) {
			return resCreated.data;
		}

	} catch (error) {
		console.log(`%c========== ERROR createCollection()==========`, "color: red", error);
	}
};

export const updateCollection = async (_set, _where) => {
	try {

		let mutation = `
			update_collections(_set: {${_set}}, where: ${_where}) {
				returning ${gqlCollectionReturning}
			}
		`;
		console.log(mutation)

		return await gqlMutation(mutation);

	} catch (error) {
		console.log(`%c========== ERROR updateOrderMarket()==========`, "color: red", error);
	}
};

import Config from "../../utils/config"

const imageEndpoint = "images"
const imageUrl = `${Config.COLLECTION_API}/${imageEndpoint}`


export const fetchImageUser = async (id) => {
    const url = await fetch(`${imageUrl}/${id}`)
    return url
}
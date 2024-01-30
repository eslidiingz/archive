import {fetchWhitelistUser} from "utils/api/whitelist-api"

export const isCreatorCheck = async (_wallet) => {
  try {
    let status = false
    let {rows} = await fetchWhitelistUser(_wallet)

    if (
      rows.length > 0 &&
      rows[0].flag.toUpperCase() === "Y" &&
      rows[0].roles.toLowerCase() === "minter"
    )
      status = true

    return status
  } catch (error) {
    console.log("%c===== ERROR > isCreator =====", "color:red")
    console.log(error)
  }
}

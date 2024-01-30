import { smartContact } from "../utils/providers/connector"

import Config from '/configs/config'


export const smartContractLaunchPad = (_withJsonPRC = false) => {
    return smartContact(
        Config.LAUNCHPAD_CA,
        Config.LAUNCHPAD_ABI,
        _withJsonPRC
    );
}
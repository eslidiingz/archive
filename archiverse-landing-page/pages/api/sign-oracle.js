import Config from "../../configs/config";

export default async function handler (req, res) {
    const { userWallet, busdAmount } = req.body;
    const SALT_API_KEY = Config.SALT_API_KEY;
    try {
        const init = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "API-KEY": SALT_API_KEY
            },
            body: JSON.stringify(req.body)
        }
        const getSignOracle = await fetch(`${Config.ORACLE_API_URI}/sign-oracle`, init);
        const result = await getSignOracle.json();
        res.status(200).json(result);
    } catch (e) {
        console.log("Error sign oracle : ", e.message);
        res.status(400).send("Sign oracle fail")
    }
}
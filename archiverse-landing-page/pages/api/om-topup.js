import Config from "../../configs/config";


export default async function handler (req, res) {
    const { address, amount } = req.body;
    const API_KEY = Config.OM_TOPUP_API_KEY;
    const _body = {
        api_key: API_KEY,
        address: address,
        amount: amount
    }
    try {
        const init = {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(_body)
        }
        const getQrText = await fetch(`${Config.OM_TOPUP_API_URL}`, init);
        const result = await getQrText.json();
        res.status(200).json(result);
    } catch (e) {
        console.error(e.message);
        res.status(400).send(`Payment fail : `, e.message);
    }
}
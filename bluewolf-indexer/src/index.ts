import { AcceptOfferEvent, CancelOfferEvent, CreateOfferEvent, BougthEvent, OrderCanceledEvent, OrderCreatedEvent } from "./functions/event";
import { prisma } from "./utils/connection";
import { mint } from "./functions/nft";
import cron from "node-cron"

const main = async () => {

    // cron.schedule('* * * * *', async () => {
        console.log("job runner")
        const mintEvent = await mint()
        console.log("mintEvent")
        const orderCreatedEvent = await OrderCreatedEvent()
        console.log("orderCreatedEvent")
        const orderCanceledEvent = await OrderCanceledEvent();
        console.log("orderCanceledEvent")
        const bougthEvent = await BougthEvent()
        console.log("bougthEvent")
        const acceptOfferEvent = await AcceptOfferEvent();
        console.log("acceptOfferEvent")
        const createOfferEvent = await CreateOfferEvent();
        console.log("createOfferEvent")
        const cancelOfferEvent = await CancelOfferEvent();
        console.log("cancelOfferEvent")
    // });

};

main()
    .catch(e => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
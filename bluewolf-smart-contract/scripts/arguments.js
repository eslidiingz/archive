const dayjs = require("dayjs")
const duration = require("dayjs/plugin/duration")

dayjs.extend(duration)

const convertTime = (amount, unit) => {
  return dayjs.duration(amount, unit).asSeconds()
}

const unlimitAmount =
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"

const offerDuration = convertTime(365, "days")

module.exports = [
  "0x9809Edc8d923B01CF35B3AB5bcfd4bd3C083D650",
  300,
  offerDuration,
]

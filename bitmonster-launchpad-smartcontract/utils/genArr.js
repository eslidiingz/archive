const fs = require("fs")
const {parseUnits} = require("ethers/lib/utils")

const content = "Some content!"
var arr = []

for (var i = 0; i <= 2999; i++) {
  arr.push(i)
}

fs.writeFile("/Multiverse/bitmonster/test.txt", JSON.stringify(arr), (err) => {
  if (err) {
    console.error(err)
    return
  }
  console.log("file written successfully")
})

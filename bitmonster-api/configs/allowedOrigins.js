require("dotenv").config();
let allowedOrigins = [
  "https://game.bitmonsternft.com",
  "https://server.bitmonsternft.com",
  "https://market.bitmonsternft.com",
];

if (process.env.CHAIN_ID != 56) {
  allowedOrigins.push(
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "http://localhost:3004",
    "http://localhost:3005",
    "http://localhost:5500",
    "http://localhost:5600",
    "http://localhost:5700",
    "http://localhost:5800",
    "http://localhost:5900",
    "http://165.22.62.142:18092",
    "http://165.22.62.142:15000",
    "https://testgame.bitmonsternft.com",
    "https://test_server.bitmonsternft.com",
    "https://testmarket.bitmonsternft.com"
  );
  console.log("allowed", allowedOrigins);
}
module.exports = allowedOrigins;

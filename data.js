const fs = require("fs");

const regions = [
  { id: "region-asia", name: "Asia", currency: "USD", tradingDesk: "APAC-1", createdAt: new Date().toISOString() },
  { id: "region-eu", name: "Europe", currency: "EUR", tradingDesk: "EU-1", createdAt: new Date().toISOString() },
  { id: "region-us", name: "US", currency: "USD", tradingDesk: "NA-1", createdAt: new Date().toISOString() },

  { id: "region-uk", name: "United Kingdom", currency: "GBP", tradingDesk: "UK-1", createdAt: new Date().toISOString() },
  { id: "region-germany", name: "Germany", currency: "EUR", tradingDesk: "DE-1", createdAt: new Date().toISOString() },
  { id: "region-france", name: "France", currency: "EUR", tradingDesk: "FR-1", createdAt: new Date().toISOString() },
  { id: "region-italy", name: "Italy", currency: "EUR", tradingDesk: "IT-1", createdAt: new Date().toISOString() },
  { id: "region-spain", name: "Spain", currency: "EUR", tradingDesk: "ES-1", createdAt: new Date().toISOString() },

  { id: "region-japan", name: "Japan", currency: "JPY", tradingDesk: "JP-1", createdAt: new Date().toISOString() },
  { id: "region-china", name: "China", currency: "CNY", tradingDesk: "CN-1", createdAt: new Date().toISOString() },
  { id: "region-india", name: "India", currency: "INR", tradingDesk: "IN-1", createdAt: new Date().toISOString() },
  { id: "region-south-korea", name: "South Korea", currency: "KRW", tradingDesk: "KR-1", createdAt: new Date().toISOString() },
  { id: "region-singapore", name: "Singapore", currency: "SGD", tradingDesk: "SG-1", createdAt: new Date().toISOString() },

  { id: "region-australia", name: "Australia", currency: "AUD", tradingDesk: "AU-1", createdAt: new Date().toISOString() },
  { id: "region-new-zealand", name: "New Zealand", currency: "NZD", tradingDesk: "NZ-1", createdAt: new Date().toISOString() },

  { id: "region-canada", name: "Canada", currency: "CAD", tradingDesk: "CA-1", createdAt: new Date().toISOString() },
  { id: "region-mexico", name: "Mexico", currency: "MXN", tradingDesk: "MX-1", createdAt: new Date().toISOString() },

  { id: "region-brazil", name: "Brazil", currency: "BRL", tradingDesk: "BR-1", createdAt: new Date().toISOString() },
  { id: "region-argentina", name: "Argentina", currency: "ARS", tradingDesk: "AR-1", createdAt: new Date().toISOString() },
  { id: "region-chile", name: "Chile", currency: "CLP", tradingDesk: "CL-1", createdAt: new Date().toISOString() },

  { id: "region-middle-east", name: "Middle East", currency: "AED", tradingDesk: "ME-1", createdAt: new Date().toISOString() },
  { id: "region-uae", name: "UAE", currency: "AED", tradingDesk: "AE-1", createdAt: new Date().toISOString() },
  { id: "region-saudi", name: "Saudi Arabia", currency: "SAR", tradingDesk: "SA-1", createdAt: new Date().toISOString() },

  { id: "region-south-africa", name: "South Africa", currency: "ZAR", tradingDesk: "ZA-1", createdAt: new Date().toISOString() },
  { id: "region-nigeria", name: "Nigeria", currency: "NGN", tradingDesk: "NG-1", createdAt: new Date().toISOString() },
  { id: "region-egypt", name: "Egypt", currency: "EGP", tradingDesk: "EG-1", createdAt: new Date().toISOString() }
];

const symbols = [
  "AAPL", "TSLA", "MSFT", "GOOG",
  "AMZN", "NVDA", "META", "NFLX"
];

const traders = [
  "Alice", "Bob", "Charlie", "David",
  "Emma", "Sophia", "Liam", "Noah"
];

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateTrades(count = 1000) {
  const trades = [];

  for (let i = 1; i <= count; i++) {
    const price = randomNumber(100, 1000);
    const quantity = randomNumber(10, 1000);

    const trade = {
      id: `trade-${i}`,
      parentId: random(regions).id,

      symbol: random(symbols),
      side: Math.random() > 0.5 ? "BUY" : "SELL",

      quantity,
      price,
      notional: quantity * price,

      status: "OPEN",
      traderName: random(traders),

      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),

      prevPrice: price,
      priceChange: 0
    };

    trades.push(trade);
  }

  return trades;
}

const data = {
  regions,
  trades: generateTrades(2000)
};

fs.writeFileSync("db.json", JSON.stringify(data, null, 2));

console.log("✅ db.json generated with mock data");
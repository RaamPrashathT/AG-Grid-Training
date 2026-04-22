const fs = require("fs");

const itemNames = [
  "Steel Rods", "Copper Wires", "Aluminium Sheets", "Iron Plates",
  "Plastic Granules", "Glass Panels", "Ceramic Tiles", "Rubber Pipes",
  "Textile Rolls", "Wood Logs", "Cement Bags", "Chemical Drums",

  // 🔽 Added more materials
  "PVC Pipes", "Carbon Fiber Sheets", "Brass Fittings", "Silicon Wafers",
  "Battery Cells", "Solar Panels", "LED Components", "Microchips",
  "Paper Rolls", "Cardboard Boxes", "Packaging Foam", "Adhesive Tapes",
  "Fertilizer Bags", "Grain Sacks", "Spice Containers", "Tea Chests",
  "Coffee Beans", "Pharmaceutical Kits", "Medical Equipment",
  "Electronic Appliances", "Mobile Parts", "Laptop Units",
  "Engine Parts", "Gear Assemblies", "Hydraulic Pumps",
  "Paint Buckets", "Lubricant Drums", "Oil Barrels",
  "Glass Bottles", "Plastic Containers", "Metal Scrap",
  "Recycled Materials", "Textile Fibers", "Yarn Bundles"
];

const destinations = [
  "Chennai", "Mumbai", "Delhi", "Bangalore",
  "Hyderabad", "Pune", "Kolkata", "Ahmedabad",
  "Coimbatore", "Jaipur", "Lucknow", "Surat",

  // 🔽 Added many more cities (India + global mix)
  "Visakhapatnam", "Nagpur", "Indore", "Bhopal",
  "Patna", "Vadodara", "Ludhiana", "Agra",
  "Nashik", "Faridabad", "Meerut", "Rajkot",
  "Varanasi", "Srinagar", "Amritsar", "Ranchi",
  "Guwahati", "Chandigarh", "Mysore", "Trichy",
  "Madurai", "Salem", "Erode", "Tiruppur",

  "Dubai", "Singapore", "Tokyo", "Seoul",
  "Shanghai", "Beijing", "Hong Kong", "Bangkok",
  "Kuala Lumpur", "Jakarta", "Sydney", "Melbourne",
  "London", "Manchester", "Berlin", "Paris",
  "Rome", "Madrid", "Amsterdam", "Zurich",
  "New York", "Los Angeles", "Chicago", "Houston",
  "Toronto", "Vancouver", "Mexico City", "Sao Paulo",
  "Buenos Aires", "Cape Town", "Johannesburg", "Nairobi"
];

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateShipments(count = 1000) {
  const shipments = [];

  for (let i = 1; i <= count; i++) {
    const quantity = randomNumber(10, 500);
    const weight = randomNumber(20, 1200);

    const shipment = {
      id: `shipment-${i}`,

      itemName: random(itemNames),
      quantity,
      weight,

      destination: random(destinations),

      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    shipments.push(shipment);
  }

  return shipments;
}

const data = {
  shipments: generateShipments(1500)
};

fs.writeFileSync("db2.json", JSON.stringify(data, null, 2));

console.log("✅ db.json generated with rich shipment data");
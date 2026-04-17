require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Cart = require('../models/Cart');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const result = await Cart.deleteMany({});
  console.log('✅ Cleared all stale cart entries:', result.deletedCount);
  process.exit(0);
}).catch((e) => { console.error(e); process.exit(1); });

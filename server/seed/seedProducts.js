require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');

const products = [
  // Fruits & Vegetables
  { name: 'Banana', description: 'Fresh yellow bananas, rich in potassium', price: 40, originalPrice: 55, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&q=80', category: 'Fruits & Vegetables', unit: '6 pcs', stock: 200, discount: 27, deliveryTime: '10 mins' },
  { name: 'Apple', description: 'Crispy Shimla apples, freshly sourced', price: 120, originalPrice: 150, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&q=80', category: 'Fruits & Vegetables', unit: '4 pcs', stock: 150, discount: 20, deliveryTime: '10 mins' },
  { name: 'Tomato', description: 'Farm fresh red tomatoes', price: 30, originalPrice: 40, image: 'https://images.unsplash.com/photo-1546470427-252a9373be35?w=300&q=80', category: 'Fruits & Vegetables', unit: '500 g', stock: 300, discount: 25, deliveryTime: '10 mins' },
  { name: 'Onion', description: 'Fresh red onions', price: 35, originalPrice: 45, image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=300&q=80', category: 'Fruits & Vegetables', unit: '1 kg', stock: 250, discount: 22, deliveryTime: '10 mins' },
  { name: 'Spinach', description: 'Organic baby spinach leaves', price: 25, originalPrice: 35, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&q=80', category: 'Fruits & Vegetables', unit: '250 g', stock: 100, discount: 29, deliveryTime: '10 mins' },
  { name: 'Mango', description: 'Alphonso mangoes, king of fruits', price: 200, originalPrice: 250, image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=300&q=80', category: 'Fruits & Vegetables', unit: '1 kg', stock: 80, discount: 20, deliveryTime: '10 mins' },

  // Dairy & Breakfast
  { name: 'Amul Milk', description: 'Full cream milk, 3.5% fat', price: 62, originalPrice: 68, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&q=80', category: 'Dairy & Breakfast', unit: '1 L', stock: 500, discount: 9, deliveryTime: '8 mins' },
  { name: 'Paneer', description: 'Fresh homestyle paneer', price: 90, originalPrice: 110, image: 'https://images.unsplash.com/photo-1628197993543-dc10e57df3b5?w=300&q=80', category: 'Dairy & Breakfast', unit: '200 g', stock: 120, discount: 18, deliveryTime: '8 mins' },
  { name: 'Curd', description: 'Creamy dahi, probiotic rich', price: 45, originalPrice: 55, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&q=80', category: 'Dairy & Breakfast', unit: '400 g', stock: 200, discount: 18, deliveryTime: '8 mins' },
  { name: 'Eggs', description: 'Farm fresh brown eggs', price: 80, originalPrice: 95, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&q=80', category: 'Dairy & Breakfast', unit: '6 pcs', stock: 300, discount: 16, deliveryTime: '8 mins' },
  { name: 'Butter', description: 'Amul salted butter', price: 55, originalPrice: 60, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300&q=80', category: 'Dairy & Breakfast', unit: '100 g', stock: 150, discount: 8, deliveryTime: '8 mins' },

  // Snacks & Munchies
  { name: 'Lays Classic Salted', description: 'America`s crunchy original potato chips', price: 20, originalPrice: 20, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&q=80', category: 'Snacks & Munchies', unit: '52 g', stock: 400, discount: 0, deliveryTime: '10 mins' },
  { name: 'Kurkure Masala', description: 'Spicy crunchy corn puffs', price: 20, originalPrice: 20, image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=300&q=80', category: 'Snacks & Munchies', unit: '70 g', stock: 350, discount: 0, deliveryTime: '10 mins' },
  { name: 'Biscuits Parle-G', description: 'India`s most loved glucose biscuit', price: 10, originalPrice: 10, image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300&q=80', category: 'Snacks & Munchies', unit: '100 g', stock: 600, discount: 0, deliveryTime: '10 mins' },
  { name: 'Dark Fantasy Cookies', description: 'Sunfeast choco creme sandwich cookies', price: 30, originalPrice: 35, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&q=80', category: 'Snacks & Munchies', unit: '75 g', stock: 200, discount: 14, deliveryTime: '10 mins' },

  // Cold Drinks & Juices
  { name: 'Coca-Cola', description: 'Refreshing cola drink', price: 45, originalPrice: 50, image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300&q=80', category: 'Cold Drinks & Juices', unit: '750 ml', stock: 300, discount: 10, deliveryTime: '10 mins' },
  { name: 'Real Orange Juice', description: 'Dabur Real 100% fruit juice', price: 90, originalPrice: 105, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&q=80', category: 'Cold Drinks & Juices', unit: '1 L', stock: 150, discount: 14, deliveryTime: '10 mins' },
  { name: 'Sprite', description: 'Lemon-lime refresher', price: 40, originalPrice: 45, image: 'https://images.unsplash.com/photo-1625772452859-1c03d884dcd7?w=300&q=80', category: 'Cold Drinks & Juices', unit: '750 ml', stock: 250, discount: 11, deliveryTime: '10 mins' },
  { name: 'Red Bull', description: 'Energy drink for the bold', price: 125, originalPrice: 135, image: 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=300&q=80', category: 'Cold Drinks & Juices', unit: '250 ml', stock: 100, discount: 7, deliveryTime: '10 mins' },

  // Instant & Frozen Food
  { name: 'Maggi Noodles', description: 'Classic 2-minute masala noodles', price: 14, originalPrice: 14, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&q=80', category: 'Instant & Frozen Food', unit: '70 g', stock: 800, discount: 0, deliveryTime: '10 mins' },
  { name: 'McCain Fries', description: 'Golden crispy frozen potato fries', price: 120, originalPrice: 145, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&q=80', category: 'Instant & Frozen Food', unit: '420 g', stock: 100, discount: 17, deliveryTime: '10 mins' },
  { name: 'Haldiram Poha', description: 'Ready-to-eat flattened rice snack', price: 35, originalPrice: 40, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300&q=80', category: 'Instant & Frozen Food', unit: '200 g', stock: 200, discount: 13, deliveryTime: '10 mins' },

  // Bakery & Bread
  { name: 'Britannia Bread', description: 'Soft sandwich bread, 100% whole wheat', price: 42, originalPrice: 50, image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=300&q=80', category: 'Bakery & Bread', unit: '400 g', stock: 200, discount: 16, deliveryTime: '8 mins' },
  { name: 'Croissant', description: 'Flaky buttery French croissant', price: 35, originalPrice: 40, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&q=80', category: 'Bakery & Bread', unit: '2 pcs', stock: 80, discount: 13, deliveryTime: '8 mins' },

  // Personal Care
  { name: 'Dove Soap', description: '1/4 moisturizing cream beauty bar', price: 55, originalPrice: 65, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&q=80', category: 'Personal Care', unit: '100 g', stock: 250, discount: 15, deliveryTime: '12 mins' },
  { name: 'Colgate Toothpaste', description: 'Strong teeth & fresh breath protection', price: 75, originalPrice: 90, image: 'https://images.unsplash.com/photo-1611115736041-a14a9f5efbaa?w=300&q=80', category: 'Personal Care', unit: '200 g', stock: 300, discount: 17, deliveryTime: '12 mins' },
  { name: 'Head & Shoulders Shampoo', description: 'Anti-dandruff cool menthol shampoo', price: 165, originalPrice: 195, image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300&q=80', category: 'Personal Care', unit: '340 ml', stock: 150, discount: 15, deliveryTime: '12 mins' },

  // Household Essentials
  { name: 'Surf Excel Detergent', description: 'Removes tough stains in cold water', price: 195, originalPrice: 220, image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=300&q=80', category: 'Household Essentials', unit: '1 kg', stock: 180, discount: 11, deliveryTime: '12 mins' },
  { name: 'Harpic Power Plus', description: '10x powerful toilet cleaning solution', price: 110, originalPrice: 130, image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=300&q=80', category: 'Household Essentials', unit: '500 ml', stock: 120, discount: 15, deliveryTime: '12 mins' },
  { name: 'Colin Glass Cleaner', description: 'Streak-free glass & surface cleaner', price: 80, originalPrice: 95, image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=300&q=80', category: 'Household Essentials', unit: '500 ml', stock: 100, discount: 16, deliveryTime: '12 mins' },
];

const seedProducts = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  await Product.deleteMany({});
  console.log('🗑️  Cleared existing products');

  await Product.insertMany(products);
  console.log(`🎉 Seeded ${products.length} products successfully!`);
  process.exit(0);
};

seedProducts().catch((err) => {
  console.error('❌ Error seeding products:', err.message);
  process.exit(1);
});

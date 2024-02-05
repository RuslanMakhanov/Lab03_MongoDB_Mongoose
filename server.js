const express = require('express');
const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant'); 

const app = express();
const port = 3000;

// Connect to MongoDB
const DB_HOST = "cluster0.bytowar.mongodb.net"
const DB_USER = "misterruslan1701"
const DB_PASSWORD = "544081"
const DB_NAME = "lab3_restaurant_database"
const DB_CONNECTION_STRING = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`
mongoose.connect(DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());

// REST API to return all restaurant details
app.get('/restaurants', async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    res.json(restaurants);
  } catch (err) {
    res.status(500).send(err);
  }
});

// REST API to return all restaurant details by cuisine
app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  try {
    const { cuisine } = req.params;
    const restaurants = await Restaurant.find({ cuisine: cuisine });
    res.json(restaurants);
  } catch (err) {
    res.status(500).send(err);
  }
});

// REST API to return restaurants sorted by restaurant_id
app.get('/restaurants', async (req, res) => {
  const { sortBy } = req.query;
  try {
    const order = sortBy.toUpperCase() === 'ASC' ? 'asc' : 'desc';
    const restaurants = await Restaurant.find({}).sort({ restaurant_id: order });
    res.json(restaurants);
  } catch (err) {
    res.status(500).send(err);
  }
});

// REST API for Delicatessen excluding Brooklyn
app.get('/restaurants/Delicatessen', async (req, res) => {
  try {
    const restaurants = await Restaurant.find({
      cuisine: 'Delicatessen',
      city: { $ne: 'Brooklyn' }
    }).sort({ name: 1 }).select({ cuisine: 1, name: 1, city: 1, _id: 0 });
    res.json(restaurants);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

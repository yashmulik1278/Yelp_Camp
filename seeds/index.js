const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '65ed56d24a3ed3c9b4380c85',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
              type: "Point",
               coordinates: [
                cities[random1000].longitude,
                cities[random1000].latitude
               ]
              },
            images: [
                {
                  url: 'https://res.cloudinary.com/dvuvqvhf0/image/upload/v1710052955/YelpCamp/eybp2hjzov8krevot2ow.jpg',
                  filename: 'YelpCamp/eybp2hjzov8krevot2ow' 
                },
                {
                  url: 'https://res.cloudinary.com/dvuvqvhf0/image/upload/v1710052957/YelpCamp/zmnwd0axisr6eyf5ap2f.jpg',
                  filename: 'YelpCamp/zmnwd0axisr6eyf5ap2f'
                }
              ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
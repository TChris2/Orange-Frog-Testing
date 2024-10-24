require('dotenv').config();
const mongoose = require('mongoose');

const mongoURI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@orangefrog.xmt6e.mongodb.net/?retryWrites=true&w=majority&appName=OrangeFrog`;

mongoose.connect(mongoURI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(() => {
        console.error("Failed to connect to MongoDB");
    });

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    address: { type: String }, // Optional at first
    dob: { type: Date },       // Optional at first
    allergies: { type: String }, // Optional at first
    extraComments: { type: String }, 
    temporaryPassword: { type: Boolean, default: true }, // For the first-time login check
    status: { type: String, default: 'pending' } // Status starts as 'pending'
});

const userCollection = mongoose.model('userCollection', userSchema);

const eventSchema = new mongoose.Schema({
    eventName: { type: String, required: true },
    eventLoadIn: { type: Date, required: true },
    eventLoadOut: { type: Date, required: true },
    eventLocation: { type: String, required: true },
    eventHours: { type: Number },
    eventDescription: { type: String }
});
  
const eventCollection = mongoose.model('eventCollection', eventSchema);

const collection = {
    userCollection,
    eventCollection
};

module.exports = collection;

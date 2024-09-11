const mongoose =require("mongoose");
const Listing = require("../modules/listing.js");
const sampleListings = require("./data.js");

main().then(()=>{
    console.log("connection established");
    }).catch(err => console.log(err));
    
    async function main() {
      await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
    };

const dataInit = async()=>{
    //clear datbase
    await Listing.deleteMany({});
    //insert data in db
    await Listing.insertMany(sampleListings.data);
    console.log("data inserted successfully");
};

dataInit();
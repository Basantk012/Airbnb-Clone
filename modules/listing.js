const mongoose =require("mongoose");

const newListing = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    description : String,
    image : {
        type : String,
        required : true,
        set : (v)=> v==="" ? "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v ,
        default : "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" ,
        
    },
    price : {
        type : Number,
        required : true,
    },
    location : {
        type : String,
        required : true,
    },
    country : {
        type : String,
        required : true,
    },
});

const Listing = mongoose.model("Listing",newListing);

module.exports = Listing;
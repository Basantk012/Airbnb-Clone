const express = require("express");
const app = express();
const mongoose =require("mongoose");
const Listing = require("./modules/listing.js");
const path =require("path");
var methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

main().then(()=>{
console.log("connection established");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

const port =3000;
app.listen(port,()=>{
    console.log(`Server is listening on port ${port}`);
});

        // Index route
app.get("/listing", wrapAsync(async (req, res) => {
  try {
      const allData = await Listing.find({});
      res.render("./listings/index.ejs", { allData });
  } catch (err) {
      console.error(err);
      res.status(500).send("Error retrieving listings.");
  }
}));

//create route

app.get("/listing/new", async (req,res)=>{
  res.render("./listings/new.ejs");
});

app.post("/listing", wrapAsync(async(req,res,next)=>{

  const {title,description,image,price,location,country} = req.body;

  const newListing = new Listing({
      title : title,
      description : description,
      image : image,
      price : price,
      location : location,
      country : country,
  });
  await newListing.save();
  console.log(newListing);
  res.redirect("/listing");   
  next(err); 
}));

// Show route
app.get("/listing/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
      const specData = await Listing.findById(id);
      res.render("./listings/show.ejs", { specData });

  }));

// Edit route
app.get("/listing/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const specData = await Listing.findById(id);
    res.render("./listings/edit.ejs", { specData });
}));

// Update route
app.put("/listing/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { title, description, image, price, location, country } = req.body;
    
    // Update the listing
    const updateData = await Listing.findByIdAndUpdate(id, {
      title,
      description,
      image,
      price,
      location,
      country
    }, { new: true });
    console.log(updateData);
    // Redirect to the listing page after update
    res.redirect(`/listing/${id}`);
}));

// delete the listing

app.delete("/listing/:id", wrapAsync(async (req, res) => {
      const { id } = req.params;

      const deletedListing = await Listing.findByIdAndDelete(id);

      if (!deletedListing) {
          return res.status(404).send("Listing not found or already deleted");
      }

      console.log("Deleted Listing:", deletedListing);
      res.redirect("/listing");

}));

app.all("*",(req,res,next)=>{
   next(new ExpressError(404,"page not found!"));
});

app.use((err,req,res,next)=>{
  const{ status=500,message="Something went wrong"} = err;
  res.render("./listings/error.ejs",{err});
});


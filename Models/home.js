const mongoose = require("mongoose");
const homeSchema = new mongoose.Schema({
  houseName: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  rating: { type: Number, required: true },
  photo: String,
  description: String,
});

homeSchema.pre("findByIdAndDelete", async function (next) {
  console.log("came to delete");
  const homeId = this.getQuery()._id;

  Favourate.deleteMany({ houseId: homeId });
  next();
});

module.exports = mongoose.model("Home", homeSchema);
// mongoose.model creates a Home model using the homeSchema from which we can access all features of it
// required : true value is must otherwise it does not submit form
// if required not mentioned value can or cannot be there
// it's just a predefined structure other fields can be added at the time of data creation

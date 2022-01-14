const mongoose = require("mongoose");
const Like = mongoose.model(
  "like",
  new mongoose.Schema({
    like: Boolean
  })
);
module.exports = Like;
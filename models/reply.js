const mongoose = require("mongoose");
const Reply = mongoose.model(
  "reply",
  new mongoose.Schema({
    time: Date,
    text: String,
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'like'
    }]
  })
);
module.exports = Reply;
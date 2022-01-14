const mongoose = require("mongoose");
const Thread = mongoose.model(
  "thread",
  new mongoose.Schema({
    title: String,
    replies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'reply'
    }],
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'like'
    }]
  })
);
module.exports = Thread;
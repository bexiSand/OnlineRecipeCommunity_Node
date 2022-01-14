const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const passport = require("./passport/setup");
app.use(passport.initialize());

const mongoose = require("mongoose");
const { response } = require("express");

mongoose.connect("mongodb://localhost:27017/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const Thread = require("./models/thread");
const User = require("./models/user");
const Reply = require("./models/reply");
const Like = require("./models/like");

//Jag lyckades inte få controller-kopplingen att funka helt och hållet
/*const threadController = require("./controller/threadController")
const userController = require("./controller/userController")
const replyController = require("./controller/replyController")
const likeController = require("./controller/likeController")

//ROUTES

//user
app.post("/user", userController.post);

//thread
app.get("/thread", passport.authenticate('basic', { session: false }), threadController.get);
app.post("/thread", threadController.post);
app.get("/thread/:id", threadController.getById);
app.delete("/thread/:id", threadController.delete);

//reply
app.post("/thread/:id/reply", replyController.post);
app.get("/thread/:id/reply", replyController.get);

//like
app.post("/thread/:id/reply/:id/like", likeController.post);
app.delete("/thread/:threadId/reply/:replyId/like/:likeId", likeController.delete);*/


//ROUTES

// Hämtar alla trådar FUNKAR!!!
app.get("/thread", async (req, res) => {
  const threads = Thread.find().then((threads) => res.json(threads));
});

// Lägger till en tråd FUNKAR!!!
app.post("/thread", passport.authenticate('basic', { session: false }), (req, res) => {
  const thread = new Thread(req.body);
  thread.save((error, createdThread) => res.status(201).json(createdThread));
});

// Lägger till en user FUNKAR!!!
app.post("/user", (req, res) => {
  const user = new User(req.body);
  user.save((error, createdUser) => res.status(201).json(createdUser));
});

// Hämtar en specifik tråd FUNKAR!!!
app.get("/thread/:id", async (req, res) => {
  let thread;
  try {
    thread = await Thread.findById(req.params.id);
  } catch (e) {
    res.status(400).send("Bad request");
  }

  if (thread) {
    res.json(thread);
  } else {
    res.status(404).send("Not found");
  }
});

// Lägger till ett svar i en tråd FUNKAR!!!
app.post("/thread/:id/reply", passport.authenticate('basic', { session: false }), async (req, res) => {
  let thread;
  try {
    thread = await Thread.findById(req.params.id);
  } catch (e) {
    res.status(400).send("Bad request");
  }

  if (thread) {
    req.body.time = new Date();
    const reply = new Reply(req.body);
    thread.replies.push(reply);
    await reply.save();
    await thread.save();
    res.status(201).end();

  } else {
    res.status(404).send("Not found");
  }
});

// Tar bort en specifik tråd FUNKAR!!!
app.delete("/thread/:id", passport.authenticate('basic', { session: false }), async (req, res) => {
  try {
    await Thread.deleteOne({ _id: req.params.id });
  } catch (e) {
    res.status(400).send("Bad request");
  }
  res.status(200).end();
});

// Hämtar alla replies för en specifik tråd FUNKAR!!!
app.get("/thread/:id/reply", async (req, res) => {
  let thread;
  try {
    thread = await Thread.findById(req.params.id).populate("replies");
  } catch (e) {
    res.status(400).send("Bad request");
  }

  if (thread) {
    res.json(thread.replies);
  } else {
    res.status(404).send("Not found");
  }
});

// Lägger till en like till ett svar FUNKAR!!!
app.post("/thread/:id/reply/:id/like", passport.authenticate('basic', { session: false }), async (req, res) => {
  let reply;
  try {
    reply = await Reply.findById(req.params.id);
  } catch (e) {
    res.status(400).send("Bad request");
  }

  if (reply) {
    req.body.time = new Date();
    const like = new Like(req.body);
    reply.likes.push(like);
    await like.save();
    await reply.save();
    res.status(201).end();

  } else {
    res.status(404).send("Not found");
  }
});

// Tar bort en like till ett svar FUNKAR!!!
app.delete("/thread/:threadId/reply/:replyId/like/:likeId", async (req, res) => {
  try {
    reply = await Reply.findById(req.params.replyId);
    const id = reply.likes.indexOf(req.params.likeId); 
    const removedLike = reply.likes.splice(id,  1);
    await Like.deleteOne({ _id: req.params.likeId });
    await reply.save();
    res.status(200).end();
  } catch (e) {
    res.status(400).send("Bad request");
  }
  
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const Thread = require("../models/thread");
module.exports = {
  
    get: async (req, res) => {
        const threads = Thread.find().then((threads) => res.json(threads));
    },
    post: (req, res) => {
      const thread = new Thread(req.body);
      thread.save((error, createdThread) => res.status(201).json(createdThread));
    },
    getById: async (req, res) => {
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
    },
    delete: async (req, res) => {
      try {
        await Thread.deleteOne({ _id: req.params.id });
      } catch (e) {
        res.status(400).send("Bad request");
      }
      res.status(200).end();
    }
}
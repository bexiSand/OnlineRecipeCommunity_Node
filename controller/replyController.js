module.exports = {
    post: async (req, res) => {
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
      },
      get: async (req, res) => {
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
      }
}
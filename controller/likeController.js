module.exports = {
    post: async (req, res) => {
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
      },
    delete: async (req, res) => {
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
        
      }
}
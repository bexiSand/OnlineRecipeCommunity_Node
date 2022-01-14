module.exports = {
    post: (req, res) => {
        const user = new User(req.body);
        user.save((error, createdUser) => res.status(201).json(createdUser));
    }
}
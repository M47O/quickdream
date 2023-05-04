const User = require("../models/User")

module.exports.getPostsByUserId = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving user info from database');
    }
}
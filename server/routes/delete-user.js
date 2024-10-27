/*NEW STUFF*/
const express = require("express");
const router = express.Router();


// Delete user
app.delete('/', async (req, res) => {
    try {
        await userCollection.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
});

module.exports = router;
/*END OF NEW STUFF*/
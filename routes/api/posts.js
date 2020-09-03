const express =  require('express');
const router = express.Router();

// @route   GET api/posts
// @desc    Test route
// @access  Public (public routes don't need a token)
router.get('/', (req, res) => res.send('Posts route'));

module.exports = router;
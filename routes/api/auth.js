const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth
// @desc    Authenticate user & get token to get access to private routes
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    // make the request parameters available in this function as local constants
    const { email, password } = req.body;

    try {
      // Find a user by his email address
      let user = await User.findOne({ email });

      // Check if that user's email login exists in the database
      if (!user) {
        // If user doesn't exist, send 'bad request' error
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials ' }] });
      }

      // Check if the password the user provided matches the hashed password of that user account in the database
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        // If user doesn't exist, send 'bad request' error
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials ' }] });
      }

      // Return jsonwebtoken

      // get payload (including user id)
      const payload = {
        user: {
          id: user.id,
        },
      };

      // sign the json web token and pass in the payload, the secret, expiration date and the error or the token if no error is thrown
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 3600000 }, // Change expiration time to 3600 in production (one hour)
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      // Show the error message in the console
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;

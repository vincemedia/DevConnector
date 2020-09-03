const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

// Make the User model available in this route
const User = require('../../models/User');

// @route   POST api/users
// @desc    Test route
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or nire characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    // make the request parameters available in this function as local constants
    const { name, email, password } = req.body;

    try {
      // Find a user by his email address
      let user = await User.findOne({ email });

      // See if user exists (if it already exists the user cannot sign up with this email)
      if (user) {
        // If user doesn't exist, send 'bad request' error
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists ' }] });
      }

      // Get users gravatar
      const avatar = gravatar.url(email, {
        s: '200', // size: default size (pixels)
        r: 'pg', // rating: only PG approved images
        d: 'mm', // default: default user icon for people that don't have a gravatar
      });

      // Create a new user instance
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // Encrypt (hash) the password
      // 10 rounds of salt generation for randomness
      const salt = await bcrypt.genSalt(10);

      // create a hash from the user password and put it into user.password
      user.password = await bcrypt.hash(password, salt);

      // Save the user to the database
      await user.save();

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

var express = require('express');
var router = express.Router();
const User = require('../schemas/users');

// Get all users (not deleted)
router.get('/', async function (req, res, next) {
  try {
    const users = await User.find({ deleted: false }).populate('role');
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// Get user by id
router.get('/:id', async function (req, res, next) {
  try {
    const user = await User.findOne({ _id: req.params.id, deleted: false }).populate('role');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Create user
router.post('/', async function (req, res, next) {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

// Update user
router.put('/:id', async function (req, res, next) {
  try {
    const user = await User.findOneAndUpdate({ _id: req.params.id, deleted: false }, req.body, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Soft delete user
router.delete('/:id', async function (req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User soft-deleted' });
  } catch (err) {
    next(err);
  }
});

// Enable user by email and username
router.post('/enable', async function (req, res, next) {
  try {
    const { email, username } = req.body;
    if (!email || !username) return res.status(400).json({ message: 'email and username required' });
    const user = await User.findOneAndUpdate({ email, username }, { status: true }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User enabled', user });
  } catch (err) {
    next(err);
  }
});

// Disable user by email and username
router.post('/disable', async function (req, res, next) {
  try {
    const { email, username } = req.body;
    if (!email || !username) return res.status(400).json({ message: 'email and username required' });
    const user = await User.findOneAndUpdate({ email, username }, { status: false }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User disabled', user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

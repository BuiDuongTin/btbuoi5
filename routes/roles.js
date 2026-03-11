var express = require('express');
var router = express.Router();
const Role = require('../schemas/roles');
const User = require('../schemas/users');

// Get all roles (not deleted)
router.get('/', async function (req, res, next) {
  try {
    const roles = await Role.find({ deleted: false }).lean();
    res.json(roles);
  } catch (err) {
    next(err);
  }
});

// Get role by id
router.get('/:id', async function (req, res, next) {
  try {
    const role = await Role.findOne({ _id: req.params.id, deleted: false });
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json(role);
  } catch (err) {
    next(err);
  }
});

// Create role
router.post('/', async function (req, res, next) {
  try {
    const role = new Role(req.body);
    await role.save();
    res.status(201).json(role);
  } catch (err) {
    next(err);
  }
});

// Update role
router.put('/:id', async function (req, res, next) {
  try {
    const role = await Role.findOneAndUpdate({ _id: req.params.id, deleted: false }, req.body, { new: true });
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json(role);
  } catch (err) {
    next(err);
  }
});

// Soft delete role
router.delete('/:id', async function (req, res, next) {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true });
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json({ message: 'Role soft-deleted' });
  } catch (err) {
    next(err);
  }
});

// Get users belonging to a role
router.get('/:id/users', async function (req, res, next) {
  try {
    const users = await User.find({ role: req.params.id, deleted: false }).populate('role');
    res.json(users);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

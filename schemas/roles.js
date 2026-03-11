const mongoose = require('mongoose');
const { Schema } = mongoose;

const RoleSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  deleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Role', RoleSchema);

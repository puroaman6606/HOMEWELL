const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, 'fullname is required'],
      trim: true
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: [true, 'Password is required']
    },

    role: {
      type: String,
      enum: ['guest', 'host', 'admin'],
      default: 'guest'
    },

    isActive: {
      type: Boolean,
      default: true
    },

    favourites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Home'
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

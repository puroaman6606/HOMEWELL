// const mongoose=require('mongoose');

// const homeSchema=mongoose.Schema({
//     houseName:{
//         type:String,
//         required:true
//     },
//     rent:{
//         type:Number,
//         required:true
//     },
//     location:{
//         type:String,
//         required:true
//     },
//     photoUrl:{
//         type:String
//     }

// });


// module.exports=mongoose.model('Home',homeSchema);

const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema(
  {
    houseName: {
      type: String,
      required: true,
      trim: true
    },

    rent: {
      type: Number,
      required: true
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    photoUrl: {
      type: String
    },

    hostId: {           //  for user specific homes not all homes
      type: mongoose.Schema.Types.ObjectId,      
      ref: 'User',
      required: true
    },

    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'APPROVED'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Home', homeSchema);

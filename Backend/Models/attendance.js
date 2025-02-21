const { type } = require('@testing-library/user-event/dist/cjs/utility/type.js');
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    beneficiaireFormation: { type: mongoose.Schema.Types.ObjectId, ref: "BeneficiareFormation",required:true },
    seance:{type: mongoose.Schema.Types.ObjectId,ref:"Seance",required:true},
    isPresent:{type:Boolean,required:false,default:false}
  }, { timestamps: true });
  const Attendance = mongoose.model("Attendance",attendanceSchema);
  module.exports=Attendance;

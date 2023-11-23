const mongoose = require('mongoose')

const citaSchema = new mongoose.Schema(
    {
       nombre:{
            type:String
       },
       numeroDocumento:{
            type:String,
            unique:true
       },
       fechaCita:{
            type:String,
            unique:true
       },
       horaCita:{
            type:String,
            unique:true
       },
       doctorAsignado:{
          type:String
       }

    }
)

const Cita =
module.exports = mongoose.model('Cita',citaSchema)
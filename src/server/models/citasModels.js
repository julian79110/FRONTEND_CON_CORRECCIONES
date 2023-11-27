const mongoose = require('mongoose')

const citaSchema = new mongoose.Schema(
    {
       nombre:{
            type:String
       },
       numeroDocumento:{
            type:String,
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
       },
       estado: {
          type: String,
          default: "programada", 
          enum: ["programada", "cancelada", "atendida"] 
        }

    }
)

const Cita =
module.exports = mongoose.model('Cita',citaSchema)
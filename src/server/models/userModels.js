const mongoose = require('mongoose')
const bcryptjs= require ('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
        },
        email:{
            type: String,
            match: [
                /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/,
                "email no valido"
            ]
        },
        numeroDoc:{
            type:String,
            unique: [true,"documento ya registrado"]
        },
        password:{
            type: String,
        },
        tipoDoc:{
            type:String,
        },
        role:{
            type:String,
            enum:[
                "paciente",
                "doctor"
            ]
        },
        createdAt:{
            type: Date,
            default: Date.now
        }

    }
)
//crear la accion pre
userSchema.pre('save', async function(next){
    //crear la sal
    const sal = await bcryptjs.genSalt(10)
    //encriptar la contraseña
    this.password= await bcryptjs.
                   hash(this.password, sal)
})

//metodo construye el json web token (no)


userSchema.methods.ObtenerTokenJWT= function(){
    const JWT_SECRET_KEY = "la pereza está matando a colombia, vote pacto historico"
    return jwt.sign({
        id: this._id,
        name: this.name,
        password: this.password,
        role: this.role,
        numeroDoc: this.numeroDoc
    }, 
        JWT_SECRET_KEY, 
        { 
            expiresIn: Date.now() + 10000
        }
    )
}

//comparar password del body
userSchema.methods.comparePassword = async function(password){
    return await bcryptjs.compare(password, this.password)
}



const User =
module.exports = mongoose.model('User',userSchema)
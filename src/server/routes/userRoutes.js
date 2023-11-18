const express = require('express')
const router = express.Router()
const userModel = require ('../models/userModels')

router.post('/register', 
            async(req, res)=>{
                const {name, email, password, role} = req.body;
                try {
                    const user = 
                    await userModel.create({
                        name,
                        email,
                        role,
                        password
                    })
            res
                .status(201)
                .json({
                    sucess: true,
                    msg: "usuario creado exitosamente",
                    token:user.ObtenerTokenJWT()
                })
                } catch (error) {
                    res
                        .status(400)
                        .json({
                            sucess: false,
                            message: error.message
                        })
                    
                }

            })

router.post('/login', async (req, res) => {
    
    const {email,password}=req.body;

    //si no llega email o password
    if(!email || !password){
        res.status(400).json({
            success:false,
            message: "Debe ingresar el email o password"
        })
    }else{
        try {
            //encontrar usuario con el password
            const user = await userModel.findOne({ email }).select("+password")
            
            //console.log(user)
            if (!user) {
                res.status(400).json({
                    success:false,
                    msg:"no se encontro el usuario"
                })
            }
            else{
                //comparar
                const isMatch = await user.comparePassword(password)
                if(!isMatch){
                    res.status(400).json({
                        success: false,
                        msg:"contraseña incorrecta"
                        
                    })
                }else{
                    res.status(200).json({
                        success: true,
                        msg:"la contraseña es correcta",
                        token: user.ObtenerTokenJWT()
                    })
                }
            }
        } catch (error) {
            
        }
    }
})

module.exports = router
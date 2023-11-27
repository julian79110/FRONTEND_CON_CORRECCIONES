const express = require('express')
const router = express.Router()
const moongose = require('mongoose')
const userModel = require ('../models/userModels')

router.post('/register', 
            async(req, res)=>{
                const {name, email, numeroDoc, password, tipoDoc, role, disponibilidad} = req.body;
                try {
                    const user = 
                    await userModel.create({
                        name,
                        email,
                        numeroDoc,
                        role,
                        password,
                        tipoDoc,
                        disponibilidad
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
            // Ruta para obtener doctores con disponibilidad
router.get('/disponibles', async (req, res) => {
    try {
      const { disponibilidad, role } = req.query;
  
      // Crear un objeto de filtro basado en los parámetros de consulta
      const filter = { role };
      if (disponibilidad) {
        filter.disponibilidad = disponibilidad === 'true'; // Convierte el string 'true' en un booleano true
      }
  
      const doctoresDisponibles = await userModel.find(filter);
  
      res.status(200).json({
        success: true,
        data: doctoresDisponibles,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });

  router.put('/actualizarDoctor/:numeroDoc', async (req, res) => {
    try {
        const numeroDoc = req.params.numeroDoc;
        const { name, email, password } = req.body;

        // Construir un objeto con los campos que se pueden actualizar
        const updateFields = {};
        if (name) {
            updateFields.name = name;
        }
        if (email) {
            updateFields.email = email;
        }
        if (password) {
            updateFields.password = password;
        }

        // Validar que numeroDoc sea único
        const existingDoctor = await userModel.findOne({ numeroDoc });
        if (!existingDoctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor no encontrado',
            });
        }

        // Actualizar los campos especificados del doctor
        const updatedDoctor = await userModel.findOneAndUpdate(
            { numeroDoc }, // Usar el campo numeroDoc para buscar
            updateFields,
            { new: true }
        );

        if (!updatedDoctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor no encontrado',
            });
        }

        res.status(200).json({
            success: true,
            data: updatedDoctor,
            message: 'Datos del doctor actualizados con éxito',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

  

           // Ruta para obtener datos del usuario por ID
router.get('/doctores/:id', async (req, res) => {
    try {
      const doctorId = req.params.id;
      const doctor = await userModel.findById(doctorId);
  
      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: 'Doctor no encontrado',
        });
      }
  
      res.status(200).json({
        success: true,
        data: doctor,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });

   // listar usuarios
  router.get('/listar', async (req, res) => {
  try {
   
    const usuarios = await userModel.find();

    res.status(200).json({
      success: true,
      data: usuarios,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Ruta para eliminar un usuario por ID
router.delete('/eliminar/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        // Verificar si el usuario existe
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
            });
        }

        // Eliminar el usuario
        await userModel.findByIdAndDelete(userId);

        res.status(200).json({
            success: true,
            message: 'Usuario eliminado con éxito',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

//actualizar bootcamp por id
router.put('/actualizar/:id',
  async (request, response)=>{
    try {
        const bootcampId= request.params.id

        if(!moongose.Types.ObjectId.isValid(bootcampId)){
            response
            .status(500)
            .json({
                success: false,
                msg: "Id invalido"
            })
        }else{
            const updBootcamp = await userModel.findByIdAndUpdate(
                bootcampId, 
                request.body,
                {
                    new:true
                }  
            )

            if (!updBootcamp) {
                return response
                    .status(404)
                    .json({
                        success: false,
                        msg:`No se encuentra el usuario con id: ${bootcampId}`
                    })
                
            }
            else{
                response
                .status(200)
                .json({
                    "success": true, 
                    "results": updBootcamp
                })
            }
        }
        
    } catch (error) {
        response
                .status(500)
                .json({
                    success: false,
                    msg: "Error interno del servidor"
                })   
    }
})

  
//login 
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
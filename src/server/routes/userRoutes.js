const express = require('express')
const router = express.Router()
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

  router.patch('/:id', async (req, res) => {
    try {
        const doctorId = req.params.id;
        const { name, email, password, disponibilidad } = req.body;

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
        if (disponibilidad !== undefined) {
            updateFields.disponibilidad = disponibilidad;
        }

        // Actualizar los campos especificados del doctor
        const updatedDoctor = await userModel.findByIdAndUpdate(doctorId, updateFields, { new: true });

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
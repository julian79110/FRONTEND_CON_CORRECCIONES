const express = require("express")
const citasModel = require('../models/citasModels')
const moongose = require('mongoose')
const router = express.Router()

//URI of Bootcamps

//trae todos las citas
router.get('/',
    async(request, response)=>{

        try {
            const citas = await citasModel.find()

            if (citas.length === 0) {
                return response.
                status(404).
                json({
                    success: false,
                    msg:"No hay citas disponibles"
                })
            }

            response
                .status(200)
                .json({
                    "success": true, 
                    "results":citas
                })

        } catch (error) {
            response
                .status(500)
                .json({
                    success: false,
                    msg: "Error interno del servidor"
                })
        }
})


//traer usuario a traves del numero de documento: 

router.get('/busqueda/:numeroDocumento',
    async (request, response) => {
        try {
            const numeroDocumento = request.params.numeroDocumento;

            if (!numeroDocumento) {
                return response.status(400).json({
                    success: false,
                    msg: "Se requiere el número de documento para buscar citas."
                });
            }

            const citasUsuario = await citasModel.find({ numeroDocumento: numeroDocumento });

            if (!citasUsuario || citasUsuario.length === 0) {
                return response.status(404).json({
                    success: false,
                    msg: `No se encontraron citas para el usuario con número de documento ${numeroDocumento}.`
                });
            }

            response.status(200).json({
                success: true,
                results: citasUsuario
            });
        } catch (error) {
            console.error("Error interno del servidor:", error);
            response.status(500).json({
                success: false,
                msg: "Error interno del servidor"
            });
        }
    }
);

router.get('/busquedaD/:doctorAsignado',
    async (request, response) => {
        try {
            const doctorAsignado = request.params.doctorAsignado;

            if (!doctorAsignado) {
                return response.status(400).json({
                    success: false,
                    msg: "Se requiere el número de documento para buscar citas."
                });
            }

            const citasDoctor = await citasModel.find({ doctorAsignado: doctorAsignado });

            if (!citasDoctor || citasDoctor.length === 0) {
                return response.status(404).json({
                    success: false,
                    msg: `No se encontro el doctor.`
                });
            }

            response.status(200).json({
                success: true,
                results: citasDoctor
            });
        } catch (error) {
            console.error("Error interno del servidor:", error);
            response.status(500).json({
                success: false,
                msg: "Error interno del servidor"
            });
        }
    }
);

router.post('/register',
     async(request, response)=>{
        try {
            // Crear la cita, asegurándote de incluir doctorAsignado en el objeto
            const cita = await citasModel.create({
              nombre: request.body.nombre,
              numeroDocumento: request.body.numeroDocumento,
              fechaCita: request.body.fechaCita,
              horaCita: request.body.horaCita,
              doctorAsignado: request.body.doctorAsignado, // Asegúrate de incluir este campo
            });
        
            response.status(201).json({
              success: true,
              msg: 'Cita creada con éxito!',
            });
          } catch (error) {
            response.status(500).json({
              success: false,
              msg: error.message,
            });
          }
})

//validar si el doctor se registro mas de 4 veces
router.post('/validarDoctor',
  async (request, response) => {
    try {
      const { doctorAsignado } = request.body;

      if (!doctorAsignado) {
        return response.status(400).json({
          success: false,
          msg: "Se requiere el nombre del doctor para validar el límite de citas."
        });
      }

      // Obtén las citas del doctor
      const citasDoctor = await citasModel.find({ doctorAsignado: doctorAsignado });

      // Valida el límite de citas
      const excedeLimite = citasDoctor.length >= 4;

      response.status(200).json({
        success: true,
        excedeLimite: excedeLimite
      });
    } catch (error) {
      console.error("Error interno del servidor:", error);
      response.status(500).json({
        success: false,
        msg: "Error interno del servidor"
      });
    }
  }
);

router.put('/cancelarCita/:citaId', async (request, response) => {
    try {
      const { citaId } = request.params;
      const cita = await citasModel.findById(citaId);
  
      if (!cita) {
        return response.status(404).json({
          success: false,
          msg: "Cita no encontrada"
        });
      }
  
      // Cambiar el estado de la cita a "Cancelada"
      cita.estado = "cancelada";
      cita.doctorAsignado = "n/a"
      await cita.save();
  
      response.status(200).json({
        success: true,
        msg: "Cita cancelada exitosamente"
      });
    } catch (error) {
      console.error("Error al cancelar la cita:", error);
      response.status(500).json({
        success: false,
        msg: "Error interno del servidor"
      });
    }
  });

module.exports = router 
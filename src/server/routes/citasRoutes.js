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

//consulta especifica
router.get('/:id',
    async(request, response)=>{

        try {
            //traer el parametro id de la uri
            
            const bootcampId = request.params.id 
            
            if(!moongose.Types.ObjectId.isValid(bootcampId)){
                response
                .status(500)
                .json({
                    success: false,
                    msg: "Id invalido"
                })
            }else{
                const selected_bootcamp = await citasModel.findById(bootcampId)

                if (!selected_bootcamp) {
                    return response
                        .status(404)
                        .json({
                            success: false,
                            msg:`No se encuentra el bootcamp con id: ${bootcampId}`
                        })
                    
                }
                else{
                    response
                        .status(200)
                        .json({
                            "success": true, 
                            "results": selected_bootcamp
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
                    msg: `No se encontraron citas para el usuario con número de documento ${citasDoctor}.`
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

router.post('/',
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

//actualizar bootcamp por id
router.put('/:id',
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
            const updBootcamp = await citasModel.findByIdAndUpdate(
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
                        msg:`No se encuentra el bootcamp con id: ${bootcampId}`
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

//eliminar bootcamp por id 
router.delete('/:id',
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
           const delBootcamp = await citasModel.findByIdAndDelete(bootcampId)

           if (!delBootcamp) {
                return response
                    .status(404)
                    .json({
                        success: false,
                        msg:`No se encuentra el bootcamp con id: ${bootcampId}`
                    })
           }else{
            response
                .status(200)
                .json({
                    "success": true, 
                    "results":[]
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

module.exports = router 
const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

// Crea una nueva tarea
exports.crearTraea = async (req, res) => {

    //Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({ errores: errores.array() });
    }

    //Extraer el proyecto
    const { proyecto } = req.body; 

    try{
        
        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto) {
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        //Verificar el creador del proyecto
        if(existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg:"No autorizado"});
        }

        //Creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({ tarea });
    
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
    

}

//Obtener tareas por proyecto
exports.obtenerTareas = async (req, res) => {

    //Extraer el proyecto
    const { proyecto } = req.query;

    try{
        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto) {
            return res.status(400).json({msg: 'Proyecto no encontrado'});
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

        //Obtener las tareas por proyecto
        const tareas = await Tarea.find( { proyecto } ).sort({creado: -1 });
        res.json( { tareas } );

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}

//Actualizar tarea
exports.actualizarTarea = async (req, res) => {

    //Extraer el proyecto
    const { proyecto, nombre, estado, finalizado } = req.body;

    try{

        //Comprobar si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea) {
            return res.status(404).json({msg: 'No existe la tarea'});
        }

        //extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

        //Crear nueva tarea
        const nuevaTarea = {};

        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;
        nuevaTarea.finalizado = finalizado;

        //Guardar la tarea
        tarea = await Tarea.findOneAndUpdate({_id : req.params.id}, nuevaTarea, { new: true});
        res.json({tarea});

    } catch (error) {

        console.log(error);
        res.status(500).send('Hubo un error');
    }

}

//Eliminar tarea
exports.eliminarTarea = async (req, res) => {

    //Extraer el proyecto
    const { proyecto } = req.query;

    try{

        //Comprobar si la tarea existe o no
        let existeTarea = await Tarea.findById(req.params.id);

        if(!existeTarea) {
            return res.status(404).json({msg: 'No existe la tarea'});
        }

        //extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);


        //Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

        // Eliminar tarea
        await Tarea.findOneAndRemove({_id: req.params.id});
        res.json({msg: 'Tarea eliminada'});

    } catch (error) {

        console.log(error);
        res.status(500).send('Hubo un error');
    }

}
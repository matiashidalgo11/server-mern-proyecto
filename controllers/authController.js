const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {

    //revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    // extraer el email y password
    const {email, password} = req.body;

    try {

        // Revisr que sea un usuario registrado
        let usuario = await Usuario.findOne({email});

        if(!usuario) {
            return res.status(400).json({msg: 'EL usuario no existe'});
        }

        // Revisar el password
        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if(!passCorrecto) {
            return res.status(400).json({msg: 'El password es incorrecto'});
        }

        //Si todo es correcto
        //Crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        //firmar el token JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 360000
        }, (error, token) => {

            if(error) throw error;

            // Mensaje de confirmacion
            res.json({ token });
        });


    } catch ( error ) {
        console.log(error);
    }

}

//Obtiene que usuario esta autenticado
exports.usuarioAutenticado = async (req, res) => {

    try{

        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({usuario});

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
}
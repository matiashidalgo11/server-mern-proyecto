const mongoose = require('mongoose');
require('dotenv').config({path: 'variables.env'});

const conectarDB = () => {
    try{

        mongoose.connect(process.env.DB_MONG, {

            keepAlive: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('DB CONECTADA');

    } catch (error){

        console.log(error);
        process.exit(1) // Detener la app
    }
}

module.exports = conectarDB;
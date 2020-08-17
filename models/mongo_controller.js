const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const RifaModel = require('./rifa');
const CounterModel = require('./counter');

mongoose.connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', err => console.error(err));
db.once('open', () => console.log('Conectado a MongoDB'));

process.on('SIGINT', () => {
    db.close();
})

async function get_nro_rifa(){
    let registro_nro = await CounterModel.findOneAndUpdate({ id: 'rifa' }, { $inc: { nro: 1 } }, { new: true });
    if(!registro_nro){
        let valor_inicio = 1;
        let nuevo_contador = CounterModel({id: 'rifa', nro: valor_inicio});
        await nuevo_contador.save();
        return valor_inicio;
    }

    return registro_nro.nro;
}

async function almacenar_rifa(nombre, apellido, mail, nro_rifa){
    let nueva_rifa = await new RifaModel({ nombre: nombre, apellido: apellido, mail: mail, nro_rifa: nro_rifa })
    await nueva_rifa.save();
}

async function generar_rifas(nombre, apellido, mail, cantidad){
    let rifas = [];

    for(let i = 0; i < cantidad; i++){
        let nro_rifa;
        try {
            nro_rifa = await get_nro_rifa();
            await almacenar_rifa(nombre, apellido, mail, nro_rifa);
        } catch(e) {
            console.error(e);
        }
        rifas.push(nro_rifa);
    }

    return rifas;
}

module.exports = {
    generar_rifas
}
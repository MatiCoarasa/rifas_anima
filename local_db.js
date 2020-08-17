const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const process = require('process');

const TABLENAME = "txs";
const PATH_DB = "./txs.db"
let db;

process.on('SIGINT', () => {
    db.close();
})

function eliminarDB(){
    try {
        fs.unlinkSync(PATH_DB);
        } catch(e){
            if(!e.code === 'ENOENT'){ // Si no existe la BD no me importa.
                console.error(e);
            }
        }
}

function crearDB() {
    eliminarDB();

    db = new sqlite3.Database(PATH_DB, (err) => {
        if (err) {
          console.error(err.message);
        }
        console.log('Conectado a SQLite');
    });

    const create_query = `CREATE TABLE IF NOT EXISTS ${TABLENAME} (id TEXT, nombre TEXT, apellido TEXT, mail TEXT, cantidad INTEGER, is_pending INTEGER)`;
    return db.run(create_query);
}

crearDB();

function agregarTX(id, nombre, apellido, mail, cantidad){
    let insert_query = `INSERT INTO ${TABLENAME} VALUES ('${id}', '${nombre}', '${apellido}', '${mail}', ${cantidad}, 1)`;

    return new Promise((resolve, reject) => {
        db.run(insert_query, [], err => {
            if(err) reject(err);
            else resolve();
        })
    }) 
}

function setPending(id, value){
    let is_pending = value ? 1 : 0;
    let update_query = `UPDATE ${TABLENAME} SET is_pending = ${is_pending} WHERE id = '${id}'`;

    return new Promise((resolve, reject) => {
        db.run(update_query, [], err => {
            if(err) reject(err);
            else resolve();
        })
    }) 
}

function deleteTX(id){
    let delete_query = `DELETE FROM ${TABLENAME} WHERE id = '${id}'`;

    return new Promise((resolve, reject) => {
        db.run(delete_query, [], err => {
            if(err) reject(err);
            else resolve();
        })
    }) 
}

function findTX(id){
    let select_query = `SELECT * FROM ${TABLENAME} WHERE id = '${id}'`;

    return new Promise((resolve, reject) => {
        db.get(select_query, [], (err, result) => {
            if(err) reject(err);
            else resolve(result);
        })
    }) 
}

module.exports = {
    agregarTX,
    setPending,
    deleteTX,
    findTX
}
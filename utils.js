const rifa = require("./models/rifa");

function format_rifas_string(rifas){
    let joined_rifas = rifas.join('-');
    let rifas_oracion = rifas.length === 1 ? 'Tu numero de Rifa es' : 'Tus numeros de Rifas son';

    return { rifas_oracion: rifas_oracion, numeros_rifas: joined_rifas };
}

function capitalize_first_letter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function log_compra(nombre, apellido, mail, rifas){
    console.log(`${nombre} ${apellido} (${mail}) compró ${rifas.length} rifas (${rifas.join('-')})`);
}

function remove_non_ascii(str) {
    if ((str===null) || (str==='')) return false;
    else str = str.toString();
    
    return str.replace(/[^\x20-\x7E]/g, '');
}


module.exports = {
    format_rifas_string,
    capitalize_first_letter,
    log_compra,
    remove_non_ascii
}
// Si está en entorno de desarrollo, leer variables de ambiente del .env
if(!process.env.ENV || process.env.ENV === 'DEV'){
	require('dotenv').config();
}

// Configuración básica
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
const { enviar_mail_comprador, enviar_mail_notif } = require('./mail');
const { generar_rifas } = require('./models/mongo_controller');
const { agregarTX, deleteTX, findTX } = require('./local_db');
const { crear_prod } = require('./mp');
const { format_rifas_string, capitalize_first_letter, log_compra, remove_non_ascii } = require('./utils');
const { validate } = require('email-validator');
const path = require('path');
const { response } = require('express');
app.set('view engine', 'ejs');


// Ruta archivos publicos
app.use(express.static('public'));

const html_path = path.join(__dirname, 'public');


app.get('/', async (req, res) => {
	res.sendFile(html_path + '/index.html');
});

app.post('/procesar_pago', async (req, res) => {
	let { nombre, apellido, mail, cantidad } = req.body;
	if(!nombre || !apellido || !mail || !cantidad || isNaN(cantidad)) return res.sendStatus(400);

	mail = remove_non_ascii(mail);
	mail = mail.toLowerCase();
	if(!validate(mail)) return res.send('Por favor, verificar el mail. Puede tener caracteres invalidos.');
	nombre = capitalize_first_letter(nombre);
	apellido = capitalize_first_letter(apellido);
	let { tx_id, url_pago } = await crear_prod(nombre, apellido, mail, cantidad);
	await agregarTX(tx_id, nombre, apellido, mail, cantidad);
	res.redirect(url_pago);
})

app.get('/compra_exitosa', async (req, res) => {
	let tx_id = req.query.preference_id;
	if(!tx_id) return response.sendStatus(400);
	
	let tx = await findTX(tx_id);
	if(tx){
		deleteTX(tx_id);
		let { nombre, apellido, mail, cantidad } = tx; 
		let rifas = await generar_rifas(nombre, apellido, mail, cantidad);
		log_compra(nombre, apellido, mail, rifas);
		let mails_promises = [enviar_mail_comprador(mail, rifas), enviar_mail_notif(nombre, apellido, mail, rifas)]
		await Promise.allSettled(mails_promises)
		let { rifas_oracion, numeros_rifas } = format_rifas_string(rifas);
		res.render('rifa-finalizada', {data: {
			rifas_oracion: rifas_oracion,
			numeros_rifas: numeros_rifas,
			mail: mail
		}})
	} else {
		res.sendFile(html_path + '/refresh-pagina.html');
	}
})

const port = process.env.PORT || 5000;
app.listen(port, () => {console.log(`Server now running in port ${port}`)} );
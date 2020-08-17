const nodemailer = require('nodemailer');
const { format_rifas_string } = require('./utils');
const path = require('path');
const ejs = require('ejs');

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
})

function enviar_mail_comprador(dest, rifas){
    let {rifas_oracion, numeros_rifas} = format_rifas_string(rifas);

    return new Promise((resolve, reject) => {

        ejs.renderFile(path.join(__dirname, 'views', 'mail.ejs'), { data: { rifas_oracion, numeros_rifas } }, (err, rendered_html) => {
            if(err) reject(err);
            else {

                let mail_params = {
                    from: process.env.EMAIL,
                    to: dest,
                    subject: `Tus Rifas - ${process.env.NOMBRE_ORGANIZACION}`,
                    html: rendered_html
                }

                transporter.sendMail(mail_params)
                    .then(info => resolve(info))
                    .catch(err => reject(err));
            }
        });
    })
}

function enviar_mail_notif(nombre_comprador, apellido_comprador, mail_comprador, rifas){
    let { numeros_rifas } = format_rifas_string(rifas);
    let cant_rifas = rifas.length;

    let mail_params = {
        from: process.env.EMAIL,
        to: process.env.EMAIL_PASSWORD,
        subject: `${nombre_comprador} ${apellido_comprador} (${mail_comprador}) compró ${cant_rifas} rifa/s`,
        html: `Sus números son <b>${numeros_rifas}</b>`
    }

    return new Promise((resolve, reject) => {
        transporter.sendMail(mail_params)
            .then(info => resolve(info))
            .catch(err => reject(err));
    })
} 

module.exports = {
  enviar_mail_comprador,
  enviar_mail_notif,
};

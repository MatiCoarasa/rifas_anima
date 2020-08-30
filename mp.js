const mercadopago = require('mercadopago');
mercadopago.configure({
	access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
});

//mercadopago.configurations.setAccessToken(process.env.MERCADOPAGO_ACCESS_TOKEN)

async function crear_prod(nombre, apellido, mail, cantidad){
    const precio_x_rifa = parseInt(process.env.PRECIO_RIFA) || 100;
    cantidad = parseInt(cantidad);
    let preference = {
        payer: {
            name: nombre,
            surname: apellido,
            email: mail
        },
        items: [
            {
                title: `Rifa ${process.env.NOMBRE_ORGANIZACION}`,
                unit_price: precio_x_rifa,
                currency_id: "ARS",
                quantity: cantidad
            }
        ],
        payment_methods: {
            installments: 1,
            excluded_payment_types: [
                { "id": "ticket" },
                { "id": "atm" }
            ]
        },
        binary_mode: true,
        auto_return: "approved",
        back_urls: {
            "success": `${process.env.HOST}/compra_exitosa`
        },
    };

    let response = await mercadopago.preferences.create(preference);
    return { url_pago: response.body.init_point, tx_id: response.body.id };
}

module.exports = {
    crear_prod
}

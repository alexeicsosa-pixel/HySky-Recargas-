exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { message } = JSON.parse(event.body);
    const text = message.toLowerCase();

    let reply = "Gracias por contactar a Licencia de Software SAAS Hysky. Para soporte directo sobre tu recarga o saldo, ten a mano tu número de teléfono (+53).";

    if (text.includes('precio') || text.includes('cuanto cuesta') || text.includes('tarifa')) {
      reply = "Tenemos opciones desde 1.00 USD para pruebas, paquetes móviles y tarjetas clásicas con tasas transparentes.";
    } else if (text.includes('tardo') || text.includes('cuanto tarda') || text.includes('demora')) {
      reply = "Las recargas y acreditaciones se procesan de forma instantánea al completarse el pago seguro con Stripe.";
    } else if (text.includes('cuba') || text.includes('movil') || text.includes('recarga')) {
      reply = "Selecciona 'Cubacel Móvil' e introduce tu número de 8 dígitos empezando por 5.";
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Hubo un error al procesar tu consulta." }),
    };
  }
};

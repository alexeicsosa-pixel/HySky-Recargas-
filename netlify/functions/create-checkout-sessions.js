const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { 
            statusCode: 405, 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Método no permitido' }) 
        };
    }

    try {
        const body = JSON.parse(event.body);
        const { planId, planName, amount, recipient, userEmail } = body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: userEmail !== 'invitado@hysky.com' ? userEmail : undefined,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `HySky Recarga: ${planName}`,
                            description: `Destino: ${recipient}`,
                        },
                        unit_amount: Math.round(amount * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.URL}/?status=success`,
            cancel_url: `${process.env.URL}/?status=cancel`,
            metadata: {
                planId: planId,
                planName: planName,
                amount: amount,
                recipientInfo: recipient,
                userEmail: userEmail
            }
        });

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: session.id })
        };
    } catch (error) {
        console.error('Error en Stripe:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: error.message })
        };
    }
};

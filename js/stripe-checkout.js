async function processOrder() {
    if (!selectedPlanData) {
        alert('Por favor selecciona una recarga o plan para continuar.');
        return;
    }

    let payload = {
        itemTitle: selectedPlanData.name,
        amount: Math.round(selectedPlanData.price * 100),
        serviceType: currentService
    };

    if (currentService === 'movil') {
        const phone = document.getElementById('phone').value;
        const regexCuba = /^5\d{7}$/;
        if (!regexCuba.test(phone)) {
            alert('Por favor introduce un número válido en Cuba (8 dígitos empezando por 5).');
            return;
        }
        payload.recipientPhone = '+53' + phone;
    } else {
        const name = document.getElementById('recipient-name').value;
        const phone = document.getElementById('recipient-phone').value;
        const card = document.getElementById('card-number').value;

        if (!name || phone.length < 8 || card.length < 16) {
            alert('Por favor completa todos los datos de la tarjeta receptora (16 dígitos).');
            return;
        }
        payload.recipientName = name;
        payload.recipientPhone = '+53' + phone;
        payload.cardNumber = card;
    }

    const btnPay = document.getElementById('btn-pay');
    btnPay.disabled = true;
    btnPay.innerText = 'Cargando Checkout...';

    try {
        const response = await fetch('/.netlify/functions/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const session = await response.json();

        if (session.url) {
            window.location.href = session.url;
        } else {
            alert('Error al generar sesión de pago: ' + (session.error || 'Inténtalo de nuevo'));
            btnPay.disabled = false;
            btnPay.innerText = 'Pagar y Enviar Ahora';
        }
    } catch (err) {
        console.error('Error procesando pago:', err);
        alert('Hubo un error al conectar con el servidor.');
        btnPay.disabled = false;
        btnPay.innerText = 'Pagar y Enviar Ahora';
    }
}

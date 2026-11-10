let currentService = 'movil';
let selectedPlanData = null;

function switchServiceTab(service, btn) {
    currentService = service;
    document.querySelectorAll('.service-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.service-fields').forEach(f => f.classList.remove('active'));
    
    if (service === 'movil') {
        document.getElementById('fields-telecom').classList.add('active');
        document.getElementById('telecom-filters').style.display = 'flex';
        filterPlans('regular', document.querySelectorAll('.filter-btn')[1]);
    } else {
        document.getElementById('fields-tarjetas').classList.add('active');
        document.getElementById('telecom-filters').style.display = 'none';
        showTarjetaPlans();
    }
}

function filterPlans(type, btn) {
    if (currentService !== 'movil') return;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const items = document.querySelectorAll('.telecom-plan');
    items.forEach(item => {
        if (type === 'all' || item.classList.contains(type)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
    document.querySelectorAll('.tarjeta-plan').forEach(t => t.style.display = 'none');
}

function showTarjetaPlans() {
    document.querySelectorAll('.telecom-plan').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.tarjeta-plan').forEach(t => t.style.display = 'flex');
}

function selectPlan(element, id, name, price) {
    document.querySelectorAll('.plan-item').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
    selectedPlanData = { id, name, price };
}

function selectCustomCard(element) {
    document.querySelectorAll('.plan-item').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
    const inputVal = document.getElementById('custom-card-amount').value;
    updateCustomCardPrice(inputVal);
}

function updateCustomCardPrice(amount) {
    const val = parseFloat(amount);
    const priceContainer = document.getElementById('custom-card-price');
    if (!isNaN(val) && val >= 50) {
        const totalPrice = (val * 1.15).toFixed(2);
        priceContainer.innerText = '$' + totalPrice + ' USD';
        selectedPlanData = {
            id: 'tarjeta_custom_' + val,
            name: 'Tarjeta Clásica ' + val + ' USD',
            price: parseFloat(totalPrice)
        };
    } else {
        priceContainer.innerText = '$0.00';
        selectedPlanData = null;
    }
}

function openAuthModal() {
    document.getElementById('auth-modal').style.display = 'flex';
}

function closeAuthModal() {
    document.getElementById('auth-modal').style.display = 'none';
}

function switchAuthTab(tab, btn) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.getElementById(tab + '-form').classList.add('active');
}

function handleLogin(e) {
    e.preventDefault();
    document.getElementById('user-status-text').innerText = 'Usuario Conectado';
    closeAuthModal();
}

function handleRegister(e) {
    e.preventDefault();
    document.getElementById('user-status-text').innerText = 'Usuario Registrado';
    closeAuthModal();
}

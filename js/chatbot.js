(function() {
    const style = document.createElement('style');
    style.innerHTML = `
        .chatbot-fab {
            position: fixed;
            bottom: 15px;
            right: 15px;
            background-color: var(--primary-color, #0b1e36);
            color: white;
            border: none;
            border-radius: 50%;
            width: 55px;
            height: 55px;
            font-size: 22px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .chatbot-container {
            position: fixed;
            bottom: 80px;
            right: 15px;
            width: 320px;
            max-width: 92vw;
            height: 400px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 5px 25px rgba(0,0,0,0.2);
            display: none;
            flex-direction: column;
            z-index: 9999;
            overflow: hidden;
            font-family: 'Montserrat', sans-serif;
        }
        .chatbot-header {
            background: var(--primary-color, #0b1e36);
            color: white;
            padding: 12px 15px;
            font-weight: 700;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .chatbot-close { background: none; border: none; color: white; font-size: 18px; cursor: pointer; }
        .chatbot-messages {
            flex: 1;
            padding: 12px;
            overflow-y: auto;
            background: #f8fafc;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .chat-msg {
            padding: 8px 12px;
            border-radius: 10px;
            font-size: 0.8rem;
            max-width: 85%;
            line-height: 1.35;
        }
        .chat-msg.bot { background: #e2e8f0; color: #0b1e36; align-self: flex-start; }
        .chat-msg.user { background: var(--primary-color, #0b1e36); color: white; align-self: flex-end; }
        .chatbot-input-area {
            display: flex;
            border-top: 1px solid #e2e8f0;
            padding: 8px;
            background: white;
        }
        .chatbot-input-area input {
            flex: 1;
            padding: 8px;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            outline: none;
            font-size: 0.85rem;
        }
        .chatbot-input-area button {
            background: var(--accent-yellow, #ffc107);
            color: var(--primary-color, #0b1e36);
            border: none;
            padding: 0 12px;
            margin-left: 6px;
            border-radius: 8px;
            font-weight: 700;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);

    const chatbotHTML = `
        <button class="chatbot-fab" onclick="toggleChatbot()">💬</button>
        <div id="chatbot-window" class="chatbot-container">
            <div class="chatbot-header">
                <span>Asistente HySky</span>
                <button class="chatbot-close" onclick="toggleChatbot()">&times;</button>
            </div>
            <div id="chatbot-messages" class="chatbot-messages">
                <div class="chat-msg bot">¡Hola! ¿Cómo podemos ayudarte hoy con tus recargas o tarjetas a Cuba?</div>
            </div>
            <div class="chatbot-input-area">
                <input type="text" id="chat-input" placeholder="Escribe tu duda..." onkeypress="handleChatKeyPress(event)">
                <button onclick="sendChatMessage()">Enviar</button>
            </div>
        </div>
    `;
    const div = document.createElement('div');
    div.innerHTML = chatbotHTML;
    document.body.appendChild(div);
})();

function toggleChatbot() {
    const win = document.getElementById('chatbot-window');
    win.style.display = win.style.display === 'flex' ? 'none' : 'flex';
}

function handleChatKeyPress(e) {
    if (e.key === 'Enter') sendChatMessage();
}

async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;

    const messagesContainer = document.getElementById('chatbot-messages');
    messagesContainer.innerHTML += `<div class="chat-msg user">${msg}</div>`;
    input.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
        const response = await fetch('/.netlify/functions/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg })
        });
        const data = await response.json();
        
        messagesContainer.innerHTML += `<div class="chat-msg bot">${data.reply || 'Entendido, ¿en qué más te puedo ayudar?'}</div>`;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } catch (err) {
        messagesContainer.innerHTML += `<div class="chat-msg bot">Lo siento, hubo un problema de conexión momentáneo.</div>`;
    }
}

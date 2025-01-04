async function sendMessage() {
    const chatBox = document.getElementById('chatBox');
    const userInput = document.getElementById('userInput');
    const userMessage = userInput.value.trim();

    if (!userMessage) return;

    chatBox.innerHTML += `<p><strong>You:</strong> ${userMessage}</p>`;
    userInput.value = '';

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }),
        });

        const data = await response.json();

        if (data.botMessage) {
            chatBox.innerHTML += `<p><strong>Bot:</strong> ${data.botMessage}</p>`;
        } else {
            chatBox.innerHTML += `<p><strong>Bot:</strong> Sorry, something went wrong.</p>`;
        }

        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
        console.error('Error:', error);
        chatBox.innerHTML += `<p><strong>Bot:</strong> Sorry, I couldn't connect to the server.</p>`;
    }
}

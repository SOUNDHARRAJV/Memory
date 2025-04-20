const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');

// Replace with your OpenAI API key
const OPENAI_API_KEY = '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';

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage('user', message);
  userInput.value = '';

  // Send to OpenAI
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }]
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content.trim();
    addMessage('bot', reply);
  } catch (error) {
    addMessage('bot', 'Error talking to AI.');
    console.error(error);
  }
}

function addMessage(sender, text) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', sender);
  messageDiv.textContent = text;
  chatbox.appendChild(messageDiv);
  chatbox.scrollTop = chatbox.scrollHeight;
}

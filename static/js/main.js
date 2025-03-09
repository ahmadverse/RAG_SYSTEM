document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    const themeToggle = document.getElementById('theme-toggle');
    const loadingSpinner = document.getElementById('loading-spinner');

    // Theme handling
    const toggleTheme = () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('darkMode', isDarkMode);
    };

    // Load saved theme preference
    if (localStorage.getItem('darkMode') === 'true') {
        toggleTheme();
    }

    themeToggle.addEventListener('click', toggleTheme);

    // Chat functionality
    const appendMessage = (message, isUser = false) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'} animate-message`;
        
        messageDiv.innerHTML = `
            <div class="message-content ${isUser ? 'ms-auto' : ''}">
                <div class="message-text">
                    ${message}
                </div>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = userInput.value.trim();
        
        if (!message) return;

        // Append user message
        appendMessage(message, true);
        userInput.value = '';

        // Show loading spinner
        loadingSpinner.classList.add('active');

        try {
            const response = await fetch('/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: message }),
            });

            const data = await response.json();

            if (response.ok) {
                // Append bot response
                appendMessage(data.answer);
            } else {
                appendMessage('Sorry, I encountered an error. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            appendMessage('Sorry, I encountered an error. Please try again.');
        } finally {
            loadingSpinner.classList.remove('active');
        }
    });

    // Handle Enter key press
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatForm.dispatchEvent(new Event('submit'));
        }
    });

    // Mobile sidebar toggle
    const toggleSidebar = () => {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('active');
    };

    // Add mobile menu button if not exists
    if (window.innerWidth <= 768) {
        const menuButton = document.createElement('button');
        menuButton.className = 'btn btn-outline-light mobile-menu-btn position-fixed';
        menuButton.style.cssText = 'top: 1rem; right: 1rem; z-index: 1001;';
        menuButton.innerHTML = '<i class="fas fa-bars"></i>';
        menuButton.addEventListener('click', toggleSidebar);
        document.body.appendChild(menuButton);
    }
}); 
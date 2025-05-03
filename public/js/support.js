document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => {
        new bootstrap.Tooltip(tooltip);
    });

    // Knowledge Base Search
    const searchInput = document.querySelector('.kb-search input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const articles = document.querySelectorAll('.kb-article');

            articles.forEach(article => {
                const text = article.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    article.style.display = '';
                } else {
                    article.style.display = 'none';
                }
            });
        });
    }

    // Ticket Form Submission
    const ticketForm = document.getElementById('ticketForm');
    if (ticketForm) {
        ticketForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            try {
                // Show loading state
                Swal.fire({
                    title: 'Creating Ticket',
                    html: 'Please wait...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Success message
                Swal.fire({
                    icon: 'success',
                    title: 'Ticket Created',
                    text: 'Your support ticket has been created successfully.',
                    confirmButtonColor: '#2b6cb0'
                }).then(() => {
                    // Close modal and reset form
                    const modal = bootstrap.Modal.getInstance(document.getElementById('newTicketModal'));
                    modal.hide();
                    ticketForm.reset();
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to create ticket. Please try again.',
                    confirmButtonColor: '#2b6cb0'
                });
            }
        });
    }

    // Live Chat Widget
    const chatWidget = document.getElementById('chatWidget');
    const startChat = document.getElementById('startChat');
    const minimizeChat = document.getElementById('minimizeChat');
    const closeChat = document.getElementById('closeChat');
    const chatInput = document.querySelector('.chat-input input');
    const chatSend = document.querySelector('.chat-input .btn');
    const chatMessages = document.getElementById('chatMessages');

    if (startChat && chatWidget) {
        startChat.addEventListener('click', () => {
            chatWidget.classList.add('show');
            // Add initial message
            addMessage('Hello! How can we help you today?', 'received');
        });
    }

    if (minimizeChat) {
        minimizeChat.addEventListener('click', () => {
            chatWidget.classList.toggle('minimized');
        });
    }

    if (closeChat) {
        closeChat.addEventListener('click', () => {
            chatWidget.classList.remove('show');
            // Clear chat messages
            chatMessages.innerHTML = '';
        });
    }

    // Send Message
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'sent');
        chatInput.value = '';

        // Simulate response
        setTimeout(() => {
            simulateResponse();
        }, 1000);
    }

    if (chatInput && chatSend) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        chatSend.addEventListener('click', sendMessage);
    }

    // Add Message to Chat
    function addMessage(text, type) {
        const messageHTML = `
            <div class="chat-message ${type}">
                <div class="message-bubble">
                    <p class="mb-0">${escapeHtml(text)}</p>
                </div>
            </div>
        `;

        chatMessages.insertAdjacentHTML('beforeend', messageHTML);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Simulate Chat Response
    function simulateResponse() {
        const responses = [
            "I understand. Let me help you with that.",
            "Could you provide more details about your issue?",
            "I'm checking our knowledge base for relevant information.",
            "Have you tried the solutions in our documentation?",
            "Let me connect you with a specialist who can better assist you."
        ];

        const response = responses[Math.floor(Math.random() * responses.length)];
        addMessage(response, 'received');
    }

    // Utility Functions
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
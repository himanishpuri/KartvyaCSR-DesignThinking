document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => {
        new bootstrap.Tooltip(tooltip);
    });

    // Message Input Handler
    const messageInput = document.querySelector('.chat-input input');
    const sendButton = document.querySelector('.chat-input .btn-primary');

    if (messageInput && sendButton) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        sendButton.addEventListener('click', sendMessage);
    }

    // File Attachment Handler
    const attachButton = document.querySelector('.chat-input .btn-link');
    if (attachButton) {
        attachButton.addEventListener('click', () => {
            // Create hidden file input
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.multiple = true;
            fileInput.accept = '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png';
            
            fileInput.addEventListener('change', handleFileAttachment);
            fileInput.click();
        });
    }

    // Contact Search
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const contacts = document.querySelectorAll('.contact-item');

            contacts.forEach(contact => {
                const name = contact.querySelector('h6').textContent.toLowerCase();
                const lastMessage = contact.querySelector('p').textContent.toLowerCase();
                
                if (name.includes(searchTerm) || lastMessage.includes(searchTerm)) {
                    contact.style.display = '';
                } else {
                    contact.style.display = 'none';
                }
            });
        });
    }

    // Info Sidebar Toggle
    const infoToggle = document.querySelector('.chat-actions .btn-icon:last-child');
    const infoSidebar = document.querySelector('.info-sidebar');
    const closeInfo = document.querySelector('.close-info');

    if (infoToggle && infoSidebar && closeInfo) {
        infoToggle.addEventListener('click', () => {
            infoSidebar.classList.toggle('show');
        });

        closeInfo.addEventListener('click', () => {
            infoSidebar.classList.remove('show');
        });
    }

    // Mobile Contact List Toggle
    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'btn btn-icon d-md-none';
    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('.chat-header').prepend(mobileToggle);

    const contactsSidebar = document.querySelector('.contacts-sidebar');

    mobileToggle.addEventListener('click', () => {
        contactsSidebar.classList.toggle('show');
    });

    // Send Message Function
    function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;

        // Create message element
        const messageHTML = `
            <div class="message sent">
                <div class="message-content">
                    <div class="message-bubble">
                        <p>${escapeHtml(message)}</p>
                    </div>
                    <div class="message-meta">
                        <span class="time">${formatTime(new Date())}</span>
                        <i class="fas fa-check"></i>
                    </div>
                </div>
            </div>
        `;

        // Add message to chat
        const chatMessages = document.querySelector('.chat-messages');
        chatMessages.insertAdjacentHTML('beforeend', messageHTML);

        // Clear input
        messageInput.value = '';

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Simulate received message
        setTimeout(() => {
            simulateResponse();
        }, 1000);
    }

    // Handle File Attachment
    function handleFileAttachment(e) {
        const files = Array.from(e.target.files);
        
        files.forEach(file => {
            // Create file message element
            const fileHTML = `
                <div class="message sent">
                    <div class="message-content">
                        <div class="message-bubble file-message">
                            <i class="${getFileIcon(file.type)}"></i>
                            <div class="file-info">
                                <h6>${escapeHtml(file.name)}</h6>
                                <small>${formatFileSize(file.size)} • ${file.type.split('/')[1].toUpperCase()}</small>
                            </div>
                        </div>
                        <div class="message-meta">
                            <span class="time">${formatTime(new Date())}</span>
                            <i class="fas fa-check"></i>
                        </div>
                    </div>
                </div>
            `;

            // Add file message to chat
            const chatMessages = document.querySelector('.chat-messages');
            chatMessages.insertAdjacentHTML('beforeend', fileHTML);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });
    }

    // Utility Functions
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function formatTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function getFileIcon(type) {
        if (type.includes('pdf')) return 'fas fa-file-pdf';
        if (type.includes('word') || type.includes('doc')) return 'fas fa-file-word';
        if (type.includes('sheet') || type.includes('excel')) return 'fas fa-file-excel';
        if (type.includes('image')) return 'fas fa-file-image';
        return 'fas fa-file';
    }

    // Simulate Response
    function simulateResponse() {
        const responses = [
            "I'll look into this and get back to you soon.",
            "Thanks for the update! Let me review this.",
            "Could you provide more details about this?",
            "I've forwarded this to the team.",
            "Let's schedule a call to discuss this further."
        ];

        const response = responses[Math.floor(Math.random() * responses.length)];
        const responseHTML = `
            <div class="message received">
                <div class="message-avatar">
                    <img src="../../../assets/images/avatars/corporate1.jpg" alt="Tata Group">
                </div>
                <div class="message-content">
                    <div class="message-bubble">
                        <p>${response}</p>
                    </div>
                    <div class="message-meta">
                        <span class="time">${formatTime(new Date())}</span>
                    </div>
                </div>
            </div>
        `;

        const chatMessages = document.querySelector('.chat-messages');
        chatMessages.insertAdjacentHTML('beforeend', responseHTML);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
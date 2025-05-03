document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => {
        new bootstrap.Tooltip(tooltip);
    });

    // Notification Filters
    const filterButtons = document.querySelectorAll('.filter-btn');
    const notificationItems = document.querySelectorAll('.notification-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter notifications
            const filter = button.dataset.filter;
            notificationItems.forEach(item => {
                if (filter === 'all') {
                    item.style.display = '';
                } else if (filter === 'unread' && item.classList.contains('unread')) {
                    item.style.display = '';
                } else if (filter === 'important' && item.classList.contains('important')) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Mark as Read
    const markReadButtons = document.querySelectorAll('.notification-actions .btn-icon:first-child');
    markReadButtons.forEach(button => {
        button.addEventListener('click', () => {
            const notificationItem = button.closest('.notification-item');
            notificationItem.classList.remove('unread');
            updateNotificationCount();
        });
    });

    // Mark All as Read
    const markAllReadButton = document.getElementById('markAllRead');
    if (markAllReadButton) {
        markAllReadButton.addEventListener('click', () => {
            notificationItems.forEach(item => {
                item.classList.remove('unread');
            });
            updateNotificationCount();
        });
    }

    // Delete Notification
    const deleteButtons = document.querySelectorAll('.notification-actions .btn-icon:last-child');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const notificationItem = button.closest('.notification-item');
            notificationItem.remove();
            updateNotificationCount();
        });
    });

    // Update Notification Count
    function updateNotificationCount() {
        const unreadCount = document.querySelectorAll('.notification-item.unread').length;
        const badge = document.querySelector('.notification-badge');
        
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? '' : 'none';
        }
    }

    // Notification Settings Form
    const notificationPreferences = document.getElementById('notificationPreferences');
    if (notificationPreferences) {
        notificationPreferences.addEventListener('submit', async (e) => {
            e.preventDefault();

            try {
                // Show loading state
                Swal.fire({
                    title: 'Saving Preferences',
                    html: 'Please wait...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Success message
                Swal.fire({
                    icon: 'success',
                    title: 'Preferences Saved',
                    text: 'Your notification preferences have been updated.',
                    confirmButtonColor: '#2b6cb0'
                }).then(() => {
                    // Close modal
                    const modal = bootstrap.Modal.getInstance(document.getElementById('notificationSettings'));
                    modal.hide();
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to save preferences. Please try again.',
                    confirmButtonColor: '#2b6cb0'
                });
            }
        });
    }

    // Push Notification Permission
    async function requestNotificationPermission() {
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                // Enable push notification toggles
                document.querySelectorAll('[id^="push"]').forEach(toggle => {
                    toggle.disabled = false;
                });
            } else {
                // Disable push notification toggles
                document.querySelectorAll('[id^="push"]').forEach(toggle => {
                    toggle.disabled = true;
                    toggle.checked = false;
                });
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
        }
    }

    // Check notification permission on load
    if ('Notification' in window) {
        if (Notification.permission === 'default') {
            requestNotificationPermission();
        } else if (Notification.permission === 'denied') {
            document.querySelectorAll('[id^="push"]').forEach(toggle => {
                toggle.disabled = true;
                toggle.checked = false;
            });
        }
    }

    // Show Demo Notification
    function showDemoNotification() {
        const notification = new Notification('New Project Update', {
            body: 'Rural Education Initiative phase 1 has been completed.',
            icon: '../../../assets/images/logo.png'
        });

        notification.onclick = () => {
            window.focus();
            notification.close();
        };
    }

    // Initialize real-time notifications (WebSocket simulation)
    function initializeRealTimeNotifications() {
        setInterval(() => {
            const shouldNotify = Math.random() > 0.8; // 20% chance of notification
            if (shouldNotify) {
                const notifications = [
                    {
                        title: 'New Message',
                        message: 'You have received a new message from Tata Group.',
                        icon: 'fas fa-envelope',
                        type: 'success'
                    },
                    {
                        title: 'Project Update',
                        message: 'Healthcare Outreach project status has been updated.',
                        icon: 'fas fa-project-diagram',
                        type: 'primary'
                    },
                    {
                        title: 'Document Shared',
                        message: 'A new document has been shared with you.',
                        icon: 'fas fa-file-alt',
                        type: 'warning'
                    }
                ];

                const notification = notifications[Math.floor(Math.random() * notifications.length)];
                showNotification(notification);
            }
        }, 30000); // Check every 30 seconds
    }

    // Show Notification
    function showNotification(notification) {
        // Create notification element
        const notificationHTML = `
            <div class="notification-item unread">
                <div class="notification-icon bg-${notification.type}-light">
                    <i class="${notification.icon} text-${notification.type}"></i>
                </div>
                <div class="notification-content">
                    <p class="notification-text">
                        <strong>${notification.title}:</strong> ${notification.message}
                    </p>
                    <span class="notification-time">Just now</span>
                </div>
                <div class="notification-actions">
                    <button class="btn btn-icon" data-bs-toggle="tooltip" title="Mark as read">
                        <i class="fas fa-circle"></i>
                    </button>
                    <button class="btn btn-icon" data-bs-toggle="tooltip" title="Delete">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;

        // Add to notification list
        const notificationList = document.querySelector('.notification-list');
        notificationList.insertAdjacentHTML('afterbegin', notificationHTML);

        // Update count
        updateNotificationCount();

        // Show push notification if enabled
        if (Notification.permission === 'granted' && document.getElementById('pushProject').checked) {
            new Notification(notification.title, {
                body: notification.message,
                icon: '../../../assets/images/logo.png'
            });
        }
    }

    // Initialize real-time notifications
    initializeRealTimeNotifications();
});
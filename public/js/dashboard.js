document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => {
        new bootstrap.Tooltip(tooltip);
    });

    // Sidebar Toggle for Mobile
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            document.body.classList.toggle('sidebar-show');
        });
    }

    // Notification Badge Update
    function updateNotificationBadge() {
        const badge = document.querySelector('.notifications .badge');
        const count = parseInt(badge.textContent);
        if (count > 0) {
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    }

    // Task Completion Handler
    document.querySelectorAll('.task-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const taskItem = this.closest('.task-item');
            if (this.checked) {
                taskItem.style.opacity = '0.5';
                taskItem.style.textDecoration = 'line-through';
            } else {
                taskItem.style.opacity = '1';
                taskItem.style.textDecoration = 'none';
            }
        });
    });

    // Logout Handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            Swal.fire({
                title: 'Logout Confirmation',
                text: 'Are you sure you want to logout?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, logout'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Perform logout
                    window.location.href = '../../../index.html';
                }
            });
        });
    }

    // Initialize Charts
    function initializeCharts() {
        // Project Status Chart
        const projectStatusCtx = document.getElementById('projectStatusChart');
        if (projectStatusCtx) {
            new Chart(projectStatusCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Active', 'Completed', 'Pending'],
                    datasets: [{
                        data: [12, 8, 3],
                        backgroundColor: [
                            '#38a169',
                            '#2b6cb0',
                            '#d69e2e'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        // Funding Overview Chart
        const fundingCtx = document.getElementById('fundingOverviewChart');
        if (fundingCtx) {
            new Chart(fundingCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Funds Received',
                        data: [30, 45, 35, 50, 40, 60],
                        borderColor: '#2b6cb0',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }

    // Initialize charts if they exist
    initializeCharts();

    // Search Functionality
    const searchInput = document.querySelector('.header-search input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            // Implement search functionality based on your needs
        });
    }

    // Notification Click Handler
    document.querySelectorAll('.notification-item').forEach(item => {
        item.addEventListener('click', function() {
            const notificationId = this.dataset.id;
            // Mark notification as read
            this.classList.add('read');
            updateNotificationBadge();
        });
    });

    // Project Progress Update
    function updateProjectProgress() {
        document.querySelectorAll('.project-progress').forEach(progress => {
            const percentage = progress.dataset.progress;
            const progressBar = progress.querySelector('.progress-bar');
            progressBar.style.width = percentage + '%';
            progressBar.setAttribute('aria-valuenow', percentage);
        });
    }

    // Initialize project progress
    updateProjectProgress();
});
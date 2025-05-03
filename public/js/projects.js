document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => {
        new bootstrap.Tooltip(tooltip);
    });

    // Project Filters
    const filters = {
        status: document.getElementById('statusFilter'),
        category: document.getElementById('categoryFilter'),
        budget: document.getElementById('budgetFilter'),
        date: document.getElementById('dateFilter')
    };

    // Apply filters
    Object.values(filters).forEach(filter => {
        if (filter) {
            filter.addEventListener('change', applyFilters);
        }
    });

    function applyFilters() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            let show = true;
            
            // Status filter
            if (filters.status.value) {
                const status = card.querySelector('.badge').textContent.toLowerCase();
                show = show && status === filters.status.value;
            }

            // Category filter
            if (filters.category.value) {
                const category = card.dataset.category;
                show = show && category === filters.category.value;
            }

            // Budget filter
            if (filters.budget.value) {
                const budget = parseInt(card.dataset.budget);
                const [min, max] = filters.budget.value.split('-').map(Number);
                show = show && budget >= min && (!max || budget <= max);
            }

            // Date filter
            if (filters.date.value) {
                const projectDate = new Date(card.dataset.startDate);
                const filterDate = new Date(filters.date.value);
                show = show && projectDate >= filterDate;
            }

            card.style.display = show ? 'block' : 'none';
        });
    }

    // New Project Form Handling
    const newProjectForm = document.getElementById('newProjectForm');
    if (newProjectForm) {
        newProjectForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            try {
                // Show loading state
                Swal.fire({
                    title: 'Creating Project',
                    html: 'Please wait...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Get the primary color from CSS
                const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');

                // Success message
                Swal.fire({
                    icon: 'success',
                    title: 'Project Created!',
                    text: 'Your project has been created successfully.',
                    confirmButtonColor: primaryColor
                }).then(() => {
                    // Close modal and reset form
                    const modal = bootstrap.Modal.getInstance(document.getElementById('newProjectModal'));
                    modal.hide();
                    newProjectForm.reset();
                    
                    // Refresh project list
                    location.reload();
                });
            } catch (error) {
                const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to create project. Please try again.',
                    confirmButtonColor: primaryColor
                });
            }
        });
    }

    // Project Card Actions
    document.querySelectorAll('.project-card .dropdown-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.textContent.toLowerCase();
            const projectId = this.closest('.project-card').dataset.id;

            switch(action) {
                case 'edit':
                    editProject(projectId);
                    break;
                case 'view details':
                    viewProjectDetails(projectId);
                    break;
                case 'delete':
                    deleteProject(projectId);
                    break;
            }
        });
    });

    // Project Actions
    function editProject(projectId) {
        // Implement edit functionality
    }

    function viewProjectDetails(projectId) {
        // Implement view details functionality
    }

    function deleteProject(projectId) {
        Swal.fire({
            title: 'Delete Project?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                // Implement delete functionality
                Swal.fire(
                    'Deleted!',
                    'The project has been deleted.',
                    'success'
                );
            }
        });
    }

    // Initialize project progress bars
    function updateProjectProgress() {
        document.querySelectorAll('.project-progress').forEach(progress => {
            const percentage = progress.dataset.progress;
            const progressBar = progress.querySelector('.progress-bar');
            progressBar.style.width = percentage + '%';
            progressBar.setAttribute('aria-valuenow', percentage);
        });
    }

    // Initialize
    updateProjectProgress();
});

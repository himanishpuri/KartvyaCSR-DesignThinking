document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => {
        new bootstrap.Tooltip(tooltip);
    });

    // Form Handlers
    const addDonorForm = document.getElementById('addDonorForm');
    if (addDonorForm) {
        addDonorForm.addEventListener('submit', handleAddDonor);
    }

    const newCampaignForm = document.getElementById('newCampaignForm');
    if (newCampaignForm) {
        newCampaignForm.addEventListener('submit', handleNewCampaign);
    }

    // Search and Filter Handlers
    const searchInput = document.querySelector('.donor-filters input[type="text"]');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    const filterSelects = document.querySelectorAll('.donor-filters select');
    filterSelects.forEach(select => {
        select.addEventListener('change', handleFilters);
    });

    // Export Button Handler
    const exportButton = document.querySelector('.donor-filters .btn-outline-primary');
    if (exportButton) {
        exportButton.addEventListener('click', handleExport);
    }

    // Action Button Handlers
    document.querySelectorAll('.btn-group').forEach(group => {
        const emailBtn = group.querySelector('.fa-envelope').closest('button');
        const editBtn = group.querySelector('.fa-edit').closest('button');
        const deleteBtn = group.querySelector('.fa-trash').closest('button');

        emailBtn.addEventListener('click', () => handleEmail(emailBtn.closest('tr')));
        editBtn.addEventListener('click', () => handleEdit(editBtn.closest('tr')));
        deleteBtn.addEventListener('click', () => handleDelete(deleteBtn.closest('tr')));
    });

    // Handle Add Donor
    async function handleAddDonor(e) {
        e.preventDefault();

        try {
            // Show loading state
            Swal.fire({
                title: 'Adding Donor',
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
                title: 'Donor Added',
                text: 'New donor has been added successfully.',
                confirmButtonColor: '#2b6cb0'
            }).then(() => {
                // Close modal and reset form
                const modal = bootstrap.Modal.getInstance(document.getElementById('addDonorModal'));
                modal.hide();
                e.target.reset();

                // Refresh donor list
                refreshDonorList();
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add donor. Please try again.',
                confirmButtonColor: '#2b6cb0'
            });
        }
    }

    // Handle New Campaign
    async function handleNewCampaign(e) {
        e.preventDefault();

        try {
            // Show loading state
            Swal.fire({
                title: 'Creating Campaign',
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
                title: 'Campaign Created',
                text: 'New campaign has been created successfully.',
                confirmButtonColor: '#2b6cb0'
            }).then(() => {
                // Close modal and reset form
                const modal = bootstrap.Modal.getInstance(document.getElementById('newCampaignModal'));
                modal.hide();
                e.target.reset();

                // Refresh campaign list
                refreshCampaignList();
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to create campaign. Please try again.',
                confirmButtonColor: '#2b6cb0'
            });
        }
    }

    // Handle Search
    function handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('tbody tr');

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    }

    // Handle Filters
    function handleFilters() {
        const type = document.querySelector('select:nth-child(1)').value;
        const status = document.querySelector('select:nth-child(2)').value;
        const level = document.querySelector('select:nth-child(3)').value;
        const rows = document.querySelectorAll('tbody tr');

        rows.forEach(row => {
            const rowType = row.children[1].textContent;
            const rowStatus = row.querySelector('.status-badge').textContent;
            const rowLevel = getDonorLevel(row);

            const typeMatch = !type || rowType === type;
            const statusMatch = !status || rowStatus === status;
            const levelMatch = !level || rowLevel === level;

            row.style.display = typeMatch && statusMatch && levelMatch ? '' : 'none';
        });
    }

    // Handle Export
    function handleExport() {
        Swal.fire({
            title: 'Export Donor Data',
            html: `
                <div class="mb-3">
                    <label class="form-label">Export Format</label>
                    <select class="form-select" id="exportFormat">
                        <option value="excel">Excel</option>
                        <option value="csv">CSV</option>
                        <option value="pdf">PDF</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Date Range</label>
                    <select class="form-select" id="exportRange">
                        <option value="all">All Time</option>
                        <option value="year">Last Year</option>
                        <option value="quarter">Last Quarter</option>
                        <option value="month">Last Month</option>
                    </select>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Export',
            confirmButtonColor: '#2b6cb0',
            cancelButtonColor: '#718096',
            preConfirm: () => {
                return {
                    format: document.getElementById('exportFormat').value,
                    range: document.getElementById('exportRange').value
                };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Simulate export
                Swal.fire({
                    icon: 'success',
                    title: 'Export Complete',
                    text: 'The donor data has been exported successfully.',
                    confirmButtonColor: '#2b6cb0'
                });
            }
        });
    }

    // Handle Email
    function handleEmail(row) {
        const donorName = row.querySelector('h6').textContent;
        const donorEmail = row.querySelector('small').textContent;

        Swal.fire({
            title: 'Send Email',
            html: `
                <div class="mb-3">
                    <label class="form-label">To</label>
                    <input type="text" class="form-control" value="${donorName} <${donorEmail}>" readonly>
                </div>
                <div class="mb-3">
                    <label class="form-label">Template</label>
                    <select class="form-select" id="emailTemplate">
                        <option value="">Select Template</option>
                        <option>Thank You Note</option>
                        <option>Campaign Update</option>
                        <option>Newsletter</option>
                        <option>Custom Message</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Message</label>
                    <textarea class="form-control" rows="5"></textarea>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Send',
            confirmButtonColor: '#2b6cb0',
            cancelButtonColor: '#718096'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: 'success',
                    title: 'Email Sent',
                    text: 'The email has been sent successfully.',
                    confirmButtonColor: '#2b6cb0'
                });
            }
        });
    }

    // Handle Edit
    function handleEdit(row) {
        const donorName = row.querySelector('h6').textContent;
        const donorEmail = row.querySelector('small').textContent;
        const donorType = row.children[1].textContent;
        const donorStatus = row.querySelector('.status-badge').textContent;

        // Show edit modal with pre-filled data
        const modal = new bootstrap.Modal(document.getElementById('addDonorModal'));
        modal.show();

        // Pre-fill form fields
        const form = document.getElementById('addDonorForm');
        const [firstName, lastName] = donorName.split(' ');
        form.querySelector('input[type="text"]').value = firstName;
        form.querySelectorAll('input[type="text"]')[1].value = lastName;
        form.querySelector('input[type="email"]').value = donorEmail;
        form.querySelector('select').value = donorType;
    }

    // Handle Delete
    function handleDelete(row) {
        const donorName = row.querySelector('h6').textContent;

        Swal.fire({
            title: 'Delete Donor',
            text: `Are you sure you want to delete ${donorName}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            confirmButtonColor: '#e53e3e',
            cancelButtonColor: '#718096'
        }).then((result) => {
            if (result.isConfirmed) {
                // Simulate deletion
                row.remove();
                
                Swal.fire({
                    icon: 'success',
                    title: 'Donor Deleted',
                    text: 'The donor has been deleted successfully.',
                    confirmButtonColor: '#2b6cb0'
                });
            }
        });
    }

    // Utility Functions
    function getDonorLevel(row) {
        const totalDonation = parseFloat(row.children[3].textContent.replace('₹', '').replace(',', ''));
        if (totalDonation >= 100000) return 'Major';
        if (totalDonation >= 50000) return 'Mid-level';
        return 'Regular';
    }

    function refreshDonorList() {
        // This would typically involve an API call to get the updated donor list
        console.log('Refreshing donor list...');
    }

    function refreshCampaignList() {
        // This would typically involve an API call to get the updated campaign list
        console.log('Refreshing campaign list...');
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => {
        new bootstrap.Tooltip(tooltip);
    });

    // Initialize Resource Charts
    initializeResourceCharts();

    // Form Handlers
    const addInventoryForm = document.getElementById('addInventoryForm');
    if (addInventoryForm) {
        addInventoryForm.addEventListener('submit', handleAddInventory);
    }

    const allocateResourcesForm = document.getElementById('allocateResourcesForm');
    if (allocateResourcesForm) {
        allocateResourcesForm.addEventListener('submit', handleResourceAllocation);
    }

    // Export Button Handler
    const exportButton = document.getElementById('exportInventory');
    if (exportButton) {
        exportButton.addEventListener('click', handleExport);
    }

    // Search and Filter Handlers
    const searchInput = document.querySelector('.resource-filters input[type="text"]');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    const filterSelects = document.querySelectorAll('.resource-filters select');
    filterSelects.forEach(select => {
        select.addEventListener('change', handleFilters);
    });

    // Initialize Resource Charts
    function initializeResourceCharts() {
        // Fund Allocation Chart
        const fundCtx = document.getElementById('fundAllocationChart');
        if (fundCtx) {
            new Chart(fundCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Projects', 'Operations', 'Emergency Fund', 'Administrative'],
                    datasets: [{
                        data: [40, 30, 20, 10],
                        backgroundColor: [
                            '#2b6cb0',
                            '#38a169',
                            '#c05621',
                            '#718096'
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

        // Inventory Trends Chart
        const inventoryCtx = document.getElementById('inventoryTrendsChart');
        if (inventoryCtx) {
            new Chart(inventoryCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Medical Supplies',
                        data: [1200, 1350, 1250, 1420, 1550, 1690],
                        borderColor: '#2b6cb0',
                        tension: 0.4
                    }, {
                        label: 'Food & Nutrition',
                        data: [850, 920, 890, 940, 1020, 980],
                        borderColor: '#38a169',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
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

    // Handle Add Inventory
    async function handleAddInventory(e) {
        e.preventDefault();

        try {
            // Show loading state
            Swal.fire({
                title: 'Adding Inventory',
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
                title: 'Inventory Added',
                text: 'The item has been added to inventory successfully.',
                confirmButtonColor: '#2b6cb0'
            }).then(() => {
                // Close modal and reset form
                const modal = bootstrap.Modal.getInstance(document.getElementById('addInventoryModal'));
                modal.hide();
                e.target.reset();

                // Refresh inventory list
                refreshInventoryList();
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add inventory item. Please try again.',
                confirmButtonColor: '#2b6cb0'
            });
        }
    }

    // Handle Resource Allocation
    async function handleResourceAllocation(e) {
        e.preventDefault();

        try {
            // Show loading state
            Swal.fire({
                title: 'Allocating Resources',
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
                title: 'Resources Allocated',
                text: 'Resources have been allocated successfully.',
                confirmButtonColor: '#2b6cb0'
            }).then(() => {
                // Close modal and reset form
                const modal = bootstrap.Modal.getInstance(document.getElementById('allocateResourcesModal'));
                modal.hide();
                e.target.reset();

                // Refresh resource allocation
                refreshResourceAllocation();
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to allocate resources. Please try again.',
                confirmButtonColor: '#2b6cb0'
            });
        }
    }

    // Handle Export
    function handleExport() {
        Swal.fire({
            title: 'Export Inventory',
            html: `
                <div class="mb-3">
                    <label class="form-label">Export Format</label>
                    <select class="form-select" id="exportFormat">
                        <option value="excel">Excel</option>
                        <option value="csv">CSV</option>
                        <option value="pdf">PDF</option>
                    </select>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Export',
            confirmButtonColor: '#2b6cb0',
            cancelButtonColor: '#718096',
            preConfirm: () => {
                return {
                    format: document.getElementById('exportFormat').value
                };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Simulate export
                Swal.fire({
                    icon: 'success',
                    title: 'Export Complete',
                    text: 'The inventory report has been exported successfully.',
                    confirmButtonColor: '#2b6cb0'
                });
            }
        });
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
        const category = document.querySelector('select:nth-child(1)').value;
        const location = document.querySelector('select:nth-child(2)').value;
        const rows = document.querySelectorAll('tbody tr');

        rows.forEach(row => {
            const rowCategory = row.children[1].textContent;
            const rowLocation = row.children[3].textContent;
            const categoryMatch = !category || rowCategory === category;
            const locationMatch = !location || rowLocation === location;

            row.style.display = categoryMatch && locationMatch ? '' : 'none';
        });
    }

    // Utility Functions
    function refreshInventoryList() {
        // This would typically involve an API call to get the updated inventory list
        console.log('Refreshing inventory list...');
    }

    function refreshResourceAllocation() {
        // This would typically involve an API call to get the updated resource allocation
        console.log('Refreshing resource allocation...');
    }
});
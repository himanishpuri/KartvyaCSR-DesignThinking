document.addEventListener('DOMContentLoaded', function() {
    // Initialize Charts
    initializeCharts();

    // Report Generation Form
    const reportForm = document.getElementById('reportForm');
    if (reportForm) {
        reportForm.addEventListener('submit', handleReportGeneration);
    }

    // Export Report Button
    const exportBtn = document.getElementById('exportReportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', handleReportExport);
    }

    // Initialize Charts
    function initializeCharts() {
        // Project Performance Chart
        const projectCtx = document.getElementById('projectPerformanceChart');
        if (projectCtx) {
            new Chart(projectCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Funds Utilized',
                        data: [30, 45, 35, 50, 40, 60],
                        borderColor: '#2b6cb0',
                        tension: 0.4,
                        fill: false
                    }, {
                        label: 'Beneficiaries Reached',
                        data: [25, 35, 45, 40, 50, 55],
                        borderColor: '#38a169',
                        tension: 0.4,
                        fill: false
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
                            beginAtZero: true,
                            grid: {
                                borderDash: [2, 4]
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }

        // Impact Metrics Chart
        const impactCtx = document.getElementById('impactMetricsChart');
        if (impactCtx) {
            new Chart(impactCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Education', 'Healthcare', 'Livelihood', 'Environment'],
                    datasets: [{
                        data: [40, 25, 20, 15],
                        backgroundColor: [
                            '#2b6cb0',
                            '#38a169',
                            '#d69e2e',
                            '#4299e1'
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
    }

    // Handle Report Generation
    async function handleReportGeneration(e) {
        e.preventDefault();

        try {
            // Show loading state
            Swal.fire({
                title: 'Generating Report',
                html: 'Please wait while we generate your report...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // Simulate report generation delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Success message
            Swal.fire({
                icon: 'success',
                title: 'Report Generated!',
                text: 'Your report has been generated successfully.',
                confirmButtonColor: '#2b6cb0'
            }).then(() => {
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('generateReportModal'));
                modal.hide();
                
                // Reset form
                e.target.reset();
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to generate report. Please try again.',
                confirmButtonColor: '#2b6cb0'
            });
        }
    }

    // Handle Report Export
    function handleReportExport() {
        Swal.fire({
            title: 'Export Report',
            html: `
                <div class="mb-3">
                    <label class="form-label">Export Format</label>
                    <select class="form-select" id="exportFormat">
                        <option value="pdf">PDF</option>
                        <option value="excel">Excel</option>
                        <option value="csv">CSV</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Time Period</label>
                    <select class="form-select" id="exportPeriod">
                        <option value="current">Current Month</option>
                        <option value="last3">Last 3 Months</option>
                        <option value="last6">Last 6 Months</option>
                        <option value="custom">Custom Range</option>
                    </select>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Export',
            confirmButtonColor: '#2b6cb0',
            cancelButtonColor: '#718096'
        }).then((result) => {
            if (result.isConfirmed) {
                // Show loading state
                Swal.fire({
                    title: 'Exporting Report',
                    html: 'Please wait while we prepare your export...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                // Simulate export delay
                setTimeout(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Export Complete',
                        text: 'Your report has been exported successfully.',
                        confirmButtonColor: '#2b6cb0'
                    });
                }, 2000);
            }
        });
    }

    // Update Charts Periodically
    function updateCharts() {
        // Simulate real-time data updates
        setInterval(() => {
            const charts = Chart.instances;
            charts.forEach(chart => {
                chart.data.datasets.forEach(dataset => {
                    dataset.data = dataset.data.map(value => 
                        Math.max(0, value + (Math.random() - 0.5) * 10)
                    );
                });
                chart.update('none');
            });
        }, 5000);
    }

    // Initialize real-time updates
    updateCharts();
});
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Charts
    initializeCharts();

    // Date Range Picker
    initializeDateRangePicker();

    // Export Form Handler
    const exportForm = document.getElementById('exportForm');
    if (exportForm) {
        exportForm.addEventListener('submit', handleExport);
    }

    // Initialize Charts
    function initializeCharts() {
        // Impact Overview Chart
        const impactCtx = document.getElementById('impactChart');
        if (impactCtx) {
            new Chart(impactCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [{
                        label: 'Beneficiaries Reached',
                        data: [800, 1200, 1100, 1500, 2100, 1800, 2300, 2400, 2800, 3100, 2900, 3200],
                        borderColor: '#2b6cb0',
                        backgroundColor: 'rgba(43, 108, 176, 0.1)',
                        tension: 0.4,
                        fill: true
                    }, {
                        label: 'Projects Completed',
                        data: [5, 7, 6, 8, 10, 9, 12, 11, 13, 15, 14, 16],
                        borderColor: '#38a169',
                        backgroundColor: 'rgba(56, 161, 105, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                borderDash: [2, 4]
                            }
                        }
                    }
                }
            });
        }

        // Project Distribution Chart
        const distributionCtx = document.getElementById('distributionChart');
        if (distributionCtx) {
            new Chart(distributionCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Education', 'Healthcare', 'Environment', 'Community Development'],
                    datasets: [{
                        data: [35, 25, 20, 20],
                        backgroundColor: [
                            '#2b6cb0',
                            '#38a169',
                            '#ecc94b',
                            '#ed64a6'
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

        // Geographic Reach Map
        const mapChart = document.getElementById('mapChart');
        if (mapChart) {
            const chart = echarts.init(mapChart);
            
            // India map data
            fetch('../../../assets/data/india.json')
                .then(response => response.json())
                .then(mapData => {
                    echarts.registerMap('india', mapData);
                    
                    const option = {
                        tooltip: {
                            trigger: 'item',
                            formatter: '{b}: {c} Projects'
                        },
                        visualMap: {
                            min: 0,
                            max: 10,
                            text: ['High', 'Low'],
                            realtime: false,
                            calculable: true,
                            inRange: {
                                color: ['#ebf8ff', '#2b6cb0']
                            }
                        },
                        series: [{
                            name: 'Projects',
                            type: 'map',
                            map: 'india',
                            label: {
                                show: true
                            },
                            data: [
                                {name: 'Maharashtra', value: 8},
                                {name: 'Karnataka', value: 6},
                                {name: 'Tamil Nadu', value: 5},
                                // Add more state data
                            ],
                            emphasis: {
                                label: {
                                    show: true
                                }
                            }
                        }]
                    };

                    chart.setOption(option);
                });

            // Handle window resize
            window.addEventListener('resize', () => {
                chart.resize();
            });
        }
    }

    // Initialize Date Range Picker
    function initializeDateRangePicker() {
        const dateRangeButtons = document.querySelectorAll('.date-range-picker .dropdown-item');
        const dateRangeText = document.querySelector('.date-range-picker .dropdown-toggle');
        const exportDateRange = document.getElementById('exportDateRange');

        dateRangeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const range = button.dataset.range;
                
                // Update active state
                dateRangeButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Update button text
                dateRangeText.innerHTML = `<i class="fas fa-calendar"></i> ${button.textContent}`;

                // Handle custom range
                if (range === 'custom') {
                    showCustomRangePicker();
                } else {
                    updateDateRange(range);
                }
            });
        });
    }

    // Show Custom Range Picker
    function showCustomRangePicker() {
        Swal.fire({
            title: 'Select Date Range',
            html: `
                <div class="mb-3">
                    <label class="form-label">Start Date</label>
                    <input type="date" id="startDate" class="form-control">
                </div>
                <div class="mb-3">
                    <label class="form-label">End Date</label>
                    <input type="date" id="endDate" class="form-control">
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Apply',
            confirmButtonColor: '#2b6cb0',
            cancelButtonColor: '#718096',
            preConfirm: () => {
                const startDate = document.getElementById('startDate').value;
                const endDate = document.getElementById('endDate').value;
                
                if (!startDate || !endDate) {
                    Swal.showValidationMessage('Please select both dates');
                }
                
                return { startDate, endDate };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const { startDate, endDate } = result.value;
                updateDateRange('custom', startDate, endDate);
            }
        });
    }

    // Update Date Range
    function updateDateRange(range, startDate, endDate) {
        // Update charts based on new date range
        // This would typically involve an API call to get new data
        console.log(`Updating charts for range: ${range}`);
        
        // Simulate loading state
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.opacity = '0.5';
        });

        // Simulate API call
        setTimeout(() => {
            cards.forEach(card => {
                card.style.opacity = '1';
            });
        }, 1000);
    }

    // Handle Export
    async function handleExport(e) {
        e.preventDefault();

        try {
            // Show loading state
            Swal.fire({
                title: 'Generating Report',
                html: 'Please wait...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // Simulate report generation
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Success message
            Swal.fire({
                icon: 'success',
                title: 'Report Generated',
                text: 'Your report has been generated and is ready for download.',
                confirmButtonColor: '#2b6cb0'
            }).then(() => {
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('exportReportModal'));
                modal.hide();
                
                // Trigger download
                const link = document.createElement('a');
                link.href = '#'; // Replace with actual report URL
                link.download = 'analytics_report.pdf';
                link.click();
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
});
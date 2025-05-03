document.addEventListener('DOMContentLoaded', function() {
    // Form Submissions
    const forms = {
        profile: document.getElementById('profileForm'),
        organization: document.getElementById('organizationForm'),
        password: document.getElementById('passwordForm'),
        notification: document.getElementById('notificationForm'),
        webhook: document.getElementById('webhookForm'),
        apiKey: document.getElementById('apiKeyForm')
    };

    // Handle all form submissions
    Object.entries(forms).forEach(([formName, form]) => {
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await handleFormSubmission(formName, form);
            });
        }
    });

    // Profile Picture Upload
    const avatarInput = document.getElementById('avatarInput');
    if (avatarInput) {
        avatarInput.addEventListener('change', handleAvatarUpload);
    }

    // Organization Logo Upload
    const logoInput = document.getElementById('logoInput');
    if (logoInput) {
        logoInput.addEventListener('change', handleLogoUpload);
    }

    // Two-Factor Authentication Toggle
    const tfaToggle = document.getElementById('tfaToggle');
    if (tfaToggle) {
        tfaToggle.addEventListener('change', handleTFAToggle);
    }

    // Handle Form Submissions
    async function handleFormSubmission(formName, form) {
        try {
            // Show loading state
            Swal.fire({
                title: 'Saving Changes',
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
                title: 'Changes Saved',
                text: 'Your changes have been saved successfully.',
                confirmButtonColor: '#2b6cb0'
            });

            // Additional actions based on form type
            switch(formName) {
                case 'password':
                    form.reset();
                    break;
                case 'apiKey':
                    handleApiKeyGeneration();
                    break;
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to save changes. Please try again.',
                confirmButtonColor: '#2b6cb0'
            });
        }
    }

    // Handle Avatar Upload
    async function handleAvatarUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid File',
                text: 'Please upload an image file.',
                confirmButtonColor: '#2b6cb0'
            });
            return;
        }

        try {
            // Show loading state
            Swal.fire({
                title: 'Uploading Image',
                html: 'Please wait...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // Simulate upload delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Update preview
            const reader = new FileReader();
            reader.onload = function(e) {
                document.querySelector('.profile-avatar img').src = e.target.result;
            };
            reader.readAsDataURL(file);

            Swal.fire({
                icon: 'success',
                title: 'Image Uploaded',
                text: 'Your profile picture has been updated.',
                confirmButtonColor: '#2b6cb0'
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Upload Failed',
                text: 'Failed to upload image. Please try again.',
                confirmButtonColor: '#2b6cb0'
            });
        }
    }

    // Handle Logo Upload
    async function handleLogoUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid File',
                text: 'Please upload an image file.',
                confirmButtonColor: '#2b6cb0'
            });
            return;
        }

        try {
            // Show loading state
            Swal.fire({
                title: 'Uploading Logo',
                html: 'Please wait...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // Simulate upload delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Update preview
            const reader = new FileReader();
            reader.onload = function(e) {
                document.querySelector('.org-logo img').src = e.target.result;
            };
            reader.readAsDataURL(file);

            Swal.fire({
                icon: 'success',
                title: 'Logo Uploaded',
                text: 'Your organization logo has been updated.',
                confirmButtonColor: '#2b6cb0'
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Upload Failed',
                text: 'Failed to upload logo. Please try again.',
                confirmButtonColor: '#2b6cb0'
            });
        }
    }

    // Handle 2FA Toggle
    async function handleTFAToggle(e) {
        const isEnabled = e.target.checked;

        if (isEnabled) {
            // Show QR code modal
            Swal.fire({
                title: 'Enable Two-Factor Authentication',
                html: `
                    <div class="text-center mb-4">
                        <img src="../../../assets/images/2fa-qr.png" alt="2FA QR Code" class="mb-3">
                        <p class="mb-2">Scan this QR code with your authenticator app</p>
                        <p class="text-muted">Or enter this code manually: ABCD EFGH IJKL</p>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Enter Verification Code</label>
                        <input type="text" class="form-control" id="tfaCode" placeholder="Enter 6-digit code">
                    </div>
                `,
                showCancelButton: true,
                confirmButtonText: 'Verify & Enable',
                confirmButtonColor: '#2b6cb0',
                cancelButtonColor: '#718096',
                preConfirm: () => {
                    const code = document.getElementById('tfaCode').value;
                    if (!code || code.length !== 6) {
                        Swal.showValidationMessage('Please enter a valid 6-digit code');
                    }
                    return code;
                }
            }).then((result) => {
                if (!result.isConfirmed) {
                    e.target.checked = false;
                }
            });
        } else {
            // Confirm 2FA disable
            const result = await Swal.fire({
                title: 'Disable Two-Factor Authentication?',
                text: 'This will make your account less secure.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, disable it',
                cancelButtonText: 'Cancel',
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#718096'
            });

            if (!result.isConfirmed) {
                e.target.checked = true;
            }
        }
    }

    // Handle API Key Generation
    function handleApiKeyGeneration() {
        const modal = bootstrap.Modal.getInstance(document.getElementById('generateApiKeyModal'));
        modal.hide();

        // Show the generated key
        Swal.fire({
            title: 'API Key Generated',
            html: `
                <p class="mb-2">Your new API key:</p>
                <div class="alert alert-success">
                    <code>sk_test_123456789abcdefghijklmnopqrstuvwxyz</code>
                </div>
                <p class="text-danger mb-0">Make sure to copy this key now. You won't be able to see it again!</p>
            `,
            confirmButtonColor: '#2b6cb0',
            confirmButtonText: 'I have copied the key'
        });
    }
});
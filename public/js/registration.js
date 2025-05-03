/**
 * NGO Registration Form Handling
 * Includes form navigation, validation, and submission
 */

document.addEventListener("DOMContentLoaded", function () {
	// Form navigation
	const form = document.getElementById("ngoRegistrationForm");
	const steps = document.querySelectorAll(".form-step");
	const progressSteps = document.querySelectorAll(".progress-step");
	const nextButtons = document.querySelectorAll(".next-step");
	const prevButtons = document.querySelectorAll(".prev-step");

	// Add event listeners to next buttons
	nextButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const currentStep = parseInt(
				button.closest(".form-step").dataset.step,
			);

			// Validate current step before proceeding
			if (validateStep(currentStep)) {
				moveToStep(currentStep + 1);
			}
		});
	});

	// Add event listeners to previous buttons
	prevButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const currentStep = parseInt(
				button.closest(".form-step").dataset.step,
			);
			moveToStep(currentStep - 1);
		});
	});

	// Form submission
	if (form) {
		form.addEventListener("submit", function (e) {
			e.preventDefault();

			// Validate final step
			if (validateStep(3)) {
				// Get form data
				const formData = new FormData(form);
				const userData = {};

				// Convert FormData to object
				for (let [key, value] of formData.entries()) {
					userData[key] = value;
				}

				// Add user type
				userData.type = "ngo";

				// Mock file handling (in a real app, would upload to server)
				userData.registrationCertUploaded = formData.get("registrationCert")
					? true
					: false;
				userData.cert80gUploaded = formData.get("80gCert") ? true : false;

				// Store in localStorage for demo purposes
				// In a real app, this would be a server API call
				saveUserToLocalStorage(userData);

				// Show success message and redirect
				Swal.fire({
					icon: "success",
					title: "Registration Successful",
					text: "Your NGO has been registered successfully. Please log in to continue.",
					confirmButtonColor: "#198754",
				}).then(() => {
					window.location.href = "./login.html";
				});
			}
		});
	}

	// Setup file upload areas
	setupFileUploads();

	// Password strength meter
	setupPasswordStrength();

	/**
	 * Move to a specific step in the form
	 * @param {number} stepNumber - The step number to move to
	 */
	function moveToStep(stepNumber) {
		// Hide all steps and remove active class
		steps.forEach((step) => {
			step.classList.remove("active");
		});

		// Remove active class from all progress steps
		progressSteps.forEach((step) => {
			step.classList.remove("active");
		});

		// Show the target step and update progress indicator
		const targetStep = document.querySelector(
			`.form-step[data-step="${stepNumber}"]`,
		);
		const targetProgressStep = document.querySelector(
			`.progress-step[data-step="${stepNumber}"]`,
		);

		if (targetStep && targetProgressStep) {
			targetStep.classList.add("active");
			targetProgressStep.classList.add("active");

			// Mark all previous steps as completed
			for (let i = 1; i < stepNumber; i++) {
				const prevProgressStep = document.querySelector(
					`.progress-step[data-step="${i}"]`,
				);
				if (prevProgressStep) {
					prevProgressStep.classList.add("completed");
				}
			}
		}
	}

	/**
	 * Validate form fields in the current step
	 * @param {number} stepNumber - The step number to validate
	 * @returns {boolean} - Whether the step is valid
	 */
	function validateStep(stepNumber) {
		const currentStep = document.querySelector(
			`.form-step[data-step="${stepNumber}"]`,
		);
		const requiredFields = currentStep.querySelectorAll("[required]");
		let isValid = true;

		requiredFields.forEach((field) => {
			// Check if field is empty
			if (!field.value) {
				markFieldAsInvalid(field, "This field is required");
				isValid = false;
			} else {
				markFieldAsValid(field);

				// Additional validation based on field type
				if (field.type === "email" && !validateEmail(field.value)) {
					markFieldAsInvalid(field, "Please enter a valid email address");
					isValid = false;
				} else if (field.name === "password" && field.value.length < 8) {
					markFieldAsInvalid(
						field,
						"Password must be at least 8 characters long",
					);
					isValid = false;
				} else if (field.name === "phone" && !validatePhone(field.value)) {
					markFieldAsInvalid(field, "Please enter a valid phone number");
					isValid = false;
				} else if (field.type === "checkbox" && !field.checked) {
					markFieldAsInvalid(field, "You must agree to the terms");
					isValid = false;
				}
			}
		});

		// Step 3: Check if file is selected for required file inputs
		if (stepNumber === 3) {
			const requiredFileInputs = currentStep.querySelectorAll(
				'input[type="file"][required]',
			);
			requiredFileInputs.forEach((fileInput) => {
				if (fileInput.files.length === 0) {
					markFieldAsInvalid(fileInput, "Please upload a file");
					isValid = false;
				} else {
					markFieldAsValid(fileInput);
				}
			});

			// Check terms and conditions
			const termsCheck = document.getElementById("termsCheck");
			if (termsCheck && !termsCheck.checked) {
				markFieldAsInvalid(
					termsCheck,
					"You must agree to the Terms & Conditions",
				);
				isValid = false;
			}
		}

		return isValid;
	}

	/**
	 * Set up file upload functionality
	 */
	function setupFileUploads() {
		const fileInputs = document.querySelectorAll(".file-input");
		const uploadAreas = document.querySelectorAll(".upload-area");

		uploadAreas.forEach((area) => {
			area.addEventListener("click", () => {
				const fileInput = area.querySelector(".file-input");
				if (fileInput) {
					fileInput.click();
				}
			});

			area.addEventListener("dragover", (e) => {
				e.preventDefault();
				area.classList.add("dragover");
			});

			area.addEventListener("dragleave", () => {
				area.classList.remove("dragover");
			});

			area.addEventListener("drop", (e) => {
				e.preventDefault();
				area.classList.remove("dragover");

				const fileInput = area.querySelector(".file-input");
				if (fileInput && e.dataTransfer.files.length > 0) {
					fileInput.files = e.dataTransfer.files;
					updateFileUploadLabel(fileInput);
				}
			});
		});

		fileInputs.forEach((input) => {
			input.addEventListener("change", () => {
				updateFileUploadLabel(input);
			});
		});
	}

	/**
	 * Update file upload area to show selected file name
	 * @param {HTMLElement} fileInput - The file input element
	 */
	function updateFileUploadLabel(fileInput) {
		const uploadArea = fileInput.closest(".upload-area");
		if (uploadArea && fileInput.files.length > 0) {
			const fileName = fileInput.files[0].name;
			const fileIcon = document.createElement("i");
			fileIcon.className = "fas fa-file";

			// Clear previous content and add file info
			uploadArea.innerHTML = "";
			uploadArea.appendChild(fileIcon);
			uploadArea.innerHTML += `<p>${fileName}</p>`;

			// Add a remove button
			const removeBtn = document.createElement("button");
			removeBtn.className = "btn btn-sm btn-danger mt-2";
			removeBtn.textContent = "Remove";
			removeBtn.type = "button";
			removeBtn.addEventListener("click", (e) => {
				e.stopPropagation();
				resetFileUpload(fileInput);
			});
			uploadArea.appendChild(removeBtn);

			markFieldAsValid(fileInput);
		}
	}

	/**
	 * Reset a file upload field
	 * @param {HTMLElement} fileInput - The file input element
	 */
	function resetFileUpload(fileInput) {
		fileInput.value = "";
		const uploadArea = fileInput.closest(".upload-area");
		if (uploadArea) {
			uploadArea.innerHTML = `
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Drag & Drop or Click to Upload</p>
            `;
			uploadArea.appendChild(fileInput);
		}
	}

	/**
	 * Setup password strength indicator
	 */
	function setupPasswordStrength() {
		const passwordInput = document.querySelector('input[name="password"]');
		const strengthMeter = document.querySelector(".password-strength");

		if (passwordInput && strengthMeter) {
			passwordInput.addEventListener("input", () => {
				const strength = calculatePasswordStrength(passwordInput.value);
				updateStrengthMeter(strengthMeter, strength);
			});
		}
	}

	/**
	 * Calculate password strength score
	 * @param {string} password - The password to evaluate
	 * @returns {number} - Strength score (0-4)
	 */
	function calculatePasswordStrength(password) {
		let strength = 0;

		if (password.length >= 8) strength++;
		if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
		if (password.match(/[0-9]/)) strength++;
		if (password.match(/[^a-zA-Z0-9]/)) strength++;

		return strength;
	}

	/**
	 * Update the password strength meter
	 * @param {HTMLElement} meter - The strength meter element
	 * @param {number} strength - The strength score (0-4)
	 */
	function updateStrengthMeter(meter, strength) {
		// Clear previous content
		meter.innerHTML = "";

		// Create strength bar
		const strengthBar = document.createElement("div");
		strengthBar.className = "strength-bar";
		meter.appendChild(strengthBar);

		// Create strength indicators
		for (let i = 0; i < 4; i++) {
			const indicator = document.createElement("div");
			indicator.className = "strength-indicator";

			if (i < strength) {
				indicator.classList.add("active");
				if (strength === 1) indicator.classList.add("weak");
				if (strength === 2) indicator.classList.add("fair");
				if (strength === 3) indicator.classList.add("good");
				if (strength === 4) indicator.classList.add("strong");
			}

			strengthBar.appendChild(indicator);
		}

		// Add strength text
		const strengthText = document.createElement("small");

		if (strength === 0) {
			strengthText.textContent = "Password is too weak";
			strengthText.className = "text-danger";
		} else if (strength === 1) {
			strengthText.textContent = "Weak password";
			strengthText.className = "text-danger";
		} else if (strength === 2) {
			strengthText.textContent = "Fair password";
			strengthText.className = "text-warning";
		} else if (strength === 3) {
			strengthText.textContent = "Good password";
			strengthText.className = "text-info";
		} else {
			strengthText.textContent = "Strong password";
			strengthText.className = "text-success";
		}

		meter.appendChild(strengthText);
	}

	/**
	 * Mark a field as invalid with error message
	 * @param {HTMLElement} field - The field element
	 * @param {string} message - Error message
	 */
	function markFieldAsInvalid(field, message) {
		field.classList.add("is-invalid");

		// Remove existing error message if any
		const existingFeedback = field.nextElementSibling;
		if (
			existingFeedback &&
			existingFeedback.classList.contains("invalid-feedback")
		) {
			existingFeedback.remove();
		}

		// Add error message
		const feedback = document.createElement("div");
		feedback.className = "invalid-feedback";
		feedback.textContent = message;
		field.parentNode.appendChild(feedback);
	}

	/**
	 * Mark a field as valid
	 * @param {HTMLElement} field - The field element
	 */
	function markFieldAsValid(field) {
		field.classList.remove("is-invalid");
		field.classList.add("is-valid");

		// Remove error message if any
		const existingFeedback = field.nextElementSibling;
		if (
			existingFeedback &&
			existingFeedback.classList.contains("invalid-feedback")
		) {
			existingFeedback.remove();
		}
	}

	/**
	 * Validate email format
	 * @param {string} email - The email to validate
	 * @returns {boolean} - Whether the email is valid
	 */
	function validateEmail(email) {
		const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return re.test(email);
	}

	/**
	 * Validate phone number format
	 * @param {string} phone - The phone number to validate
	 * @returns {boolean} - Whether the phone number is valid
	 */
	function validatePhone(phone) {
		const re = /^[0-9]{10}$/;
		return re.test(phone.replace(/\D/g, ""));
	}

	/**
	 * Save user data to localStorage
	 * @param {object} userData - User data object
	 */
	function saveUserToLocalStorage(userData) {
		// Get existing users or initialize empty array
		const users = JSON.parse(localStorage.getItem("users")) || [];

		// Add new user
		users.push(userData);

		// Save back to localStorage
		localStorage.setItem("users", JSON.stringify(users));
	}
});

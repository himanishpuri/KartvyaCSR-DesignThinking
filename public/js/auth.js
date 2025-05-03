/**
 * Authentication Module for CSR Connect
 * Handles login validation and user redirection
 */

document.addEventListener("DOMContentLoaded", function () {
	// Get the login form
	const loginForm = document.getElementById("loginForm");
	const loginErrorMsg = document.getElementById("loginErrorMsg");

	if (loginForm) {
		loginForm.addEventListener("submit", function (e) {
			e.preventDefault();

			// Get form data
			const email = loginForm.email.value.trim();
			const password = loginForm.password.value.trim();
			const rememberMe = loginForm.remember.checked;

			// Validate credentials against registered users
			const user = authenticateUser(email, password);

			if (user) {
				// Store user session
				storeUserSession(user, rememberMe);

				// Show success message and redirect
				Swal.fire({
					icon: "success",
					title: "Login Successful",
					text: "Redirecting to your dashboard...",
					timer: 1500,
					showConfirmButton: false,
				}).then(() => {
					// Redirect based on user type
					redirectUser(user.type);
				});
			} else {
				// Show error message
				displayError("Invalid email or password. Please try again.");
			}
		});
	}

	/**
	 * Authenticate user against registered users or default users
	 * @param {string} email - User email
	 * @param {string} password - User password
	 * @returns {object|null} - User object if authenticated, null otherwise
	 */
	function authenticateUser(email, password) {
		// Check registered users first
		const registeredUsers = JSON.parse(localStorage.getItem("users")) || [];
		const registeredUser = registeredUsers.find(
			(user) => user.email === email && user.password === password,
		);

		if (registeredUser) {
			return registeredUser;
		}

		// Fallback to default users (for demo purposes)
		const defaultUsers = [
			{
				email: "ngo@example.com",
				password: "password123",
				type: "ngo",
			},
			{
				email: "corporate@example.com",
				password: "password123",
				type: "corporate",
			},
			{
				email: "admin@example.com",
				password: "admin123",
				type: "admin",
			},
		];

		return (
			defaultUsers.find(
				(user) => user.email === email && user.password === password,
			) || null
		);
	}

	/**
	 * Store user session in localStorage or sessionStorage
	 * @param {object} user - User object
	 * @param {boolean} remember - Whether to remember the user
	 */
	function storeUserSession(user, remember) {
		// Create a sanitized user object (without password)
		const userSession = {
			email: user.email,
			type: user.type,
			loggedInAt: new Date().toISOString(),
		};

		// Add additional user data if available
		if (user.orgName) userSession.orgName = user.orgName;
		if (user.companyName) userSession.companyName = user.companyName;

		// Store in localStorage (persistent) or sessionStorage (temporary)
		if (remember) {
			localStorage.setItem("userSession", JSON.stringify(userSession));
		} else {
			sessionStorage.setItem("userSession", JSON.stringify(userSession));
		}
	}

	/**
	 * Redirect user based on type
	 * @param {string} userType - User type
	 */
	function redirectUser(userType) {
		switch (userType) {
			case "ngo":
				window.location.href = "./entry.html?type=ngo";
				break;
			case "corporate":
				window.location.href = "./entry.html?type=corporate";
				break;
			case "admin":
				window.location.href = "./entry.html?type=admin";
				break;
			default:
				window.location.href = "../index.html";
		}
	}

	/**
	 * Display error message
	 * @param {string} message - Error message
	 */
	function displayError(message) {
		loginErrorMsg.textContent = message;
		loginErrorMsg.classList.remove("d-none");

		// Shake effect on form
		loginForm.classList.add("shake");
		setTimeout(() => {
			loginForm.classList.remove("shake");
		}, 500);
	}

	/**
	 * Check if user is already logged in and redirect if needed
	 */
	function checkLoggedInStatus() {
		// Check localStorage and sessionStorage
		const userSession =
			JSON.parse(localStorage.getItem("userSession")) ||
			JSON.parse(sessionStorage.getItem("userSession"));

		if (userSession) {
			// User is already logged in, redirect
			redirectUser(userSession.type);
		}
	}

	// Check login status when the page loads
	// Uncomment the line below to enable auto-redirect if already logged in
	// checkLoggedInStatus();
});

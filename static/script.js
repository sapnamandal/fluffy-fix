document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const checkEmailBtn = document.getElementById("checkEmailBtn");
    const passwordSection = document.getElementById("passwordSection");
    const registerSection = document.getElementById("registerSection");
    const passwordInput = document.getElementById("password");
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const errorMessage = document.getElementById("error-message");
    const nameInput = document.getElementById("name");
    const phoneInput = document.getElementById("phone");
    const addressInput = document.getElementById("address");
    const pincodeInput = document.getElementById("pincode");
    const registerPasswordInput = document.getElementById("registerPassword");

    // Utility function to show error messages
    function showError(input, message) {
        input.style.border = "2px solid red";
        const errorElement = document.createElement("p");
        errorElement.className = "error-message";
        errorElement.textContent = message;
        input.parentElement.appendChild(errorElement);
    }

    // Utility function to clear error messages
    function clearError(input) {
        input.style.border = "";
        const errorElement = input.parentElement.querySelector(".error-message");
        if (errorElement) {
            errorElement.remove();
        }
    }

    // Validate email format
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate name (only letters allowed)
    function validateName(name) {
        const nameRegex = /^[A-Za-z\s]+$/;
        return nameRegex.test(name);
    }

    function validatePhone(phone) {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    }

    // Validate pincode (only digits allowed, 6 digits)
    function validatePincode(pincode) {
        const pincodeRegex = /^\d{6}$/;
        return pincodeRegex.test(pincode);
    }

    // Validate password (minimum 6 characters)
    function validatePassword(password) {
        return password.length >= 6;
    }

    function showRegisterForm(email) {
        registerSection.style.display = "block";
        emailInput.value = email;
        emailInput.disabled = true;
        checkEmailBtn.style.display = "none";
    }

    checkEmailBtn.addEventListener("click", function () {
        const email = emailInput.value.trim();
        if (!validateEmail(email)) {
            showError(emailInput, "Please enter a valid email address.");
            return;
        }
        clearError(emailInput);
        checkEmailBtn.innerText = "Checking...";
        fetch("http://127.0.0.1:5000/api/users/check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        })
        .then(response => response.json())
        .then(data => {
            checkEmailBtn.innerText = "Continue";
            if (!data.isNewUser) {
                checkEmailBtn.style.display = "none";
                passwordSection.style.display = "block";
            } else {
                showRegisterForm(email);
            }
        })
        .catch(error => {
            console.error("Error checking email:", error);
            showError(emailInput, "An error occurred. Please try again.");
        });
    });

    // Login button event listener
    loginBtn.addEventListener("click", function () {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Clear previous errors
        clearError(emailInput);
        clearError(passwordInput);

        // Validate email
        if (!validateEmail(email)) {
            showError(emailInput, "Please enter a valid email address.");
            return;
        }

        // Validate password
        if (!validatePassword(password)) {
            showError(passwordInput, "Password should be at least 6 characters long.");
            return;
        }

        // Proceed with login logic
        fetch("http://127.0.0.1:5000/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Login successful") {
                // Save the logged-in user to localStorage
                localStorage.setItem("user", JSON.stringify(data.user));

                alert(`Welcome, ${data.user.name}!`);

                // Redirect user based on role
                if (data.user.role === "admin") {
                    window.location.href = "dashboard.html";
                } else {
                    window.location.href = "pets.html";
                }
            } else {
                showError(passwordInput, "Invalid email or password.");
            }
        })
        .catch(error => {
            console.error("Error logging in:", error);
            showError(loginBtn, "An error occurred. Please try again.");
        });
    });

    if (registerBtn) {
        registerBtn.addEventListener("click", function () {
            const userData = {
                name: document.getElementById("name").value.trim(),
                email: emailInput.value,
                password: document.getElementById("registerPassword").value,
                phone: document.getElementById("phone").value,
                address: document.getElementById("address").value,
                pincode: document.getElementById("pincode").value,
                role: "user"
            };

            const name = nameInput.value.trim();
            const phone = phoneInput.value.trim();
            const address = addressInput.value.trim();
            const pincode = pincodeInput.value.trim();
            const password = registerPasswordInput.value.trim();

            if (!validateName(name)) {
                showError(nameInput, "Name should contain only letters.");
                return;
            }
            clearError(nameInput);

            if (!validatePhone(phone)) {
                showError(phoneInput, "Phone number should be 10 digits.");
                return;
            }
            clearError(phoneInput);

            if (!validatePincode(pincode)) {
                showError(pincodeInput, "Pincode should be 6 digits.");
                return;
            }
            clearError(pincodeInput);

            if (!validatePassword(password)) {
                showError(registerPasswordInput, "Password should be at least 6 characters long.");
                return;
            }
            clearError(registerPasswordInput);

            registerBtn.innerText = "Registering...";
            fetch("http://127.0.0.1:5000/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            })
            .then(response => response.json())
            .then(data => {
            alert("Registration Successful!, redirecting to login page.");

                window.location.href = "login.html";
            })
            .catch(error => {
                console.error("Error registering:", error);
                showError(registerBtn, "An error occurred. Please try again.");
                registerBtn.innerText = "Register";
            });
        });
    }
});

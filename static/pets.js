document.addEventListener("DOMContentLoaded", () => {
    const userStr =  localStorage.getItem("user")
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user) {
        alert("User not logged in. Redirecting to login page.");
        window.location.href = "login.html";
        return;
    }
// Handle Logout
document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.clear(); // Clear user data
    window.location.href = "login.html"; // Redirect to login page
});


    const owner_id = user?.id;

    const petsList = document.getElementById('pets-list');
    const addPetBtn = document.getElementById('add-pet-btn');
    const petFormContainer = document.getElementById('pet-form-container');
    const savePetBtn = document.getElementById('save-pet-btn');
    const backToServiceBtn = document.getElementById('back-to-service-btn');

    // Fetch pets for the logged-in user
    async function fetchPets() {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/pets?user_id=${owner_id}`);
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            const pets = await response.json();
            renderPets(pets);
        } catch (error) {
            console.error('Failed to fetch pets:', error);
        }
    }

    // Render pets
    function renderPets(pets) {
        petsList.innerHTML = '';
        pets.forEach(pet => {
            const petDiv = document.createElement('div');
            petDiv.className = 'pet-card';
            petDiv.innerHTML = `
                <h3>${pet.pet_name}</h3>
                <p>Breed: ${pet.breed || 'N/A'}</p>
                <p>Age: ${pet.age}</p>
                <p>Health: ${pet.health_conditions || 'N/A'}</p>
                <button class="delete-pet-btn" data-id="${pet.id}">Delete</button>
                <button class="book-service-btn" data-id="${pet.id}">Book Service</button>
            `;
            petsList.appendChild(petDiv);
        });

        document.querySelectorAll('.delete-pet-btn').forEach(btn => {
            btn.addEventListener('click', deletePet);
        });
        document.querySelectorAll('.book-service-btn').forEach(btn => {
            btn.addEventListener('click', bookService);
        });
    }

    // Delete pet
    async function deletePet(event) {
        const petId = event.target.dataset.id;
        console.log('Deleting pet with ID:', petId);
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/pets?pet_id=${petId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            fetchPets();
        } catch (error) {
            console.error('Failed to delete pet:', error);
        }
    }

    // Book service
    function bookService(event) {
        const petId = event.target.dataset.id;
        localStorage.setItem('selectedPetId', petId);
        window.location.href = `/services.html`;
    }

    // Show form
    addPetBtn.addEventListener('click', () => {
        petFormContainer.classList.remove('hidden');
    });

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

    // Validate pet name (only letters and spaces allowed)
    function validatePetName(name) {
        const nameRegex = /^[A-Za-z\s]+$/;
        return nameRegex.test(name);
    }

    // Validate breed (only letters and spaces allowed, optional)
    function validateBreed(breed) {
        const breedRegex = /^[A-Za-z\s]*$/; // Allows empty input
        return breedRegex.test(breed);
    }

    // Validate age (positive number)
    function validateAge(age) {
        return age > 0 && Number.isInteger(Number(age));
    }

    // Validate health conditions (letters, numbers, and spaces allowed, optional)
    function validateHealth(health) {
        const healthRegex = /^[A-Za-z0-9\s]*$/; // Allows empty input
        return healthRegex.test(health);
    }

    // Save new pet with validation
    savePetBtn.addEventListener("click", async () => {
        const nameInput = document.getElementById("pet-name");
        const breedInput = document.getElementById("pet-breed");
        const ageInput = document.getElementById("pet-age");
        const healthInput = document.getElementById("pet-health");

        const name = nameInput.value.trim();
        const breed = breedInput.value.trim();
        const age = ageInput.value.trim();
        const health = healthInput.value.trim();

        // Clear previous errors
        clearError(nameInput);
        clearError(breedInput);
        clearError(ageInput);
        clearError(healthInput);

        // Validate inputs
        if (!validatePetName(name)) {
            showError(nameInput, "Enter a valid pet name.");
            return;
        }

        if (!validateBreed(breed)) {
            showError(breedInput, "Enter a valid breed.");
            return;
        }

        if (!validateAge(age)) {
            showError(ageInput, "Enter a valid age.");
            return;
        }

        if (!validateHealth(health)) {
            showError(healthInput, "Enter valid health conditions.");
            return;
        }

        // Proceed with saving the pet
        try {
            const response = await fetch("http://127.0.0.1:5000/api/pets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    owner_id,
                    pet_name: name,
                    breed,
                    age,
                    health_conditions: health
                })
            });
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            petFormContainer.classList.add("hidden");
            fetchPets();
        } catch (error) {
            console.error("Failed to save pet:", error);
        }
    });

    fetchPets();

    const ownerId = user.id;

    // Fetch and display user's appointments
    async function fetchAppointments() {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/appointments?user_id=${ownerId}`);
            if (!response.ok) throw new Error("Failed to fetch appointments.");
            const appointments = await response.json();
            renderAppointments(appointments);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    }

    function renderAppointments(appointments) {
        const appointmentsList = document.getElementById("appointments-list");
        appointmentsList.innerHTML = ""; // Clear existing appointments

        if (appointments.length === 0) {
            appointmentsList.innerHTML = "<p>No appointments found.</p>";
            return;
        }

        appointments.forEach(appointment => {
            const appointmentCard = document.createElement("div");
            appointmentCard.className = "appointment-card";
            appointmentCard.innerHTML = `
                <p><strong>Service:</strong> ${appointment.service_name}</p>
                <p><strong>Date:</strong> ${appointment.appointment_date}</p>
                <p><strong>Time:</strong> ${appointment.appointment_time}</p>
                <p><strong>Status:</strong> ${appointment.status || "Pending"}</p>
            `;
            appointmentsList.appendChild(appointmentCard);
        });
    }

    // Fetch appointments on page load
    fetchAppointments();
});

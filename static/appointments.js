document.addEventListener("DOMContentLoaded", () => {
    const selectedService = JSON.parse(localStorage.getItem("selectedService"));
    const selectedPetId = JSON.parse(localStorage.getItem("selectedPetId"));
    const user = JSON.parse(localStorage.getItem("user"));
    const owner_id = user?.id;
    if (!selectedService) {
        alert("No service selected. Redirecting to Services Page.");
        window.location.href = "services.html";
        return;
    }

    document.getElementById("selected-service").textContent = `Selected Service: ${selectedService.name} @ ₹${selectedService.price}`;

    populateDates();
    populateTimeSlots();

    document.getElementById("back-to-services-btn").addEventListener("click", () => {
        window.location.href = "services.html";
    });

    document.getElementById("select-slot-btn").addEventListener("click", async () => {
        const selectedDate = document.querySelector(".date.selected")?.textContent;
        const selectedTime = document.querySelector(".time.selected")?.textContent;

        if (!selectedDate || !selectedTime) {
            alert("Please select a date and time.");
            return;
        }

        const appointmentData = {
            owner_id,
            pet_id: selectedPetId,
            service_name: selectedService.name,
            service_price: selectedService.price,
            appointment_date: selectedDate,
            appointment_time: selectedTime
        };

        try {
       
            // Save appointment details to localStorage
            localStorage.setItem("appointmentDetails", JSON.stringify(appointmentData));

            // Redirect to the payments page
            window.location.href = "payments.html";
        } catch (error) {
            console.error("Error creating appointment:", error);
            alert("Failed to create appointment. Please try again.");
        }
    });
});

function populateDates() {
    const dateSelector = document.querySelector(".date-selector");
    dateSelector.innerHTML = "";

    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const dateElement = document.createElement("div");
        dateElement.className = "date";
        dateElement.textContent = date.toDateString().slice(0, 10); // Format: Thu Apr 10
        dateElement.addEventListener("click", () => {
            document.querySelectorAll(".date").forEach(el => el.classList.remove("selected"));
            dateElement.classList.add("selected");
        });

        dateSelector.appendChild(dateElement);
    }
}

function populateTimeSlots() {
    const timeSelector = document.querySelector(".time-selector");
    timeSelector.innerHTML = "";

    const timeSlots = [
        "07:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
        "12:30 PM", "01:30 PM", "03:00 PM", "03:30 PM",
        "04:30 PM", "05:00 PM", "06:30 PM"
    ];

    timeSlots.forEach(slot => {
        const timeElement = document.createElement("div");
        timeElement.className = "time";
        timeElement.textContent = slot;
        timeElement.addEventListener("click", () => {
            document.querySelectorAll(".time").forEach(el => el.classList.remove("selected"));
            timeElement.classList.add("selected");
        });

        timeSelector.appendChild(timeElement);
    });
}


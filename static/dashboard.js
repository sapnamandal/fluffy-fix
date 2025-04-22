document.addEventListener("DOMContentLoaded", () => {
    // Check if admin is logged in
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
        alert("Access denied. Admins only.");
        window.location.href = "login.html"; // Redirect to login page
        return;
    }

    // Handle Logout
    document.getElementById("logout-btn").addEventListener("click", () => {
        localStorage.clear(); // Clear user data
        window.location.href = "login.html"; // Redirect to login page
    });

    // Fetch and display summary counts
    async function fetchSummaryCounts() {
        try {
            const countsRes = await   fetch("http://127.0.0.1:5000/api/dashboard/counts")
            

            if (!countsRes.ok ) {
                throw new Error("Failed to fetch summary counts.");
            }

            const counts = await countsRes.json();

            // Update summary counts
            document.getElementById("total-users").querySelector("p").textContent = counts.users;
            document.getElementById("total-pets").querySelector("p").textContent = counts.pets;
            document.getElementById("total-appointments").querySelector("p").textContent = counts.appointments;
        } catch (error) {
            console.error("Error fetching summary counts:", error);
        }
    }

    // Fetch and display appointments
    async function fetchAppointments() {
        try {
            const response = await fetch("http://127.0.0.1:5000/api/dashboard/appointments");
            if (!response.ok) throw new Error("Failed to fetch appointments.");
            const appointments = await response.json();
            renderAppointments(appointments);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    }

    function renderAppointments(appointments) {
        const tableBody = document.querySelector("#appointments-table tbody");
        tableBody.innerHTML = ""; // Clear existing rows

        appointments.forEach(appointment => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${appointment.id}</td>
                <td>${appointment.service_name}</td>
                <td>₹${appointment.service_price}</td>
                <td>${appointment.appointment_date}</td>
                <td>${appointment.appointment_time}</td>
                <td>${appointment.owner_name}</td>
                <td>${appointment.pet_name}</td>
                <td>${appointment.status || "Pending"}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Fetch data on page load
    fetchSummaryCounts();
    fetchAppointments();
});
document.addEventListener("DOMContentLoaded", () => {
       // Retrieve details from localStorage
       const appointmentDetails = JSON.parse(localStorage.getItem("appointmentDetails"));
       const selectedService = JSON.parse(localStorage.getItem("selectedService"));
       const user = JSON.parse(localStorage.getItem("user"));
   
       if (!appointmentDetails || !selectedService || !user) {
           alert("Missing appointment or service data.");
           return;
       }
       if (!appointmentDetails) {
         alert("No appointment details found. Redirecting to appointments page.");
         window.location.href = "appointments.html";
       } else {
         // Display appointment details
         const detailsContainer = document.getElementById("appointment-details");
         detailsContainer.innerHTML = `
           <p><strong>Service:</strong> ${appointmentDetails.service_name}</p>
           <p><strong>Price:</strong> ₹${appointmentDetails.service_price}</p>
           <p><strong>Date:</strong> ${appointmentDetails.appointment_date}</p>
           <p><strong>Time:</strong> ${appointmentDetails.appointment_time}</p>
         `;
       }

       // Handle logout functionality
       document.getElementById("logout-btn").addEventListener("click", () => {
         localStorage.clear(); // Clear user data
         window.location.href = "login.html"; // Redirect to login page
       });



    // Handle payment
    document.getElementById("confirm-payment-btn").addEventListener("click", async () => {
        appointmentDetails.amount = selectedService.price;
        appointmentDetails.payment_status = "Completed";

        try {
            const response = await fetch("http://127.0.0.1:5000/api/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(appointmentDetails)
            });

            if (!response.ok) {
                throw new Error(`Failed to create appointment: ${response.status}`);
            }

            const result = await response.json();
            alert(`Appointment confirmed for ${selectedService.name} on ${appointmentDetails.appointment_date} at ${appointmentDetails.appointment_time}`);
            console.log("Appointment created:", result);

    

    
            // Replace container content with success message
            document.querySelector(".payment-container").innerHTML = `
                <div class="success-container">
                    <h2>Payment Successful!</h2>
                    <p>Thank you for booking the <strong>${selectedService.name}</strong> service.</p>
                    <p>Your appointment is confirmed for <strong>${appointmentDetails.appointment_date}</strong> at <strong>${appointmentDetails.appointment_time}</strong>.</p>
                    <button id="back-to-pets-btn" class="back-btn">Back to Pets</button>
                </div>
            `;

            // Add event listener for "Back to Pets" button
            document.getElementById("back-to-pets-btn").addEventListener("click", () => {
                window.location.href = "pets.html";
            });
        } catch (error) {
            console.error("Error processing payment:", error);
            alert("Payment failed. Please try again.");
        }
    });
});

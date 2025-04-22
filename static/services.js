// Sample service data
const services = [
    {
        name: "Pawsome Bath",
        price: 999,
        description: [
            "Bath with Shampoo & Conditioner",
            "Blow Dry",
            "Combing & Brushing"
        ]
    },
    {
        name: "Advanced Grooming",
        price: 1499,
        description: [
            "Bath with Shampoo & Conditioner",
            "Blow Dry",
            "Combing & Brushing",
            "Nail Clipping",
            "Ear & Eye Cleaning",
            "Sanitary Clipping",
            "Teeth Cleaning/Mouth Spray",
            "Paw Massage",
            "Deshedding"
        ]
    },
    {
        name: "Styling Package",
        price: 1999,
        description: [
            "Bath with Shampoo & Conditioner",
            "Blow Dry",
            "Combing & Brushing",
            "Facial Haircut",
            "Full Body Trimming",
            "Styling",
            "Nail Clipping",
            "Ear & Eye Cleaning",
            "Sanitary Clipping",
            "Teeth Cleaning/Mouth Spray",
            "Paw Massage",
            "Deshedding",
            "Dematting"
        ]
    }
];

// Dynamically load service cards
const serviceContainer = document.getElementById("service-cards");

services.forEach(service => {
    const card = document.createElement("div");
    card.className = "card";

    const featureList = service.description
        .map(feature => `<li>${feature}</li>`)
        .join("");

    card.innerHTML = `
        <h2>${service.name}</h2>
        <p class="price">Price: ₹${service.price}</p>
        <ul>${featureList}</ul>
        <button class="select-service-btn">Select Service</button>
    `;

    card.querySelector(".select-service-btn").addEventListener("click", () => {
        localStorage.setItem("selectedService", JSON.stringify(service));
        window.location.href = "appointments.html";
        
    });

    serviceContainer.appendChild(card);
});
  

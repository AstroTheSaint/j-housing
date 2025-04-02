// Property data structure (this would typically come from an API or database)
const properties = [
    {
        name: "The Zen Garden Suite",
        location: "Minato-ku, Tokyo",
        type: "Luxury Apartment",
        size: "120m²",
        price: "¥450,000/night",
        image: "/images/placeholder-1.jpg",
        culturalValue: 95,
        artisticValue: 90
    },
    // Add more properties here from properties_data.md
];

// Function to create a property card
function createPropertyCard(property) {
    return `
        <article class="property-card">
            <div class="property-image">
                <img src="${property.image}" alt="${property.name}">
                <div class="property-overlay">
                    <span class="cultural-value">${property.culturalValue}</span>
                    <span class="artistic-value">${property.artisticValue}</span>
                </div>
            </div>
            <div class="property-info">
                <h2>${property.name}</h2>
                <p class="location">${property.location}</p>
                <div class="features">
                    <span>${property.size}</span>
                    <span>${property.type}</span>
                </div>
                <div class="price">${property.price}</div>
                <button class="view-details">View Details</button>
            </div>
        </article>
    `;
}

// Function to render all property cards
async function renderProperties() {
    const propertyGrid = document.querySelector('.property-grid');
    if (!propertyGrid) return;

    try {
        const response = await fetch('/api/properties');
        const data = await response.json();
        const propertyCards = data.properties.map(property => createPropertyCard(property)).join('');
        propertyGrid.innerHTML = propertyCards;
    } catch (error) {
        console.error('Error fetching properties:', error);
        propertyGrid.innerHTML = '<p class="error">Error loading properties. Please try again later.</p>';
    }
}

// Function to handle property card click
function handlePropertyClick(event) {
    const card = event.target.closest('.property-card');
    if (!card) return;

    const propertyName = card.querySelector('h2').textContent;
    // Navigate to property details page
    window.location.href = `/property/${encodeURIComponent(propertyName)}`;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderProperties();
    
    // Add click event listeners to property cards
    const propertyGrid = document.querySelector('.property-grid');
    if (propertyGrid) {
        propertyGrid.addEventListener('click', handlePropertyClick);
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
}); 
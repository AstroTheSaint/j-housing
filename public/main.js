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
    let properties = [];
    const propertyGrid = document.getElementById('propertyGrid');
    const wardSelect = document.getElementById('ward');
    const typeSelect = document.getElementById('type');
    const durationSelect = document.getElementById('duration');
    const sortSelect = document.getElementById('sort');
    const wardCards = document.querySelectorAll('.ward-card');
    const modal = document.getElementById('propertyModal');
    const modalContent = document.getElementById('modalContent');
    const closeModal = document.querySelector('.close-modal');

    // Fetch properties data
    fetch('/properties_data.json')
        .then(response => response.json())
        .then(data => {
            properties = data.properties;
            renderProperties(properties);
            setupFilters();
            setupWardCards();
            updateWardCounts();
        })
        .catch(error => console.error('Error loading properties:', error));

    function renderProperties(properties) {
        propertyGrid.innerHTML = properties.map(property => `
            <div class="property-card" data-id="${property.id}">
                <div class="property-image">
                    <img src="${property.image}" alt="${property.name}">
                    <div class="property-overlay"></div>
                    <div class="property-ratings">
                        <span class="rating cultural-rating">
                            Cultural: ${property.culturalValue}
                        </span>
                        <span class="rating artistic-rating">
                            Artistic: ${property.artisticValue}
                        </span>
                    </div>
                </div>
                <div class="property-info">
                    <h3>${property.name}</h3>
                    <p class="property-location">${property.location}</p>
                    <div class="property-features">
                        <span class="feature-tag">${property.size}</span>
                        <span class="feature-tag">${property.type}</span>
                    </div>
                    <div class="property-features">
                        ${property.features.map(feature => 
                            `<span class="feature-tag">${feature}</span>`
                        ).join('')}
                    </div>
                    <p class="property-price">${calculateRate(property.price, durationSelect.value)}</p>
                </div>
            </div>
        `).join('');

        // Add click handlers to property cards
        document.querySelectorAll('.property-card').forEach(card => {
            card.addEventListener('click', () => {
                const propertyId = card.dataset.id;
                const property = properties.find(p => p.id === propertyId);
                showPropertyDetails(property);
            });
        });
    }

    function showPropertyDetails(property) {
        modalContent.innerHTML = `
            <div class="property-detail">
                <div class="property-detail-image">
                    <img src="${property.image}" alt="${property.name}">
                </div>
                <div class="property-detail-info">
                    <h2>${property.name}</h2>
                    <p class="property-location">${property.location}</p>
                    <div class="property-detail-ratings">
                        <span class="rating cultural-rating">Cultural Value: ${property.culturalValue}/100</span>
                        <span class="rating artistic-rating">Artistic Value: ${property.artisticValue}/100</span>
                    </div>
                    <div class="property-info-grid">
                        <div>
                            <h4>Property Type</h4>
                            <p>${property.type}</p>
                        </div>
                        <div>
                            <h4>Size</h4>
                            <p>${property.size}</p>
                        </div>
                    </div>
                    <div>
                        <h4>Features</h4>
                        <div class="property-detail-features">
                            ${property.features.map(feature => 
                                `<span class="feature-tag">${feature}</span>`
                            ).join('')}
                        </div>
                    </div>
                    <div>
                        <h4>Pricing</h4>
                        <p class="property-price">Nightly: ${property.price}</p>
                        <p class="property-price">Weekly: ${calculateRate(property.price, 'weekly')}</p>
                        <p class="property-price">Monthly: ${calculateRate(property.price, 'monthly')}</p>
                    </div>
                </div>
            </div>
        `;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function updateWardCounts() {
        wardCards.forEach(card => {
            const ward = card.dataset.ward;
            const count = properties.filter(p => p.ward === ward).length;
            card.querySelector('.property-count').textContent = `${count} Properties`;
        });
    }

    function calculateRate(price, duration) {
        const nightlyRate = parseInt(price.replace(/[^0-9]/g, ''));
        if (duration === 'weekly') {
            return `¥${(nightlyRate * 7).toLocaleString()}/week`;
        } else if (duration === 'monthly') {
            return `¥${(nightlyRate * 30).toLocaleString()}/month`;
        }
        return price;
    }

    function setupFilters() {
        const filters = [wardSelect, typeSelect, durationSelect, sortSelect];
        filters.forEach(filter => {
            filter.addEventListener('change', () => {
                let filteredProperties = properties.filter(property => {
                    const wardMatch = !wardSelect.value || 
                        property.ward === wardSelect.value;
                    const typeMatch = !typeSelect.value || 
                        property.type === typeSelect.value;
                    return wardMatch && typeMatch;
                });

                filteredProperties = sortProperties(filteredProperties, sortSelect.value);
                renderProperties(filteredProperties);
            });
        });
    }

    function setupWardCards() {
        wardCards.forEach(card => {
            card.addEventListener('click', () => {
                const ward = card.dataset.ward;
                wardSelect.value = ward;
                const filteredProperties = properties.filter(property => 
                    property.ward === ward
                );
                renderProperties(filteredProperties);
                document.getElementById('properties').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });
    }

    // Close modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    function sortProperties(properties, sortType) {
        return [...properties].sort((a, b) => {
            switch (sortType) {
                case 'price-asc':
                    return parseInt(a.price.replace(/[^0-9]/g, '')) - 
                           parseInt(b.price.replace(/[^0-9]/g, ''));
                case 'price-desc':
                    return parseInt(b.price.replace(/[^0-9]/g, '')) - 
                           parseInt(a.price.replace(/[^0-9]/g, ''));
                case 'size-asc':
                    return parseInt(a.size) - parseInt(b.size);
                case 'size-desc':
                    return parseInt(b.size) - parseInt(a.size);
                default:
                    return 0;
            }
        });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.property-card, .feature-card, .ward-card').forEach(el => {
        el.classList.add('fade-out');
        observer.observe(el);
    });
}); 
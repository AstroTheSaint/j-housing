const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/images', express.static('images'));

// Read properties data
const propertiesData = JSON.parse(fs.readFileSync('properties_data.json', 'utf8'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'property_listing.html'));
});

app.get('/api/properties', (req, res) => {
    res.json(propertiesData);
});

app.get('/api/properties/:id', (req, res) => {
    const property = propertiesData.properties.find(p => p.id === req.params.id);
    if (!property) {
        return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'property_listing.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 
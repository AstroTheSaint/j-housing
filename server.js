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
    res.sendFile(path.join(__dirname, 'property_listing.html'));
});

app.get('/api/properties', (req, res) => {
    res.json(propertiesData);
});

app.get('/api/properties/:id', (req, res) => {
    const property = propertiesData.find(p => p.id === req.params.id);
    if (!property) {
        return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 
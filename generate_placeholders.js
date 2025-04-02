const fs = require('fs');
const path = require('path');

// Create SVG placeholder function
function createPlaceholderSVG(index) {
    return `
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f5f5f5"/>
    <text x="50%" y="50%" font-family="Arial" font-size="24" fill="#666" text-anchor="middle" dominant-baseline="middle">
        Property ${index}
    </text>
</svg>`;
}

// Generate 34 placeholder images
for (let i = 1; i <= 34; i++) {
    const svgContent = createPlaceholderSVG(i);
    const filePath = path.join(__dirname, 'images', `placeholder-${i}.svg`);
    fs.writeFileSync(filePath, svgContent);
    console.log(`Generated placeholder-${i}.svg`);
}

console.log('All placeholder images generated successfully!'); 
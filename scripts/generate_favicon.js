const sharp = require('sharp');

async function generate() {
    const input = 'public/logo.png';
    try {
        await sharp(input).resize(48, 48).toFile('public/favicon.png');
        await sharp(input).resize(180, 180).toFile('public/apple-touch-icon.png');
        console.log('Icons generated successfully!');
    } catch (e) {
        console.error('Error generating icons:', e);
    }
}

generate();

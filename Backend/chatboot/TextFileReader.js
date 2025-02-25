const fs = require('fs');

const readFile = (filePath) => {
    let result = null;
    try {
        result = fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        console.error('Error reading file:', err);
    }
    return result;
};

module.exports = { readFile };

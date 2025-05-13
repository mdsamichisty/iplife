const express = require('express');
const si = require('systeminformation'); // systeminformation package for detailed hardware info
const os = require('os');
const fetch = require('node-fetch');

const app = express();
const port = 3000;

// Serve static files (frontend)
app.use(express.static('public'));

// Endpoint to get system information (CPU model & generation)
app.get('/api/system-info', async (req, res) => {
    try {
        // Get CPU info
        const cpuInfo = await si.cpu();
        const cpuGeneration = getCPUGeneration(cpuInfo.manufacturer + ' ' + cpuInfo.brand);

        // Get RAM info
        const ram = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2); // GB

        // Get platform info
        const platform = process.platform;

        // Get the public IP address using ipify service
        const ipv4 = await fetch('https://api.ipify.org?format=json').then(response => response.json()).then(data => data.ip);

        // Get the device name (hostname)
        const deviceName = os.hostname();

        res.json({
            cpu: `${cpuInfo.manufacturer} ${cpuInfo.brand} ${cpuGeneration}`,
            ram: `${ram} GB`,
            platform: platform,
            ipv4: ipv4,
            deviceName: deviceName  // Send the device name
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching system info' });
    }
});

// Function to extract the CPU generation from model name
function getCPUGeneration(cpuModel) {
    const regex = /(i[3579])\-(\d{4})/;  // Matches i5-11400, i7-10700
    const match = cpuModel.match(regex);
    if (match) {
        const series = match[1];  // i5, i7, i9
        const generation = match[2].slice(0, 1);  // First digit of the model number (e.g., 11 from 11400)
        return `(Gen ${generation})`;
    }
    return '(Unknown Generation)';
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

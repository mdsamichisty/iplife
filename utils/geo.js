const axios = require('axios');

async function getGeoData(ip) {
    try {
        const { data } = await axios.get(`http://ip-api.com/json/${ip}`);
        return {
            country: data.country,
            city: data.city,
            isp: data.isp,
            region: data.regionName,
            timezone: data.timezone,
        };
    } catch (err) {
        console.error("Geo lookup failed:", err.message);
        return null;
    }
}

module.exports = { getGeoData };

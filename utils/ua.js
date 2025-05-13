const UAParser = require('ua-parser-js');

function parseUA(uaString) {
    const parser = new UAParser(uaString);
    return {
        browser: parser.getBrowser(),
        os: parser.getOS(),
        device: parser.getDevice(),
    };
}

module.exports = { parseUA };

const { UAParser } = require('ua-parser-js');

/**
 * Parse User-Agent string into structured browser/device/os info.
 * @param {string} uaString
 * @returns {{ browser: string, device: string, os: string }}
 */
function parseUserAgent(uaString) {
  if (!uaString) return { browser: 'Unknown', device: 'Unknown', os: 'Unknown' };

  const parser = new UAParser(uaString);
  const result = parser.getResult();

  const browser = result.browser.name || 'Unknown';
  const os = result.os.name || 'Unknown';

  let device = 'Desktop';
  if (result.device.type === 'mobile') device = 'Mobile';
  else if (result.device.type === 'tablet') device = 'Tablet';

  return { browser, device, os };
}

module.exports = { parseUserAgent };

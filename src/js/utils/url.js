export async function getCurrentTabDomain() {
  try {
    // Get the active tab in the current window
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab?.url) return false;

    // Create URL object to parse the URL
    const url = new URL(tab.url);

    // Check for browser built-in URLs
    const builtInProtocols = [
      "chrome:",
      "chrome-extension:",
      "edge:",
      "about:",
      "browser:",
    ];
    if (builtInProtocols.includes(url.protocol)) {
      return false;
    }

    // Return the domain name (hostname)
    return url.hostname;
  } catch (error) {
    console.error("Error getting active domain:", error);
    return false;
  }
}

import { updateHistoryCountBadge } from "../utils/background.js";

// Listen for tab updates
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  updateHistoryCountBadge(activeInfo.tabId);
});

// Listen for tab URL changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    updateHistoryCountBadge(tabId);
  }
});

// Initialize badge for current tab when extension loads
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs[0]) {
    updateHistoryCountBadge(tabs[0].id);
  }
});

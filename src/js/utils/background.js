import { getCurrentTabDomain } from "./url.js";

export async function updateHistoryCountBadge(tabId) {
  try {
    const domain = await getCurrentTabDomain();

    if (!domain) {
      return;
    }

    if (!tabId) {
      const [activeTab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      tabId = activeTab.id;
    }

    // Search history for this domain
    chrome.history.search(
      {
        text: domain,
        maxResults: 1001,
        startTime: 0,
      },
      (historyItems) => {
        // Filter results for exact domain match
        let count = historyItems.filter((item) => {
          try {
            const itemUrl = new URL(item.url);
            return itemUrl.hostname === domain;
          } catch {
            return false;
          }
        }).length;

        count = count >= 1000 ? "999+" : count.toString();

        // Update badge text
        chrome.action.setBadgeText({
          text: count,
          tabId: tabId,
        });

        // Optional: Set badge background color
        chrome.action.setBadgeBackgroundColor({
          color: "#4688F1",
          tabId: tabId,
        });
      }
    );
  } catch (error) {
    console.error("Error updating badge:", error);
    chrome.action.setBadgeText({
      text: "",
      tabId: tabId,
    });
  }
}

export function saveSearchFilters() {
  const userInputs = {
    domain: document.getElementById("domain").value,
    keyword: document.getElementById("keyword").value,
    startTime: document.getElementById("start-time").value,
    endTime: document.getElementById("end-time").value,
  };

  chrome.storage.local.set({ lastSearch: userInputs }, function () {
    if (chrome.runtime.lastError) {
      console.error("Error saving:", chrome.runtime.lastError);
    }
  });
}

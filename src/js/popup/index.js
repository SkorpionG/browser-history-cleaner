import { renderHistoryList } from "./ui.js";
import {
  updateSelectedItemsCount,
  toggleSelectAllVisibility,
} from "../utils/utils.js";
import { getCurrentTabDomain } from "../utils/url.js";
import {
  updateHistoryCountBadge,
  saveSearchFilters,
} from "../utils/background.js";
import { DeleteProgressPopup } from "../components/DeleteProgressPopup.js";

const deleteProgressPopup = new DeleteProgressPopup();
deleteProgressPopup.create(100);

document.addEventListener("DOMContentLoaded", async function () {
  const domainInput = document.getElementById("domain");
  const keywordInput = document.getElementById("keyword");
  const startTimeInput = document.getElementById("start-time");
  const endTimeInput = document.getElementById("end-time");

  const currentDomain = await getCurrentTabDomain();

  domainInput.value = currentDomain || "";

  // Retrieve last search parameters
  chrome.storage.local.get("lastSearch", function (result) {
    const lastSearch = result.lastSearch;
    if (lastSearch) {
      // Pre-fill the form fields
      if (!currentDomain) {
        domainInput.value = lastSearch.domain || "";
      }
      keywordInput.value = lastSearch.keyword || "";
      startTimeInput.value = lastSearch.startTime || "";
      endTimeInput.value = lastSearch.endTime || "";
    }
  });
});

document.getElementById("select-all").addEventListener("change", (event) => {
  const isChecked = event.target.checked;
  const checkboxes = document.querySelectorAll(
    "#results .history-item input[type='checkbox']"
  );
  checkboxes.forEach((checkbox) => {
    checkbox.checked = isChecked;
  });
  let selectedCount = isChecked ? checkboxes.length : 0;
  updateSelectedItemsCount(selectedCount);
});

document
  .querySelectorAll(".filter-criteria > input.filter-input")
  .forEach((historyFilter) => {
    historyFilter.addEventListener("change", async () => {
      saveSearchFilters();
    });
  });

document.getElementById("search").addEventListener("click", async () => {
  updateSelectedItemsCount(0);

  const domain = document.getElementById("domain").value;
  const keyword = document.getElementById("keyword").value;
  const startTime = new Date(
    document.getElementById("start-time").value
  ).getTime();
  const endTime = new Date(document.getElementById("end-time").value).getTime();

  const searchQuery = {
    text: domain,
    maxResults: 1000,
    startTime: 0,
  };

  if (startTime) {
    searchQuery.startTime = startTime;
  }

  if (endTime) {
    searchQuery.endTime = endTime;
  }

  // Search history
  await chrome.history.search(searchQuery, (historyItems) => {
    // Filter results
    const filteredItems = historyItems.filter((item) => {
      const url = new URL(item.url);
      return (
        (!domain || url.hostname.includes(domain)) &&
        (!keyword || item.title.toLowerCase().includes(keyword.toLowerCase()))
      );
    });

    // Display results
    renderHistoryList(filteredItems);
  });
});

document.getElementById("delete").addEventListener("click", async () => {
  document.getElementById("delete").disabled = true;
  document.getElementById("search").disabled = true;
  const selectedItems = Array.from(
    document.querySelectorAll(
      '#results .history-item input[type="checkbox"]:checked'
    )
  ).map((checkbox) => JSON.parse(checkbox.value));

  let deletedCount = 0;

  const progressPopup = new DeleteProgressPopup();
  progressPopup.create(selectedItems.length);

  for (const item of selectedItems) {
    try {
      await chrome.history.deleteUrl({ url: item.url });
      // 確認是否真的被刪除
      const searchResult = await chrome.history.search({
        text: item.url,
        startTime: 0,
        maxResults: 1,
      });

      // 只有在確認 URL 完全被刪除後才更新進度
      if (!searchResult.some((result) => result.url === item.url)) {
        deletedCount++;
        progressPopup.updateProgress(deletedCount);
      }
    } catch (error) {
      console.error("Error deleting URL:", error);
    }
  }

  console.log(deletedCount, "items deleted");
  console.log(selectedItems.length, "items selected");

  updateSelectedItemsCount(0);
  toggleSelectAllVisibility(true);

  updateHistoryCountBadge();

  document.getElementById("results").classList.add("hide");
  document.getElementById("results").innerHTML = "";
  document.getElementById("search").disabled = false;
});

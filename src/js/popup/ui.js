import { updateSelectedCount, toggleSelectAllVisibility } from "../utils/utils.js";

export async function createHistoryListItem(historyObject) {
  const displayUrl =
    historyObject.url.length > 100
      ? historyObject.url.substring(0, 100) + "..."
      : historyObject.url;
  const displayTitle =
    historyObject.title.length > 50
      ? historyObject.title.substring(0, 50) + "..."
      : historyObject.title;

  const visitsResult = await chrome.history.getVisits({
    url: historyObject.url,
  });

  const historyItem = document.createElement("div");
  historyItem.className = "history-item";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";

  // 將 url 和 lastVisitTime 作為值存儲
  checkbox.value = JSON.stringify({
    url: historyObject.url,
    time: historyObject.lastVisitTime,
  });
  checkbox.id = historyObject.id;

  const div = document.createElement("div");
  div.className = "history-item-info";

  const visitedCount = document.createElement("small");
  visitedCount.className = "visited-count";
  visitedCount.textContent = `${visitsResult.length} Visit${
    visitsResult.length > 1 ? "s" : ""
  }`;

  const title = document.createElement("p");
  title.className = "history-title";
  title.title = historyObject.title;

  const titleText = document.createElement("span");
  titleText.textContent = displayTitle;

  title.appendChild(titleText);
  title.appendChild(visitedCount);

  const url = document.createElement("p");
  url.className = "history-url";
  url.textContent = displayUrl;
  url.title = historyObject.url;

  const lastVisitTime = document.createElement("p");
  lastVisitTime.className = "last-visit-time";
  lastVisitTime.textContent = `Last Visit: ${new Date(
    historyObject.lastVisitTime
  ).toLocaleString()}`;

  div.appendChild(title);
  div.appendChild(url);
  div.appendChild(lastVisitTime);

  historyItem.appendChild(checkbox);
  historyItem.appendChild(div);

  div.addEventListener("click", () => {
    checkbox.checked = !checkbox.checked;
    updateSelectedCount();
  });

  checkbox.addEventListener("click", () => {
    updateSelectedCount();
  });

  return historyItem;
}

export function renderHistoryList(items) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.classList.remove("hide");
  if (items.length === 0) {
    document.getElementById("select-all-container").classList.add("hide");
    resultsDiv.innerHTML = "<p>No results found</p>";
    return;
  }
  resultsDiv.innerHTML = ""; // Clear previous results

  document.getElementById("total-count").innerHTML = items.length;

  toggleSelectAllVisibility(false);

  items.forEach(async (item) => {
    const historyItem = await createHistoryListItem(item);
    resultsDiv.appendChild(historyItem);
  });
}

export function updateSelectedCount() {
  const selectedCount = document.querySelectorAll(
    "#results .history-item > input[type='checkbox']:checked"
  ).length;
  updateSelectedItemsCount(selectedCount);
}
export function updateSelectedItemsCount(countNumber) {
  document.getElementById("selected-count").innerHTML = countNumber;

  let totalCount = parseInt(document.getElementById("total-count").innerHTML);

  document.getElementById("select-all").checked =
    countNumber === totalCount && countNumber !== 0;
  document.getElementById("delete").disabled = countNumber === 0;
}

export function toggleSelectAllVisibility(hide) {
  if (hide) {
    document.getElementById("select-all-container").classList.add("hide");
  } else {
    document.getElementById("select-all-container").classList.remove("hide");
  }
}

import { DeleteProgressBanner } from "./DeleteProgressBanner.js";

export class DeleteProgressPopup {
  constructor() {
    this.popup = null;
    this.progressBar = null;
    this.progressText = null;
    this.dismissButton = null;
    this.total = 0;
    this.current = 0;
    this.isDeleting = false;
    this.progressBanner = null;
  }

  create(totalItems) {
    this.total = totalItems;
    this.current = 0;
    this.isDeleting = true;

    // Create popup container
    this.popup = document.createElement("div");
    this.popup.className = "delete-progress-popup";

    // Create close button
    const closeBtn = document.createElement("button");
    closeBtn.className = "popup-close-btn";
    closeBtn.innerHTML = "×";
    closeBtn.onclick = () => this.handleDismiss();

    // Create content
    const content = document.createElement("div");
    content.className = "popup-content";

    // Create progress text
    this.progressText = document.createElement("div");
    this.progressText.className = "progress-text";
    this.updateProgressText();

    // Create progress bar
    this.progressBar = document.createElement("div");
    this.progressBar.className = "progress-bar";
    const progressFill = document.createElement("div");
    progressFill.className = "progress-fill";
    this.progressBar.appendChild(progressFill);

    // Create dismiss button (hidden initially)
    this.dismissButton = document.createElement("button");
    this.dismissButton.className = "button dismiss-btn hidden";
    this.dismissButton.textContent = "Dismiss";
    this.dismissButton.onclick = () => this.close();

    // Assemble popup
    content.appendChild(this.progressText);
    content.appendChild(this.progressBar);
    content.appendChild(this.dismissButton);
    this.popup.appendChild(closeBtn);
    this.popup.appendChild(content);

    // Add overlay
    const overlay = document.createElement("div");
    overlay.className = "popup-overlay";
    overlay.onclick = () => this.handleDismiss();

    // Add to document
    document.body.appendChild(overlay);
    document.body.appendChild(this.popup);
  }

  updateProgress(deletedCount) {
    this.current = deletedCount;
    const percentage = (this.current / this.total) * 100;
    this.progressBar.querySelector(
      ".progress-fill"
    ).style.width = `${percentage}%`;
    this.updateProgressText();

    if (this.progressBanner) {
      this.progressBanner.updateProgress(this.current);
    }

    if (this.current === this.total) {
      this.isDeleting = false;
      this.dismissButton.classList.remove("hidden");
    }
  }

  updateProgressText() {
    this.progressText.textContent = `Deleting: ${this.current}/${this.total} items`;
  }

  handleDismiss() {
    if (this.isDeleting) {
      this.close();
      // Create banner when dismissed during deletion
      this.progressBanner = new DeleteProgressBanner(this.total, this.current);
      this.progressBanner.create();
    } else {
      this.close();
    }
  }

  close() {
    const overlay = document.querySelector(".popup-overlay");
    if (overlay) overlay.remove();
    if (this.popup) this.popup.remove();
  }
}

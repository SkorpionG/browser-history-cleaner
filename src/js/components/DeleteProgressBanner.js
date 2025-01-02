export class DeleteProgressBanner {
  constructor(total, current) {
    this.total = total;
    this.current = current;
    this.banner = null;
    this.progressBar = null;
  }

  create() {
    this.banner = document.createElement("div");
    this.banner.className = "delete-progress-banner";

    const text = document.createElement("div");
    text.className = "banner-text";
    text.textContent = `Deleting: ${this.current}/${this.total} items`;

    this.progressBar = document.createElement("div");
    this.progressBar.className = "banner-progress-bar";
    const progressFill = document.createElement("div");
    progressFill.className = "banner-progress-fill";
    this.progressBar.appendChild(progressFill);

    this.banner.appendChild(text);
    this.banner.appendChild(this.progressBar);
    document.body.appendChild(this.banner);

    this.updateProgress(this.current);
  }

  updateProgress(deletedCount) {
    this.current = deletedCount;
    const percentage = (this.current / this.total) * 100;
    this.progressBar.querySelector(
      ".banner-progress-fill"
    ).style.width = `${percentage}%`;
    this.banner.querySelector(
      ".banner-text"
    ).textContent = `Deleting: ${this.current}/${this.total} items`;

    if (this.current === this.total) {
      setTimeout(() => this.close(), 1500); // Auto close after completion
    }
  }

  close() {
    if (this.banner) this.banner.remove();
  }
}

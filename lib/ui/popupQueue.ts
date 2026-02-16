// lib/ui/popupQueue.ts
// Popup Queue Manager: Ensures only one popup is visible at a time

export type PopupType = "human" | "location" | "install";

interface PopupQueueState {
  currentActive: PopupType | null;
  queue: PopupType[];
}

const STORAGE_KEYS = {
  installPrompt: "installPromptShown",
  locationConfirmed: "locationConfirmed",
};

class PopupQueueManager {
  private state: PopupQueueState = { currentActive: null, queue: [] };
  private listeners: Array<(active: PopupType | null) => void> = [];

  enqueue(popup: PopupType) {
    if (this.shouldSkip(popup)) return;
    if (!this.state.queue.includes(popup) && this.state.currentActive !== popup) {
      this.state.queue.push(popup);
      this.processQueue();
    }
  }

  dequeue() {
    this.state.currentActive = null;
    this.processQueue();
  }

  processQueue() {
    if (this.state.currentActive) return;
    while (this.state.queue.length > 0) {
      const next = this.state.queue.shift()!;
      if (!this.shouldSkip(next)) {
        this.state.currentActive = next;
        this.notify();
        return;
      }
    }
    this.notify();
  }

  onChange(listener: (active: PopupType | null) => void) {
    this.listeners.push(listener);
  }

  offChange(listener: (active: PopupType | null) => void) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  private notify() {
    this.listeners.forEach(l => l(this.state.currentActive));
  }

  setFlag(popup: PopupType) {
    if (popup === "install") {
      localStorage.setItem(STORAGE_KEYS.installPrompt, "true");
    }
    if (popup === "location") {
      localStorage.setItem(STORAGE_KEYS.locationConfirmed, "true");
    }
  }

  shouldSkip(popup: PopupType) {
    if (popup === "install" && localStorage.getItem(STORAGE_KEYS.installPrompt) === "true") return true;
    if (popup === "location" && localStorage.getItem(STORAGE_KEYS.locationConfirmed) === "true") return true;
    return false;
  }

  getCurrentActive() {
    return this.state.currentActive;
  }
}

export const popupQueue = new PopupQueueManager();

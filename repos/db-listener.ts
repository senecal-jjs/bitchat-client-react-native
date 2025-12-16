import { EventEmitter } from "events";

class DBListener extends EventEmitter {
  private static instance: DBListener;

  private constructor() {
    super();
  }

  static getInstance(): DBListener {
    if (!DBListener.instance) {
      DBListener.instance = new DBListener();
    }
    return DBListener.instance;
  }

  notifyMessageChange() {
    this.emit("messages:changed");
  }

  onMessageChange(callback: () => void) {
    this.on("messages:changed", callback);
  }

  removeMessageChangeListener(callback: () => void) {
    this.off("messages:changed", callback);
  }
}

export const dbListener = DBListener.getInstance();

export class Mutex {
  private _lock = Promise.resolve();

  async acquire(): Promise<() => void> {
    let release: () => void;
    const acquiredPromise = new Promise<void>((resolve) => {
      this._lock = this._lock.then(() => {
        resolve();
        return new Promise<void>((r) => (release = r));
      });
    });
    await acquiredPromise;
    return release!;
  }

  async runExclusive<T>(callback: () => Promise<T>): Promise<T> {
    const release = await this.acquire();
    try {
      return await callback();
    } finally {
      release();
    }
  }
}

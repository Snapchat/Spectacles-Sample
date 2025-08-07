export class Queue<T> {
  private storage: T[] = [];

  constructor(private capacity: number = Infinity) {}

  enqueue(item: T): void {
    if (this.size() === this.capacity) {
      this.dequeue();
    }
    this.storage.push(item);
  }

  dequeue(): T | undefined {
    return this.storage.shift();
  }

  peek(index: number): T | undefined {
    return this.storage[index];
  }

  size(): number {
    return this.storage.length;
  }
}

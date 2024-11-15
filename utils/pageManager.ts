export default class PageManager {
  private cursors: Set<string>;
  private currentIndex: number;

  constructor() {
    this.cursors = new Set(['']);
    this.currentIndex = 0;
  }

  setNextCursor(next: string) {
    this.cursors.add(next);
  }

  hasPrevCursor() {
    return this.currentIndex !== 0;
  }

  getPrevCursor() {
    if (this.currentIndex === 0)
      return Array.from(this.cursors)[this.currentIndex];
    this.currentIndex -= 1;
    return Array.from(this.cursors)[this.currentIndex];
  }

  getNextCursor() {
    if (this.currentIndex === this.cursors.size - 1)
      return Array.from(this.cursors)[this.currentIndex];
    this.currentIndex += 1;
    return Array.from(this.cursors)[this.currentIndex];
  }
}

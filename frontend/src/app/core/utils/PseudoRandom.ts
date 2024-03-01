export default class PseudoRandom {
    private state: string | number | null = null;
    private m = 0x80000000;
    private a = 1103515245;
    private c = 12345;
  
    constructor(seed: string | number) {
      if (!seed) {
          this.state = Math.floor(Math.random() * (this.m - 1));
      } else {
          this.state = typeof seed === "number" ? seed : parseInt(seed, 20);
      }
    }
  
    nextInt() {
      this.state = (this.a * (this.state! as number) + this.c) % this.m;
      return this.state;
    }
  
    nextFloat() {
      return this.nextInt() / (this.m - 1);
    }
  
    nextRange(start: number, end: number) {
      const rangeSize = end - start;
      const randomUnder1 = this.nextInt() / this.m;
      return start + Math.floor(randomUnder1 * rangeSize);
    }
  
    choice(array: any[]): any {
      return array[this.nextRange(0, array.length)];
    }
  
    generate() {
      return (this.nextRange(1, 100000000000) / 100000000000);
    }
  }
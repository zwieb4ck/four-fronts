class PseudoRandom {
    constructor(seed) {
      this.state = null;
      this.m = 0x80000000;
      this.a = 1103515245;
      this.c = 12345;

      if(seed) {
        this.state = typeof seed === "string" ? this.generateConsistentNumberFromString(seed) : seed;
      } else {
        this.state = Math.floor(Math.random() * (this.m - 1));
      }
    }
  
    nextInt() {
      this.state = (this.a * this.state + this.c) % this.m;
      return this.state;
    }
  
    nextFloat() {
      return this.nextInt() / (this.m - 1);
    }
  
    nextRange(start, end) {
      const rangeSize = end - start;
      const randomUnder1 = this.nextInt() / this.m;
      return start + Math.floor(randomUnder1 * rangeSize);
    }
  
    choice(array) {
      return array[this.nextRange(0, array.length)];
    }
  
    generate() {
      return (this.nextRange(1, 100000000000) / 100000000000);
    }

    generateConsistentNumberFromString(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
      }
      const seed =  Math.abs(hash);
      return seed;
    }
    
  }

  module.exports = PseudoRandom;
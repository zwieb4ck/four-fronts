const PseudoRandom = require("../util/PseudoRandom");

const STAR_TYPES = {
  MAIN_SEQUENCE: 'MainSequenceStar',
  RED_GIANT: 'RedGiant',
  WHITE_DWRAFS: 'WhiteDwarf',
  NEUTRON: 'NeutronStar',
}

class Star {
  constructor(
        seed
    ) {
    this.type = STAR_TYPES;
    if(!this.gravityRange) {
      this.gravityRange = [1,1];
    }
    if(!this.massRange) {
      this.massRange = [1,1];
    }
    if(!this.luminosityRange) {
      this.luminosityRange = [1,1];
    }
    if(!this.planetCountRange) {
      this.planetCountRange = [1,1];
    }
    this.astronomicalUnit = 10;
    this.type = undefined;
    this.prng = new PseudoRandom(seed);
  }

  updateValues() {
    this.gravity = this.prng.nextRange(this.gravityRange[0], this.gravityRange[1]);
    this.mass = this.prng.nextRange(this.massRange[0], this.massRange[1]);
    this.luminosity = this.prng.nextRange(this.luminosityRange[0], this.luminosityRange[1]);
    this.planetCount = this.prng.nextRange(this.planetCountRange[0], this.planetCountRange[1]);
  }
}

class MainSequenceStar extends Star {
  
  constructor(
    seed
    ) {
      super(seed);
      this.type = STAR_TYPES.MAIN_SEQUENCE;
    this.gravityRange = [0.5, 0.5];
    this.massRange = [1, 1];
    this.luminosityRange = [0.7, 1.3];
    this.planetCountRange = [4, 8];
    this.updateValues();
  }
}

class RedGiant extends Star {
  
  constructor(
    seed
    ) {
      super(seed);
      this.type = STAR_TYPES.RED_GIANT;
    this.gravityRange = [0.25, 0.75];
    this.massRange = [3, 5];
    this.luminosityRange = [1.5, 2];
    this.planetCountRange = [2, 5];
    this.updateValues();
  }
}

class WhiteDwarf extends Star {
  
  constructor(
    seed
    ) {
      super(seed);
      this.type = STAR_TYPES.WHITE_DWRAFS;
    this.gravityRange = [4, 6];
    this.massRange = [0.6, 1.4];
    this.luminosityRange = [0.6, 1.4];
    this.planetCountRange = [5, 10];
    this.updateValues();
  }
}

class NeutronStar extends Star {
  constructor(
    seed
    ) {
      super(seed);
      this.type = STAR_TYPES.NEUTRON;
    this.gravityRange = [4, 6];
    this.massRange = [0.6, 1.4];
    this.luminosityRange = [1.4, 3];
    this.planetCountRange = [0, 2];
    this.updateValues();
  }
}

class StarFactory {

  static create(seed) {
    const prng = new PseudoRandom(seed);
    const chances = StarFactory.getStarChances();
    const StarConstructor = prng.choice(chances);
    return new StarConstructor(seed);
  }

  static getStarChances() {
    const mainSequenceChances = new Array(20).fill(MainSequenceStar);
    const redGiantChances = new Array(8).fill(RedGiant);
    const whiteDwarfChances = new Array(2).fill(WhiteDwarf);
    const neutronChances = new Array(1).fill(NeutronStar);
    const allChances = [
      ...mainSequenceChances,
      ...redGiantChances,
      ...whiteDwarfChances,
      ...neutronChances,
    ];
    return allChances;
  }
}

module.exports = {
STAR_TYPES,
Star,
MainSequenceStar,
RedGiant,
WhiteDwarf,
NeutronStar,
StarFactory,
}
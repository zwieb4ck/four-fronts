class Moon {
    static minSize = 5;
    static maxSize = 15;
    constructor(coords) {
        this.type = "Moon";
        this.coords = coords;
    }
}

module.exports = Moon;
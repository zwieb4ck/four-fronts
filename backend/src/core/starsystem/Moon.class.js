class Moon {
    static minSize = 5;
    static maxSize = 15;
    constructor(size, coords) {
        this.size = size;
        this.type = "Moon";
        this.coords = coords;
    }
}

module.exports = Moon;
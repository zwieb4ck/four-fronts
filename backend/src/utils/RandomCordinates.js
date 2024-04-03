function randomCordinates() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let coordinate = '';
    for (let x = 0; x < 3; x++) {
      for (let i = 0; i < 2; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        coordinate += characters[randomIndex];
      }
    }
    coordinate += '/' + Math.ceil(Math.random() * 12);
    return coordinate;
  }

  module.exports = { randomCordinates }
const Jimp = require('jimp');

const generateAndSaveColorImage = (size, color, fileName) => {
    // color should be in the form of '#RRGGBB'
    if (color.length < 7){ 
        console.error('invalid color')
        throw new Error('Color must be in the form of #RRGGBB')}
    const colorHex = parseInt(`${color.substring(1)}FF`, 16)

    let image = new Jimp(size, size, function (err, image) {
        if (err) throw err;

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                image.setPixelColor(colorHex, x, y)
            }
        }
      
        /*
        imageData.forEach((row, y) => {
          row.forEach((color, x) => {
            image.setPixelColor(color, x, y);
          });
        });
        */
        image.write(fileName, (err) => {
          if (err) throw err
        })
      })
}

module.exports = generateAndSaveColorImage





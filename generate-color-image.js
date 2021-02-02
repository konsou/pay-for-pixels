const Jimp = require('jimp');

const generateAndSaveColorImage = async (size, color, fileName) => {
    console.log(`in generateAndSaveColorImage`)
    console.log(size, color, fileName)
    // color should be in the form of '#RRGGBB'
    if (color.length < 7){ 
        console.error('invalid color')
        throw new Error('Color must be in the form of #RRGGBB')}
    const colorHex = parseInt(`${color.substring(1)}FF`, 16)

    const image = new Jimp(1, 1)    
    image.setPixelColor(colorHex, 0, 0)
    image.resize(parseInt(size), parseInt(size))
    await image.writeAsync(fileName)
}

module.exports = generateAndSaveColorImage





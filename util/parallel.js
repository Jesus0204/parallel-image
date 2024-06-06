/**
 * Processes and transforms the pixels of the chunk of the image with the Inverse filter
 *
 * @param pixels the pixels of the selected portion of the image that the thread will process
 * @return - The pixels of the chunk of the image with Inverse
 */
function processImageInverse(pixels) {
    for (let i = 0; i < pixels.length; i += 4) {
        // Invert colors
        pixels[i] = 255 - pixels[i]; // Red
        pixels[i + 1] = 255 - pixels[i + 1]; // Green
        pixels[i + 2] = 255 - pixels[i + 2]; // Blue
    }
    return pixels;
}

/**
 * Processes and transforms the pixels of the chunk of the image with the Greyscale filter
 *
 * @param pixels the pixels of the selected portion of the image that the thread will process
 * @return - The pixels of the chunk of the image with Greyscale
 */
function processImageGreyscale(pixels) {
    for (let i = 0; i < pixels.length; i += 4) {
        // Greyscale
        const avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
        pixels[i] = avg; // Red
        pixels[i + 1] = avg; // Green
        pixels[i + 2] = avg; // Blue
    }
    return pixels;
}

/**
 * Processes and transforms the pixels of the chunk of the image with the Sepia filter
 *
 * @param pixels the pixels of the selected portion of the image that the thread will process
 * @return - The pixels of the chunk of the image with Sepia 
 */
function processImageSepia(pixels) {
    for (let i = 0; i < pixels.length; i += 4) {
        // Sepia
        let red = pixels[i];
        let green = pixels[i + 1];
        let blue = pixels[i + 2];
        sepiaRed = 0.393 * red + 0.769 * green + 0.189 * blue; // Red
        sepiaGreen = 0.349 * red + 0.686 * green + 0.168 * blue; // Green
        sepiaBlue = 0.272 * red + 0.534 * green + 0.131 * blue;

        // Make sure all of the values are under 255 (which sometimes the operation exceeds this number)
        pixels[i] = Math.min(255, sepiaRed); // Red
        pixels[i + 1] = Math.min(255, sepiaGreen); // Green
        pixels[i + 2] = Math.min(255, sepiaBlue); // Blue
    }
    return pixels;
}

/**
 * Decides which function to call based on the filter selected
 *
 * @param pixels the pixels of the selected portion of the image that the thread will process
 * @param type the type of filter that will be applied
 * @return - The pixels of the chunk of the image with the applied filter
 */
module.exports = ({ pixels, type }) => {
    let result;

    // Check the option and call the appropiate function
    if (type === 'grayscale') {
        result = processImageGreyscale(pixels);
    } else if (type === 'sepia') {
        result = processImageSepia(pixels);
    } else if (type === 'invert') {
        result = processImageInverse(pixels);
    }

    return result;
};
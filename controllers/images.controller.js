const piscina = require('../util/pool');
const PNGReader = require('png.js');
const { PNG } = require('pngjs');
const jpeg = require('jpeg-js');
const moment = require('moment');
const os = require('os');

/**
 * Creates a worker or thread in the thread pool
 *
 * @param pixels the pixels of the selected portion of the image that the thread will process 
 * @param type the type of image that the thread will process
 * @return What the function in parallel.js returns (the processed pixels of the image)
 */
function createWorker(pixels, type) {
    return piscina.run({
        pixels,
        type
    });
}

/**
 * Divides the image into chunks and creates a worker for each chunk
 * 
 * Takes the time that it takes to process the whole image until the promises are resolved
 *
 * @param pixels the pixels of the whole image 
 * @param type the type of image that the thread will process
 * @param numOfThreads_CPU the number of cores that the OS CPU has
 * @return the pixels of the transfored image and the time it took to process it
 */
async function imagePartsPreProcessing(pixels, type, numOfThreads_CPU) {
    // Ensure that the image part size is divisible by 4 so the algorithm works correctly
    const imageSizepPart = Math.ceil(pixels.length / numOfThreads_CPU / 4) * 4;
    const parts = [];

    // Divide the image into chunks
    for (let i = 0; i < numOfThreads_CPU; i++) {
        const start = i * imageSizepPart;
        const end = Math.min(start + imageSizepPart, pixels.length);
        parts.push(pixels.slice(start, end));
    }
    
    try {
        // Use moment to get the current date
        let start = moment();
        const transformedImage = await Promise.all(parts.map(part => createWorker(part, type)));
        // Use moment to get the date after the processing
        let end = moment();
    
        // Get the time it took
        let timeTook = end - start;

        return {transformedImage, timeTook};
    } catch(error) {
        console.log(error);
        let emptyArray = [];
        return {emptyArray, timeTook: 0};
    }

}

/**
 * Main function to deconstruct and reconstruct the image with the new pixel data
 * 
 * Renders the result with the processed inage, or a EJS file to manage errors
 *
 * @param request JS method to request data
 * @param response JS method to respond with data
 * @return 
 */
exports.processImage = async (request, response, next) => {

    // Define the number of threads to be used based on the user input
    let numOfThreads_CPU;
    if (request.body.cores == 'single'){
        numOfThreads_CPU = 1;
    } else if (request.body.cores == 'multiple') {
        numOfThreads_CPU = os.cpus().length;; 
    }

    // Ensure a file was sent
    if (request.file != undefined) {
        // Process PNGs
        if (request.file.mimetype == 'image/png'){ 
            // Using png.js parse through the PNG (which I can get as the buffer)
            var reader = new PNGReader(request.file.buffer);
            reader.parse(async function (error, png) {
                // Get the pixels and the properties of the PNG image
                let pixels = Array.from(png.pixels);
                let width = png.width;
                let height = png.height;
                
                try {

                    // Transform the image
                    let {
                        transformedImage,
                        timeTook
                    } = await imagePartsPreProcessing(pixels, request.body.type, numOfThreads_CPU);
        
                    // This part of the code was generated with ChatGTP, since I had no knowledge of how to recontruct the image
                    // Reconstruct the processed pixels
                    const newPixels = Buffer.concat(transformedImage.map(Buffer.from));
        
                    const newPng = new PNG({
                        width,
                        height
                    });
                    newPng.data = newPixels;
            
                    // Convert the new PNG image to a buffer and then to a Base64 string
                    const chunks = [];
                    newPng.pack().on('data', chunk => chunks.push(chunk)).on('end', () => {
                        const buffer = Buffer.concat(chunks);
                        const base64Image = buffer.toString('base64');
                        const dataUri = `data:image/png;base64,${base64Image}`;
            
                        // Render the new EJS with the newly formed image
                        response.render('processedImage', {
                            image: dataUri,
                            time: timeTook,
                            workers: numOfThreads_CPU
                        });
                    });
                // Manage the errors if there are some
                } catch (error) {
                    console.log(error);
                    response.status(500).render('500', {
                        filetype: false
                    });
                }
            });
        // Process JPEGs
        } else if (request.file.mimetype == 'image/jpeg'){
            // Decode the image with the library
            const jpegData = jpeg.decode(request.file.buffer);
    
            // Get the important information from the image
            pixels = Array.from(jpegData.data);
            width = jpegData.width;
            height = jpegData.height;
    
            try {
                // Transform the image
                let {
                    transformedImage,
                    timeTook
                } = await imagePartsPreProcessing(pixels, request.body.type, numOfThreads_CPU);
    
                // Rebuild the JPEG Image with the library functions
                const newPixels = new Uint8Array(pixels.length);
                let offset = 0;
    
                for (let i = 0; i < transformedImage.length; i++) {
                    const part = transformedImage[i];
                    newPixels.set(part, offset);
                    offset += part.length;
                }
                 const rawImageData = {
                     data: newPixels,
                     width: width,
                     height: height
                 };
                 const jpegImageData = jpeg.encode(rawImageData, 100); // Quality from 0 to 100
                 const base64Image = jpegImageData.data.toString('base64');
                 const dataUri = `data:image/jpeg;base64,${base64Image}`;
    
                 // Render the new EJS with the newly formed image
                 response.render('processedImage', {
                     image: dataUri, 
                     time: timeTook, 
                     workers: numOfThreads_CPU
                 });
    
            } catch (error) {
                console.log(error);
                response.status(500).render('500', {
                    filetype: false
                });
            }
        } else {
            response.status(500).render('500', {
                filetype: true
            });
        }
    } else {
        response.status(500).render('500', {
            filetype: false
        });
    }

};

/**
 * Renders the home page of the website
 *
 * @param request JS method to request data
 * @param response JS method to respond with data
 * @return 
 */
exports.getHomePage = (request, response, next) => {
    response.render('homePage');
};
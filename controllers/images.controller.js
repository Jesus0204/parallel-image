const { Worker } = require('worker_threads');
const PNGReader = require('png.js');
const { PNG } = require('pngjs');
const moment = require('moment');
const os = require('os');

function createWorker(pixels, type) {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./parallel.js');

        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0)
                reject(new Error(`Worker stopped with exit code ${code}`));
        });

        worker.postMessage({pixels, type});
    });
}

exports.processImage = async (request, response, next) => {
    
    // Using png.js parse through the PNG (which I can get as the buffer)
    var reader = new PNGReader(request.file.buffer);
    reader.parse(async function (png) {
        try {
            // Get the pixels and the properties of the PNG image
            let pixels = Array.from(png.pixels);
            let width = png.width;
            let height = png.height;
    
            const numOfThreads_CPU = os.cpus().length;; // Number of cores to use
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
                const transformedImage = await Promise.all(parts.map(part => createWorker(part, request.body.type)));
                // Use moment to get the date after the processing
                let end = moment();

                // Get the time it took
                console.log(end - start + ' ms');
    
                // This part of the code was generated with ChatGTP, since I had no knowledge of how to recontruct the image
                // Reconstruct the PNG image with modified pixels
    
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
                        image: dataUri
                    });
                });
            } catch (error) {
                console.log(error);
                response.status(500).render('500');
            }
        } catch (error) {
            console.log(error);
            response.status(500).render('500');
        }

    });

};

exports.getHomePage = (request, response, next) => {
    response.render('homePage');
};
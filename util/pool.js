const Piscina = require('piscina');
const os = require('os');

/**
 * Creates the thread Pool with the library Piscina
 * 
 * Calls the file with the function that will process the data, and defines the maximum number of threads
 * Exports the pool so it can be used in another file
 *
 * @return 
 */
const piscina = new Piscina({
    filename: './util/parallel.js',
    maxThreads: os.cpus().length
});

module.exports = piscina;
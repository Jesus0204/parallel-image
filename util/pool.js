const Piscina = require('piscina');
const os = require('os');

const piscina = new Piscina({
    filename: './util/parallel.js',
    maxThreads: os.cpus().length
});

module.exports = piscina;
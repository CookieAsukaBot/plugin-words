const path = require('path');

module.exports = {
    name: 'Words',
    version: '1.0.0',
    cookiebot: '1.0.0',
    description: 'Wikipedia, Urbandictionary',
    dependencies: ['wikijs', 'urban-dictionary'],
    enabled: true,
    async plugin (bot) {
        // Cargar comandos
        const commandPath = path.join(__dirname, 'commands');
        require('../../events/commands')(bot, commandPath);
    }
};

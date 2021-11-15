const path = require('path');

module.exports = {
    name: 'Words',
    version: '1.0.1',
    cookiebot: '1.0.0',
    description: 'Plugin para obtener definiciones y artículos de Wikipedia.',
    dependencies: ['wikijs', 'urban-dictionary', '@jodacame/raejs'],
    enabled: true,
    async plugin (bot) {
        // Cargar comandos
        const commandPath = path.join(__dirname, 'commands');
        require('../../events/commands')(bot, commandPath);
    }
};

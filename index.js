const path = require('path');

module.exports = {
    name: 'Words',
    version: '1.2.1',
    cookiebot: '1.4.0',
    description: 'Plugin para obtener definiciones, traducciones y artículos de Wikipedia.',
    dependencies: ['wikijs', 'urban-dictionary', '@jodacame/raejs', 'translate-google'],
    enabled: true,
    async plugin (bot) {
        require('../../events/commands')(bot, path.join(__dirname, 'commands'));
    }
}

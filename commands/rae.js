const { MessageEmbed } = require('discord.js');
const raejs = require('@jodacame/raejs');

const cleanWords = (text) => {
    return text
        .replace(/&#xE1;/g, 'á')
        .replace(/&#xE9;/g, 'é')
        .replace(/&#xED;/g, 'í')
        .replace(/&#xF3;/g, 'ó')
        .replace(/&#xFA;/g, 'ú')
        .replace(/&#xF1;/g, 'ñ')
        .replace(/&#x2016/g, '||||');
};

module.exports = {
	name: 'rae',
    category: 'Words',
	description: 'Muestra la definición de una palabra en la RAE.',
    usage: '[búsqueda]',
    cooldown: 3,
	async execute (message, args, bot) {
        // Obtener query
        const query = args.join(' ').trim().toLowerCase();
        // Comprobar query
        if (query.length <= 0) return message.reply({
            content: `Uso del comando: ${bot.prefix}${this.name} ${this.usage}`
        });

        // Buscar
        const res = await raejs.search(query);

        // Comprobar si hay un error
        if (res.error) return message.reply({
            content: `No se encontró la definición \`${query}\`.`
        });

        // Modelo
        let definition = {
            from: 'RAE Diccionario',
            icon: 'https://pbs.twimg.com/profile_images/1111384411948363777/Y3ek0deU_200x200.png',
            url: '',
            title: res.results[0].header,
            text: ''
        };

        // Agregar definiciones
        res.results[0].definition.forEach(def => {
            definition.text += `\n${cleanWords(def)}`
        });

        // Embed
        let embed = new MessageEmbed()
            .setColor(process.env.BOT_COLOR)
            .setFooter({
                text: `Pedido por ${message.author.username}`,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            })
            .setAuthor({
                name: definition.from,
                iconURL: definition.icon,
                url: definition.url
            })
            .setTitle(definition.title)
            .setDescription(definition.text);

        // Responder
        message.channel.send({
            embeds: [embed]
        });
	}
};

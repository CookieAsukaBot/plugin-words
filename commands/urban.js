const { MessageEmbed } = require('discord.js');
const urban = require('urban-dictionary');

const splitInMessages = require('../utils/splitInMessages');

const sortByLikes = (results) => {
    return results.sort((a, b) => b.thumbs_up - a.thumbs_up);
};

module.exports = {
	name: 'urban',
    category: 'Words',
	description: 'Muestra una definición de Urban.',
    usage: '[búsqueda]',
    cooldown: 3,
	async execute (message, args, bot) {
        // Obtener query
        const query = args.join(' ').trim();
        // Comprobar query
        if (query.length <= 0) return message.reply({
            content: `Uso del comando: ${bot.prefix}${this.name} ${this.usage}`
        });

        // Buscar
        await urban.define(query)
            .then(results => {
                // Sort
                results = sortByLikes(results);

                // Modelo
                let definition = {
                    from: 'Urban Dictionary',
                    icon: 'https://img.utdstc.com/icon/4af/833/4af833b6befdd4c69d7ebac403bfa087159601c9c129e4686b8b664e49a7f349',
                    url: results[0].permalink,
                    title: results[0].word,
                    text: results[0].definition
                };

                // Embed
                let embed = new MessageEmbed()
                    .setColor(process.env.BOT_COLOR)
                    .setFooter(`Pedido por ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
                    .setTitle(definition.title)

                // Agregar definiciones extra
                if (results[1]) definition.text += `\n\n${results[1].definition}`;

                if (definition.text.length >= 1500) {
                    // Partir info.
                    let splitted = splitInMessages(definition.text);

                    splitted.forEach(async (text, index) => {
                        // Comprobar si no es el primer mensaje
                        if (index >= 1) text = `...${text}`;

                        // Embed
                        embed.setAuthor(`${definition.from} (${index + 1}/${splitted.length})`, definition.icon, definition.url);
                        embed.setDescription(text);

                        // Responder
                        await message.channel.send({
                            embeds: [embed]
                        });
                    });
                } else {
                    embed.setDescription(definition.text);
                    embed.setAuthor(definition.from, definition.icon, definition.url);
                    // Responder
                    message.channel.send({
                        embeds: [embed]
                    });
                };
            })
            .catch(err => {
                message.reply({
                    content: `No se encontró la definición \`${query}\`.`
                });
            });
	}
};

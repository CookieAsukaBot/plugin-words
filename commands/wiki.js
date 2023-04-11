const {EmbedBuilder} = require('discord.js');
const wiki = require('wikijs').default;

const splitInMessages = require('../utils/splitInMessages');

module.exports = {
	name: 'wiki',
    category: 'Words',
	description: 'Muestra un artículo de Wikipedia.',
    usage: '[búsqueda]',
    cooldown: 3,
    aliases: ['wikipedia'],
	async execute (message, args, bot) {
        // Obtener query
        const query = args.join(' ').trim();
        // Comprobar query
        if (query.length <= 0) return message.channel.send({
            content: `**${message.author.username}**, uso del comando: ${bot.prefix}${this.name} ${this.usage}`
        });

        // Buscar
        await wiki({ apiUrl: 'https://es.wikipedia.org/w/api.php' }).page(query)
            .then(async page => {
                // Model
                const article = {
                    from: 'Wikipedia',
                    icon: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/wikipedia_logo_icon_168863.png',
                    url: page.fullurl,
                    title: page.title,
                    thumbnail: await page.mainImage(),
                    info: await page.summary()
                }

                // Embed
                let embed = new EmbedBuilder()
                    .setColor(process.env.BOT_COLOR)
                    .setFooter({
                        text: `Pedido por ${message.author.username}`,
                        iconURL: message.author.displayAvatarURL({ dynamic: true })
                    })
                    .setTitle(article.title)
                    .setThumbnail(article.thumbnail);

                // Comprobar longitud
                if (article.info.length >= 1500) {
                    // Partir info.
                    let splitted = splitInMessages(article.info);

                    splitted.forEach(async (text, index) => {
                        // Comprobar si no es el primer mensaje
                        if (index >= 1) text = `...${text}`;

                        // Embed
                        embed.setAuthor({
                            name: `${article.from} (${index + 1}/${splitted.length})`,
                            iconURL: article.icon,
                            url: article.url
                        });
                        embed.setDescription(text);

                        // Responder
                        await message.channel.send({
                            embeds: [embed]
                        });
                    });
                } else {
                    embed.setAuthor({
                        name: definition.from,
                        iconURL: definition.icon,
                        url: definition.url
                    });
                    embed.setDescription(article.info);

                    // Responder
                    return message.channel.send({
                        embeds: [embed]
                    });
                }
            })
            .catch(err => {
                // Comprobar resultado
                message.channel.send({
                    content: `**${message.author.username}**, ocurrió un error al encontrar el artículo \`${query}\`.`
                });
            });
	}
}

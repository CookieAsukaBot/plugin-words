const { MessageEmbed } = require('discord.js');
const wiki = require('wikijs').default;

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
        if (query.length <= 0) return message.reply({
            content: `Uso del comando: ${bot.prefix}${this.name} ${this.usage}`
        });

        // Buscar
        await wiki({ apiUrl: 'https://es.wikipedia.org/w/api.php' }).page(query)
            .then(async page => {
                // Model
                const article = {
                    icon: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/wikipedia_logo_icon_168863.png',
                    url: page.fullurl,
                    title: page.title,
                    thumbnail: await page.mainImage(),
                    info: await page.summary()
                };

                // Embed
                let embed = new MessageEmbed()
                    .setColor(process.env.BOT_COLOR)
                    .setFooter(`Pedido por ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
                    .setAuthor('Wikipedia', article.icon, article.url)
                    .setTitle(article.title)
                    .setThumbnail(article.thumbnail)
                    .setDescription(article.info); // Se necesita comprobar la longitud

                // Responder
                return message.channel.send({
                    embeds: [embed]
                });
            })
            .catch(err => {
                // Comprobar resultado
                return message.reply({
                    content: `Ocurrió un error al encontrar el artículo \`${query}\`.`
                });
            });
	}
};

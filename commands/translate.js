const { MessageEmbed } = require('discord.js');
const translate = require('translate-google');

module.exports = {
	name: 'translate',
    category: 'Words',
	description: 'Traductor de inglés o español.',
    usage: '[texto a traducir]',
    aliases: ['traducir', 'traductor', 'traduce'],
    cooldown: 3,
	async execute (message, args, bot) {
        // Comprobar
        if (!args) return message.reply(`${bot.prefix}${this.name} ${this.usage}`);

        // Variables
        let phrase = args.join(' ').trim();
        if (phrase.length >= 501) return message.reply("Has sobrepasado el límite de caracteres (500).");

        // Embed
        let embed = new MessageEmbed()
            .setColor(process.env.BOT_COLOR)
            .setAuthor("Traductor", "https://www.google.com/favicon.ico")
            .setFooter(`Pedido por ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription("Elige una opción:\n\n1️⃣ Del **Español** al **Inglés** 🇲🇽 ➡ 🇺🇸\n\n2️⃣ Del **Inglés** al **Español** 🇺🇸 ➡ 🇲🇽");

        // Responder
        message.channel.send({ embeds: [embed] })
            .then(async msg => {
                await msg.react('1️⃣');
                await msg.react('2️⃣');

                // Collector messages
                let collector = await msg.createReactionCollector({
                    filter: (reaction, user) => (reaction.emoji.name === '1️⃣' || reaction.emoji.name === '2️⃣') && user.id == message.author.id,
                    time: 30 * 1000, // 30 segundos
                });

                // Variables
                let output, langText;
                let langs = {};

                collector.on('collect', async (reaction) => {
                    if (reaction.emoji.name === "1️⃣") {
                        langText = "🇲🇽 ➡ 🇺🇸";
                        langs.from = "es";
                        langs.to = "en";
                    } else if (reaction.emoji.name === "2️⃣") {
                        langText = "🇺🇸 ➡ 🇲🇽";
                        langs.from = "en";
                        langs.to = "es";
                    };

                    // Petición
                    let res = await translate(phrase, langs); // wip: ¿Qué pasa si no devuelve nada?
                    output = `*${phrase}*\n\n${langText}\n\n**${res}**`;

                    // Detener
                    embed.setDescription(output);
                    await collector.stop();
                });

                // Remover las reacciones al terminar
                collector.on('end', async collected => {
                    // Comprobar reacción
                    if (!langText) {
                        output = `Se necesita de elegir una opción para traducir el mensaje.\nIntenta de nuevo.`;
                        embed.setDescription(output);
                    };

                    await msg.reactions.removeAll();
                    await msg.edit({ embeds: [embed] });
                });
            });
	}
};

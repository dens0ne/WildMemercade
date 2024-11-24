const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pollo')
    .setDescription('Consomeado')
    .addStringOption(obra =>
  		obra.setName('obra')
        .setAutocomplete(true)
  			.setDescription('La obra maestra')
  			.setRequired(true)),
  async execute(interaction) {
    const obra = interaction.options.getString('obra');
    // Load pics from json.
    fs.readFile("./assets/framedata.json", "utf8", (err, jsonObject) => {
      if (err) {
        return interaction.reply('Mamo...');
      }
      try {
        let data = JSON.parse(jsonObject);
        data = data.Pollo;
        const titulo = obra;
        const pic = data[obra].pic
        // // Get total number of items
        // let total = Object.keys(data).length;
        // // console.log(total)
        // let random_index = Math.floor(Math.random() * total);
        // // console.log(random_index)
        // let index = 0;
        // let pic = '';
        // let titulo = '';
        // for (var key in data) {
        //   // console.log(key);
        //   // console.log(index);
        //   if (index == random_index) {
        //     // console.log(data[key]);
        //     titulo = key;
        //     pic = data[key].pic;
        //   }
        //   index++;
        // }
const embed = new MessageEmbed()
  .setColor('#0x1a2c78')
  .setTitle('Bienvenido a la galeria de Pollo')
          // .setURL('https://www.snk-corp.co.jp/us/games/kof-xv/characters/characters_' + lowerCaseChar + '.php')
          // .setAuthor({ name: escapedMoves, iconURL: 'https://pbs.twimg.com/profile_images/1150082025673625600/m1VyNZtc_400x400.png', url: 'https://docs.google.com/spreadsheets/d/1uPQlyMB8pJhCILH0BYZNhJAO2cNq0aEZt_ifYQ6-uiI' })
          // .setDescription('Move input')
          // .setThumbnail('https://www.snk-corp.co.jp/us/games/kof-xv/img/main/top_slider' + charNo + '.png')
          .addFields(
            { name: 'Esta obra se titula...', value: titulo, inline: true }
          ).setFooter({ text: 'Hecho por y para los miembros mas apegados de la comunidad. Todo es de chill...' });
embed.setImage(pic);
        return interaction.reply({embeds: [embed]});
      } catch (err) {
        console.log("Error:", err);
        return interaction.reply('Ya no lele pancha? Trono el bot...');
      }
    });
  }
};
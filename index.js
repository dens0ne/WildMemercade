// Require the necessary discord.js classes
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const keepAlive = require('./server');
const path = require('path');
const talkedRecently = new Set();
// const moment = require('moment');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const appCommandFiles = fs.readdirSync('./commands/application').filter(file => file.endsWith('.js'));
const guildCommandFiles = fs.readdirSync('./commands/guild').filter(file => file.endsWith('.js'));

for (const file of appCommandFiles) {
  const command = require(`./commands/application/${file}`);
  client.commands.set(command.data.name, command);
}
for (const file of guildCommandFiles) {
  const command = require(`./commands/guild/${file}`);
  client.commands.set(command.data.name, command);
}

let json = null
let characters = []
client.once('ready', () => {
  json = fs.readFileSync("./assets/framedata.json", 'utf8');
  json = JSON.parse(json);
  Object.keys(json).forEach(function (key) {
    // console.log(key)
    characters.push(key);
  })
  console.log('Ready!');
});
client.on('interactionCreate', async autocomplete => {
	if (!autocomplete.isAutocomplete()) return;
	if (autocomplete.commandName === 'berni'
     || autocomplete.commandName === 'corvo'
     || autocomplete.commandName === 'estile'
     || autocomplete.commandName === 'jeaguer'
     || autocomplete.commandName === 'lantors'
     || autocomplete.commandName === 'nexuz'
     || autocomplete.commandName === 'oso'
     || autocomplete.commandName === 'pollo'
     || autocomplete.commandName === 'rulo'
     || autocomplete.commandName === 'sheikuta') {
    let currentOption = autocomplete.options.getFocused(true);
    let currentName = currentOption.name;
    let currentValue = currentOption.value;

    const options = [];
    // if (currentName === "character") {
    //   characters.forEach((character) => {
    //     if (character.toLowerCase().includes(currentValue.toLowerCase())) {
    //       let charObj = {}
    //       charObj["name"] = character;
    //       charObj["value"] = character;
    //       if (options.length < 25) {
    //         options.push(charObj);
    //       }
    //     }
    //   })
    // }
    let character = autocomplete.commandName
    character = character.charAt(0).toUpperCase() + character.slice(1)
    // If move is focused.
    if (currentName === "obra") {
      // currentValue = autocomplete.options.getFocused()
      let moveObj = {}
      if (json[character] === undefined) {
        moveObj["name"] = 'Moves not found for specified character, try another character';
        moveObj["value"] = 'Moves not found for specified character, try another character';
        options.push(moveObj);
      } else {
        // Load move inputs.
        let moves = []
        Object.keys(json[character]).forEach(function (key) {
          let name = ''
          // Append move name if present.
          if (json[character][key]['NAME'] !== undefined && json[character][key]['NAME'] !== null) {
            name = ' - ' + json[character][key]['NAME'];
          }
          moves.push(key + name);
        })

        // Loop through moves and update when user types.
        moves.forEach((move, index) => {
          if (move.toLowerCase().includes(currentValue.toLowerCase())) {
            moveObj = {}
            // Trim move to only have input for object value.
            let input = move
            if (move.toLowerCase().includes('-')) {
             input = move.split("-")
            }
            moveObj["name"] = move;
            moveObj["value"] = (Array.isArray(input)) ? input[0].trim() : input;
            if (options.length < 25) {
              options.push(moveObj);
            }
          }
        }) 
      }
    }
		await autocomplete.respond(options); 
	}
  // Calculator autocomplete.
  if (autocomplete.commandName === 'calc' || autocomplete.commandName === 'punish') {
    let currentOption = autocomplete.options.getFocused(true);
    let currentName = currentOption.name;
    let currentValue = currentOption.value;

    const options = [];
    if (currentName === "attacking_character" || currentName === "defending_character") {
      characters.forEach((character) => {
        if (character.toLowerCase().includes(currentValue.toLowerCase())) {
          let charObj = {}
          charObj["name"] = character;
          charObj["value"] = character;
          if (options.length < 25) {
            options.push(charObj);
          }
        }
      })
    }
    const character = autocomplete.options.getString('attacking_character')
    // If move is focused.
    if (currentName === "attacking_move"  && character !== "") {
      // currentValue = autocomplete.options.getFocused()
      let moveObj = {}
      if (json[character] === undefined) {
        moveObj["name"] = 'Moves not found for specified character, try another character';
        moveObj["value"] = 'Moves not found for specified character, try another character';
        options.push(moveObj);
      } else {
        // Load move inputs.
        let moves = []
        Object.keys(json[character]).forEach(function (key) {
          let name = ''
          // Append move name if present.
          if (json[character][key]['NAME'] !== undefined && json[character][key]['NAME'] !== null) {
            name = ' - ' + json[character][key]['NAME'];
          }
          moves.push(key + name);
        })

        // Loop through moves and update when user types.
        moves.forEach((move, index) => {
          if (move.toLowerCase().includes(currentValue.toLowerCase())) {
            moveObj = {}
            // Trim move to only have input for object value.
            let input = move
            if (move.toLowerCase().includes('-')) {
             input = move.split("-")
            }
            moveObj["name"] = move;
            moveObj["value"] = (Array.isArray(input)) ? input[0].trim() : input;
            if (options.length < 25) {
              options.push(moveObj);
            }
          }
        }) 
      }
    }
		await autocomplete.respond(options); 
	}
});
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;
  
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});
client.on("ready", () => {
  // if (client.shard.id == 0)
        // console.log(`-- ${moment().utc().format('MMMM Do')}, ${moment().utc().format('hh:mm a')} --`);

  // console.log(`Shard ${client.shard.id} ready!`);
  console.log(`Hi, ${client.user.username} is now online and used in ${client.guilds.cache.size} servers.`);

  client.user.setPresence({
    status: "online",
    activities: [{
      name: 'YOLO? Use /frames or /help to get started. Now available on Android as "Frame of fighters"!'
    }],
  }); 
});
client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));
client.on('rateLimit', (info) => {
  console.log(`Rate limit hit ${info.timeDifference ? info.timeDifference : info.timeout ? info.timeout: 'Unknown timeout '}`)
})
// Keep bot alive.
keepAlive();
// setInterval(keepAlive, 1000 * 60 * 60);
// setInterval(keepAlive, 5000);
// Login to Discord with your client's token.
const token = process.env['DISCORD_TOKEN']
client.login(token);

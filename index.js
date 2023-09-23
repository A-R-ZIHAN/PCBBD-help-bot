const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits,ChannelType,ActionRowBuilder, ButtonBuilder, ButtonStyle,ActivityType } = require('discord.js');
require('dotenv').config()
const {expertRoles} = require('./info.json')

const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildMembers,
], });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

var  newThreadid;
var row;
var newThreadOwnerId;
client.on("threadCreate",async (newThread)=>{
	if(newThread.type == ChannelType.PublicThread){
		if (newThread.parentId == '1019653016120463400' || newThread.parentId == '1154436432769851560'){
		
		 const hardwareRoleButton = new ButtonBuilder()
		 .setCustomId('MentionHardwareRoleButton')
		 .setLabel(`Mentions @${Object.keys(expertRoles)[0]}`)
		 .setStyle(ButtonStyle.Secondary)

		 const artsRoleButton = new ButtonBuilder()
		 .setCustomId('MentionArtsRoleButton')
		 .setLabel(`Mentions @${Object.keys(expertRoles)[1]}`)
		 .setStyle(ButtonStyle.Secondary)
		 
		 const buildpcRoleButton = new ButtonBuilder()
		 .setCustomId('buildpcRoleButton')
		 .setLabel(`Build A PC`)
		 .setStyle(ButtonStyle.Secondary)
		 
		newThreadid = newThread.id
		row = 	 [new ActionRowBuilder().addComponents(hardwareRoleButton,artsRoleButton, buildpcRoleButton)]
		newThreadOwnerId = newThread.ownerId	

		client.once("messageCreate", async (message)=>{
			if(message.channelId == newThreadid){
				await message.reply({
					content: "Please click the required button to mention the type of experts or services you want to get help with!",
					components: row,
					ephemeral: true
				})
			}
		 })
		}
	 }

})





 client.on("interactionCreate",async (interaction)=>{
	if(interaction.isButton()){
		if(interaction.customId == 'MentionHardwareRoleButton' && interaction.user.id == newThreadOwnerId){

			await	interaction.channel.send({
				content:`<@&${'1154436920424804402'}>, this guy needs help!`,
			}).then(()=>{
				interaction.message.delete()
			})
		}else if(interaction.customId == 'MentionArtsRoleButton' && interaction.user.id == newThreadOwnerId){
			
			await interaction.channel.send({
				content:`<@&${'1154437163044307114'}>, this guy needs help!`,
				
			}).then(()=>{
				interaction.message.delete()
			})	
	}else if(interaction.customId == 'buildpcRoleButton' && interaction.user.id == newThreadOwnerId){
		await interaction.channel.send({
			content:`Please mention if you want to build with a monitor or not. Does it include any other peripherals like a keyboard, mouse, etc.? Also, don't forget to mention your budget. The <@&${'1154437163044307114'}> gang is on their way!`,
			
		}).then(()=>{
			interaction.message.delete()
		})	

	}else if(interaction.user.id != newThreadOwnerId){
			await interaction.reply({
				content:`You are not supposed to click this!`,
				ephemeral: true
			})
			return
		}
	}
 })


client.login(process.env.TOKEN);
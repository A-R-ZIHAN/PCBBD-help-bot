const {  Events } = require('discord.js');


module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}
	
			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
			}
		};

		// if(interaction.isButton()){
		// 	if(interaction.customId == 'MentionHardwareRoleButton'){
		// 	await	interaction.channel.send({
		// 			content:`<@&${'1154436920424804402'}>, this guy needs help!`,
		// 			ephemeral: false
		// 		})
		// 	await	interaction.deferUpdate()
		// 	}

		// 	if(interaction.customId == 'MentionArtsRoleButton'){
		// 		await interaction.channel.send({
		// 			content:`<@&${'1154437163044307114'}>, this guy needs help!`,
		// 			ephemeral: false
		// 		})
		// 		await interaction.deferUpdate()
		// 	}
		// }

		
	},
};
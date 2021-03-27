// @ts-check
const { CommandOptionType } = require('slash-create');
const Command = require('../structures/Command');
const { inspect } = require('util');
const fs = require('fs/promises');
const Discord = require('discord.js');

class WhitelistCommand extends Command {
	constructor(creator) {
		super(creator, {
			name: 'whitelist',
			description: 'Sends a help message',
			options: [
				{
					type: CommandOptionType.STRING,
					name: 'words',
					description: 'Words to whitelist',
					required: true,
				},
			],
			adminOnly: true,
			guildIDs: ['825168243043336253'],
		});
	}

	/** @param ctx {import('../structures/EnhancedCommandContext')} */
	async run(ctx) {
		// Splits the words and trims blank spaces
		// @ts-expect-error
		const words = ctx.options.words.split(',').array.forEach((e) => {
			e.trim();
		});

		// TODO: The Magic
	}
}

module.exports = WhitelistCommand;

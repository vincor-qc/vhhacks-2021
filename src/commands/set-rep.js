// @ts-check
const Command = require('../structures/Command');
const { CommandOptionType } = require('slash-create');
const sql = require('../database');

const Emojis = require('../emojis');

class SetRepCommand extends Command {
	constructor(creator) {
		super(creator, {
			name: 'set-rep',
			description: 'Sets the reputation of a user.',
			options: [
				{
					type: CommandOptionType.USER,
					name: 'user',
					description: 'The user to set the reputation of',
					required: true,
				},
				{
					type: CommandOptionType.INTEGER,
					name: 'reputation',
					description: "What to set the user's reputation to",
					required: true,
				},
			],
			adminOnly: true,
		});
	}

	/** @param ctx {import('../structures/EnhancedCommandContext')} */
	async exec(ctx) {
		const user = await ctx.fetchUserOption('user');
		const reputation = await ctx.options.reputation;

		if (reputation < 0 || reputation > 0x7fffffff) {
			return void ctx.send(`${Emojis.ERROR} Sorry, the amount of reputation provided was invalid, please try again.`, {
				ephemeral: true,
			});
		}

		await sql`
			INSERT INTO members (id, guild_id, color, background, reputation)
			VALUES (${user.id}, ${ctx.guildID}, null, null, ${reputation})
			ON CONFLICT (id, guild_id)
			DO UPDATE SET reputation = ${reputation}
		`
			.then(() => ctx.send(`${Emojis.CHECK} Successfully updated the user's reputation.`, { ephemeral: true }))
			.catch(() =>
				ctx.send(`${Emojis.ERROR} An error occurred when updating the user's reputation, please try again.`, {
					ephemeral: true,
				}),
			);
	}
}

module.exports = SetRepCommand;

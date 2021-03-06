// @ts-check
const { Client, Intents } = require('discord.js');
const EventHandler = require('../structures/EventHandler');
const { join } = require('path');
const { GatewayServer } = require('slash-create');
const SchoolmasterSlashCreator = require('./SchoolmasterSlashCreator');
const SettingsManager = require('../structures/SettingsManager');

class SchoolmasterClient extends Client {
	enableTranscription = true;
	settingsManager = new SettingsManager();

	constructor() {
		super({
			allowedMentions: {
				parse: ['users'],
			},
			ws: {
				intents: Intents.ALL,
			},
		});

		this.events = new EventHandler(this);

		this.slashCreator = new SchoolmasterSlashCreator(this, {
			applicationID: process.env.APPLICATION_ID,
			token: process.env.TOKEN,
		})
			// @ts-expect-error INTERACTION_CREATE is undocumented.
			.withServer(new GatewayServer((handler) => this.ws.on('INTERACTION_CREATE', handler)));

		this.ownerIDs = process.env.OWNERS.split(',');
	}

	async start() {
		await this.events.loadAll(join(__dirname, '..', 'events'));
		console.log(`Loaded ${this.events.registry.size} events!`);

		this.slashCreator
			.registerCommandsIn(join(__dirname, '..', 'commands'))
			.on('debug', (msg) => console.log(`[SlashCreator] Debug log: `, msg))
			.syncCommands({ deleteCommands: false });
		console.log(`Loaded and synced ${this.slashCreator.commands.size} commands!`);

		return this.login(process.env.TOKEN);
	}

	/** @param user {import('discord.js').UserResolvable} */
	isOwner(user) {
		const id = this.users.resolveID(user);
		return this.ownerIDs.includes(id);
	}
}

module.exports = SchoolmasterClient;

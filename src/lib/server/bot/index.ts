import { Chat, InlineKeyboardButton, InlineKeyboardMarkup } from 'telescript'
import { BotClient } from './Client'
import { TELEGRAM_BOT_TOKEN } from '$env/static/private'

export const bot = new BotClient({
	token: TELEGRAM_BOT_TOKEN
})

export async function getUserProfilePhoto(userId: number) {
	const { photos } = await bot.getUserProfilePhotos(userId, { limit: 1 })
	if (!photos.length) return
	const photo = photos[0][0]
	const file = await bot.getFile(photo.fileId)

	const res = await fetch(`https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${file.filePath}`)
	const blob = await res.blob()
	const buffer = await Buffer.from(await blob.arrayBuffer())

	return buffer
}

bot.on('message', async (message) => {
	if (!message.text) return

	if (message.text?.startsWith('/start')) {
		const startParam = message.text.slice(7)

		// if (startParam === 'auth') {
		// 	const user = await database.user.findUnique({
		// 		where: {
		// 			id: message.sender!.id
		// 		}
		// 	})

		// 	if (!user) return

		// 	const sentMessage = await message.chat.sendMessage('You are trying to log into the standalone version. Do not share the link with anyone!', {
		// 		replyMarkup: new InlineKeyboardMarkup({
		// 			inlineKeyboard: [
		// 				[new InlineKeyboardButton({
		// 					text: 'Log in',
		// 					url: `${process.env.APP_BASE_URL}/auth?code=${user?.authCode}&user_id=${message.sender!.id}&message_id=${message.id + 1}`
		// 				})]
		// 			]
		// 		})
		// 	})
		// }

		if (!startParam) {
			// @ts-expect-error problem with generics
			// TODO
			await sendGreetingsMessage(message.chat)
		}
	}
})

async function sendGreetingsMessage(chat: Chat) {
	await chat.sendSticker('CAACAgIAAxkBAAIGB2VG4pG-t0yX8PvBtOQTXPH-pl0nAAJCEAACM8UpSZAO1BGnKkqCMwQ')
	await chat.sendMessage(`\
Hi! Here you can try playing Campfire. Please note that it is still in development and there are hell lot of \
bugs and missing features.

Anyway, I'm trying really hard to make it as fun and cool as possible. There are a lot of technical complications, \
so fun part developing is not as fast as I would like it to be. But still, I hope I will be able to build \
a cool and cozy experience for you, as I did before in Discord! 🧡`, {
		replyMarkup: new InlineKeyboardMarkup()
			.setKeyboard([[
				new InlineKeyboardButton({
					text: 'Launch Campfire',
					webApp: {
						url: 'https://campfire.sadzep.me/'
					}
				})
			]])
	})
}

// @ts-expect-error fix error later
bot.on('preCheckoutQuery', (preCheckoutQuery: PreCheckoutQuery) => {
	bot.answerPreCheckoutQuery(preCheckoutQuery.id, true)
})
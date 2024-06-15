import { error, type ParamMatcher, type RequestEvent } from '@sveltejs/kit'
import { database } from '$lib/server/database'
import { getUserProfilePhoto } from '$lib/server/bot'

export async function GET(event: RequestEvent) {
	const profilePhotoBuffer = await getUserProfilePhoto(Number(event.params.userId)).catch(() => {
		throw error(404)
	})

	return new Response(profilePhotoBuffer, {
		headers: {
			'Content-Type': 'image/png'
		}
	})
}
import { FishableComponent } from '$lib/items/components'
import { Item } from '$lib/items/Item'

export default new Item({
	id: 'rainbowTrout',
	components: [
		new FishableComponent({
			chanceWeight: 0.2
		})
	]
})
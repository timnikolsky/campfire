<script lang="ts">
	import { dev } from '$app/environment';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { appManager } from '$lib/AppManager';
	import { ClientUser } from '$lib/clientUser.svelte';
	import { AppLoader, Header, NavigationBar, Snackbars } from '$lib/components';
	import { request } from '$lib/request';
	import { supabase } from '$lib/supabase';
	import { tick } from 'svelte';
	import { fade } from 'svelte/transition';

	let { children } = $props()
	let clientDataLoaded = $state(false)

	if (appManager.isStandalone) {
		if (!localStorage.getItem('token')) {
			goto('login')
		}
	}

	if (page.url.pathname !== '/login') {
		request('getMe').then(async (data) => {
			ClientUser.init(data)
			await tick()
			clientDataLoaded = true
		})
		.catch(() => {
			localStorage.removeItem('token')
			goto('login')
		})
	}

	// if (!$clientUser && $page.url.pathname !== '/login') {
	// 	request('getMe').then(async (userData) => {
	// 		userData.lastFishedAt = userData.lastFishedAt ? new Date(userData.lastFishedAt) : undefined
	// 		clientUser.set(userData)
	// 		inventory.set(userData.inventoryItems)
	// 		await tick()

	// 		
	// 	})
	// }

	// onNavigate(async (navigation) => {
	// 	if (!('startViewTransition' in document)) return

	// 	return new Promise((resolve) => {
	// 		document.startViewTransition(async () => {
	// 			resolve()
	// 			await navigation.complete
	// 		})
	// 	})
	// })

	if (!appManager.isStandalone) {
		const channel = supabase.channel(`notifications-${window.Telegram.WebApp.initDataUnsafe.user!.id}`)

		channel
			.on('broadcast', { event: 'n' }, (notification) => {
				// snackbar({
				// 	text: notification.payload.message
				// })
			})
			.subscribe()
	}
</script>

<svelte:head>
	<link rel="manifest" href={`${base}/${dev ? 'site-dev' : 'site'}.webmanifest`} />
	<title>Campfire</title>
</svelte:head>

<div class="app">
	{#if clientDataLoaded}
		<Header />
		{#key page.route}
			<main class="main" transition:fade={{ duration: 200 }}>
				{@render children()}
			</main>
		{/key}
		<NavigationBar />
		<Snackbars />
	{:else}
		<AppLoader />
	{/if}
</div>

<style lang="scss">
	.app {
		height: 100%;
		display: flex;
		flex-direction: column;
		background: var(--background-secondary);
		position: relative;
	}

	.main {
		position: relative;
		flex: 1;
		overflow-y: scroll;
	}
</style>

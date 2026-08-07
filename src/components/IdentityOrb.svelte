<script>
	import { onMount } from 'svelte';

	let whoami = $state(null);

	let authenticated = $derived(whoami?.authenticated === true);

	let pictureUrl = $derived(
		authenticated && whoami?.picture?.startsWith('https://') ? whoami.picture : null
	);

	let initials = $derived.by(() => {
		if (!authenticated || !whoami) return '';
		const source = (whoami.name || whoami.email || '').trim();
		if (!source) return '?';
		const parts = source.split(/[\s@.]+/).filter(Boolean);
		if (parts.length >= 2) {
			return (parts[0][0] + parts[1][0]).toUpperCase();
		}
		return source.slice(0, 2).toUpperCase();
	});

	let caption = $derived(
		authenticated
			? whoami?.displayName || whoami?.name || whoami?.email?.split('@')[0] || 'signed in'
			: 'LOG IN'
	);

	let ariaLabel = $derived(
		authenticated
			? `Signed in as ${whoami?.name || whoami?.email || whoami?.displayName || 'user'}`
			: 'Log in'
	);

	onMount(() => {
		let cancelled = false;

		fetch('/api/auth/whoami', { credentials: 'same-origin' })
			.then((res) => (res.ok ? res.json() : null))
			.then((data) => {
				if (!cancelled && data) whoami = data;
			})
			.catch(() => {});

		return () => {
			cancelled = true;
		};
	});
</script>

<a class="orb" href="https://kodexarg.com/me" aria-label={ariaLabel}>
	<span class="orb__circle" aria-hidden="true">
		{#if authenticated}
			{#if pictureUrl}
				<img class="orb__picture" src={pictureUrl} alt="" />
			{:else}
				<span class="orb__initials">{initials}</span>
			{/if}
		{:else}
			<svg
				class="orb__icon"
				viewBox="0 0 24 24"
				width="14"
				height="14"
				fill="none"
				stroke="currentColor"
				stroke-width="1.75"
				stroke-linecap="round"
				stroke-linejoin="round"
				focusable="false"
			>
				<circle cx="12" cy="8" r="3.25" />
				<path d="M5.5 19.5c1.2-3.2 3.4-4.75 6.5-4.75s5.3 1.55 6.5 4.75" />
			</svg>
		{/if}
	</span>
	<span class="orb__caption" class:is-login={!authenticated}>{caption}</span>
</a>

<style>
	.orb {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.28rem;
		text-decoration: none;
		color: inherit;
		user-select: none;
		-webkit-user-select: none;
	}

	.orb:focus-visible {
		outline: 1px solid var(--orange-500);
		outline-offset: 3px;
		border-radius: 2px;
	}

	.orb__circle {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.55rem;
		height: 1.55rem;
		border-radius: 50%;
		border: 0.125rem solid var(--orange-500);
		background: rgba(12, 11, 9, 0.35);
		overflow: hidden;
		flex-shrink: 0;
	}

	.orb__icon {
		color: var(--orange-300);
		display: block;
	}

	.orb__picture {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.orb__initials {
		font-family: var(--font-mono);
		font-size: 0.5rem;
		font-weight: 500;
		letter-spacing: 0.04em;
		line-height: 1;
		color: var(--orange-300);
		text-transform: uppercase;
	}

	.orb__caption {
		font-family: var(--font-mono);
		font-size: 0.58rem;
		line-height: 1.1;
		letter-spacing: 0.06em;
		color: var(--orange-300);
		max-width: 5.5rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-align: center;
		opacity: 0.85;
	}

	.orb__caption.is-login {
		text-transform: uppercase;
		letter-spacing: 0.1em;
		opacity: 0.75;
	}
</style>

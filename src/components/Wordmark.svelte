<script>
	let {
		size = '1.5rem',
		href = undefined,
		tint = true,
		static: isStatic = false
	} = $props();
</script>

{#snippet mark()}
	<span class="wm" class:static={isStatic} style:--wm-size={size}>
		<span class="word"
			>kodex<span class="cap" class:tint>A</span>rg</span
		>{#if !isStatic}<span class="cursor" aria-hidden="true"></span>{/if}
	</span>
{/snippet}

{#if href}
	<a {href} target="_blank" rel="noopener noreferrer" class="wm-link">{@render mark()}</a>
{:else}
	{@render mark()}
{/if}

<style>
	.wm-link {
		text-decoration: none;
		display: inline-block;
		user-select: none;
		-webkit-user-select: none;
	}

	.wm {
		display: inline-flex;
		align-items: baseline;
		position: relative;
		font-family: var(--font-mono);
		font-size: var(--wm-size);
		line-height: 1.1;
		color: var(--cream-100);
		user-select: none;
		-webkit-user-select: none;
		padding-bottom: 0.18em;
		background-image: linear-gradient(
			90deg,
			transparent 0%,
			var(--orange-glow) 28%,
			var(--orange-500) 50%,
			var(--orange-glow) 72%,
			transparent 100%
		);
		background-repeat: no-repeat;
		background-position: bottom left;
		background-size: 100% 1.5px;
	}

	.static {
		background: none;
	}

	.static.wm {
		background-image: linear-gradient(
			90deg,
			transparent 0%,
			var(--orange-glow) 35%,
			var(--orange-glow) 65%,
			transparent 100%
		);
		background-repeat: no-repeat;
		background-position: bottom left;
		background-size: 100% 1px;
	}

	.word {
		letter-spacing: 0.01em;
	}

	.cap.tint {
		color: var(--orange-300);
	}

	.cursor {
		display: inline-block;
		width: 1ch;
		height: 1em;
		margin-left: 0.15ch;
		align-self: center;
		background: var(--cream-100);
		animation: blink 1s steps(1) infinite;
	}

	@keyframes blink {
		0%,
		50% {
			opacity: 1;
		}
		50.01%,
		100% {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.cursor {
			animation: none;
			opacity: 0.85;
		}
	}
</style>

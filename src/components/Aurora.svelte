<script>
	const BASE_SPOTS = 2;
	const RARE_THIRD_CHANCE = 0.18;
	const RADIUS_MIN = 38;
	const RADIUS_MAX = 64;
	const HUE_MIN = 28;
	const HUE_MAX = 42;
	const ALPHA_MIN = 0.1;
	const ALPHA_MAX = 0.2;
	const SAT = 92;
	const LIGHT = 52;

	const DRIFT_RANGE = 7;
	const DRIFT_MIN = 34;
	const DRIFT_MAX = 52;
	const BREATHE_MIN = 11;
	const BREATHE_MAX = 17;

	const REGION_BANDS = [
		{ x: 26, y: 32 },
		{ x: 74, y: 70 },
		{ x: 52, y: 20 }
	];
	const ANCHOR_JITTER = 16;

	const rand = (min, max) => min + Math.random() * (max - min);
	const sign = () => (Math.random() < 0.5 ? -1 : 1);

	function spawn() {
		const count = BASE_SPOTS + (Math.random() < RARE_THIRD_CHANCE ? 1 : 0);
		return Array.from({ length: count }, (_, i) => {
			const band = REGION_BANDS[i];
			return {
				x: band.x + rand(-ANCHOR_JITTER, ANCHOR_JITTER),
				y: band.y + rand(-ANCHOR_JITTER, ANCHOR_JITTER),
				r: rand(RADIUS_MIN, RADIUS_MAX),
				hue: rand(HUE_MIN, HUE_MAX),
				alpha: rand(ALPHA_MIN, ALPHA_MAX),
				dx: rand(DRIFT_RANGE * 0.4, DRIFT_RANGE) * sign(),
				dy: rand(DRIFT_RANGE * 0.4, DRIFT_RANGE) * sign(),
				driftDur: rand(DRIFT_MIN, DRIFT_MAX),
				driftDelay: -rand(0, DRIFT_MAX),
				breatheDur: rand(BREATHE_MIN, BREATHE_MAX),
				breatheDelay: -rand(0, BREATHE_MAX)
			};
		});
	}

	const spots = spawn();
</script>

<div class="aurora" aria-hidden="true">
	{#each spots as s}
		<span
			class="spot"
			style:--x="{s.x}%"
			style:--y="{s.y}%"
			style:--r="{s.r}vmax"
			style:--hue={s.hue}
			style:--alpha={s.alpha}
			style:--dx="{s.dx}vmax"
			style:--dy="{s.dy}vmax"
			style:--sat="{SAT}%"
			style:--light="{LIGHT}%"
			style:--drift-dur="{s.driftDur}s"
			style:--drift-delay="{s.driftDelay}s"
			style:--breathe-dur="{s.breatheDur}s"
			style:--breathe-delay="{s.breatheDelay}s"
		></span>
	{/each}
</div>

<style>
	.aurora {
		position: fixed;
		inset: 0;
		z-index: -1;
		overflow: hidden;
		pointer-events: none;
		--aurora-void: #000000;
		background:
			linear-gradient(
				to top,
				var(--aurora-void) 0%,
				rgba(0, 0, 0, 0.72) 20%,
				rgba(0, 0, 0, 0) 52%
			),
			radial-gradient(
				118% 88% at 50% 38%,
				rgba(0, 0, 0, 0) 0%,
				rgba(0, 0, 0, 0.55) 64%,
				var(--aurora-void) 100%
			),
			var(--bg);
	}

	.spot {
		position: absolute;
		top: var(--y);
		left: var(--x);
		width: 1px;
		height: 1px;
		will-change: transform;
		animation: drift var(--drift-dur) var(--drift-delay) ease-in-out infinite
			alternate;
	}

	.spot::before {
		content: "";
		position: absolute;
		left: calc(var(--r) / -2);
		top: calc(var(--r) / -2);
		width: var(--r);
		height: var(--r);
		border-radius: 50%;
		background: radial-gradient(
			circle,
			hsl(var(--hue) var(--sat) var(--light) / var(--alpha)) 0%,
			hsl(var(--hue) var(--sat) var(--light) / 0) 68%
		);
		filter: blur(8px);
		will-change: transform, opacity;
		animation: breathe var(--breathe-dur) var(--breathe-delay) ease-in-out
			infinite alternate;
	}

	@keyframes drift {
		from {
			transform: translate(0, 0);
		}
		to {
			transform: translate(var(--dx), var(--dy));
		}
	}

	@keyframes breathe {
		from {
			opacity: 0.7;
			transform: scale(0.92);
		}
		to {
			opacity: 1;
			transform: scale(1.08);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.spot,
		.spot::before {
			animation: none;
		}
	}
</style>

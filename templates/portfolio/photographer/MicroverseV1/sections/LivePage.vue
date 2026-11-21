<script setup lang="ts">
import type { MicroverseLive, MicroversePages } from '~~/templates/portfolio/photographer/MicroverseV1/schema'

// The state comes from the data: "live" shows the player, the schedule and the replays; "offline" the poster, "off air" and a countdown to the next stream
const props = defineProps<{
  header: MicroversePages['live']['header']
  schedule: MicroversePages['live']['schedule']
  replays: MicroversePages['live']['replays']
  offAir: MicroversePages['live']['offAir']
  live: MicroverseLive
}>()

const openBooking = inject<(message?: string) => void>('openBooking', () => {})
const notify = (title: string) => openBooking(`Notify me: ${title}`)

// SAT 28 NOV · 7:00 PM IST, in the time zone of the studio so the server and the browser agree
const when = (iso: string) => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', { timeZone: props.live.timeZone, weekday: 'short', day: '2-digit', month: 'short', hour: 'numeric', minute: '2-digit', hour12: true })
      .formatToParts(new Date(iso))
      .map((part) => [part.type, part.value])
  )
  return `${parts.weekday} ${parts.day} ${parts.month} · ${parts.hour}:${parts.minute} ${String(parts.dayPeriod).toUpperCase()} ${props.live.timeZoneLabel}`.toUpperCase()
}

const now = ref<number | null>(null)
onMounted(() => {
  now.value = Date.now()
  const timer = setInterval(() => (now.value = Date.now()), 1000)
  onBeforeUnmount(() => clearInterval(timer))
})
const left = computed(() => {
  const total = now.value === null ? 0 : Math.max(0, Math.floor((Date.parse(props.live.nextAt) - now.value) / 1000))
  const pad = (n: number) => String(n).padStart(2, '0')
  return { days: pad(Math.floor(total / 86400)), hours: pad(Math.floor(total / 3600) % 24), minutes: pad(Math.floor(total / 60) % 60), seconds: pad(total % 60) }
})
</script>

<template>
  <div>
    <section v-if="live.status === 'live'" class="mv-sub stage">
      <header class="mv-pagehead">
        <p class="mv-eyebrow">{{ header.eyebrow }}</p>
        <h1 class="mv-title">{{ header.title }}</h1>
      </header>
      <div class="player">
        <video v-if="live.streamUrl" :src="live.streamUrl" :poster="live.posterUrl" controls muted playsinline preload="none" />
        <img v-else :src="live.posterUrl" :alt="live.title" />
        <span class="onair"><i aria-hidden="true" />{{ header.liveLabel }}</span>
        <p class="now">{{ live.title }}</p>
      </div>
    </section>

    <section v-else-if="offAir.enabled" class="mv-sub off">
      <img class="backdrop" :src="live.posterUrl" alt="" aria-hidden="true" />
      <div class="center">
        <p class="mv-eyebrow">{{ offAir.eyebrow }}</p>
        <h1 class="mv-title">{{ offAir.title }}</h1>
        <p class="clock" role="timer" aria-live="off">
          <span
            v-for="[key, label] in [
              ['days', offAir.daysLabel],
              ['hours', offAir.hoursLabel],
              ['minutes', offAir.minutesLabel],
              ['seconds', offAir.secondsLabel],
            ] as const"
            :key="key">
            <b>{{ left[key] }}</b>
            <small>{{ label }}</small>
          </span>
        </p>
        <button type="button" class="mv-button" @click="notify(live.title)">{{ offAir.notifyLabel }} →</button>
      </div>
    </section>

    <section v-if="schedule.enabled && live.schedule.length" class="mv-section block">
      <header class="mv-pagehead">
        <p class="mv-eyebrow">{{ schedule.eyebrow }}</p>
        <h2 class="mv-title sub">{{ schedule.title }}</h2>
      </header>
      <ul class="cards">
        <li v-for="entry in live.schedule" :key="entry.startsAt + entry.title" class="card">
          <time :datetime="entry.startsAt">{{ when(entry.startsAt) }}</time>
          <h3>{{ entry.title }}</h3>
          <button type="button" class="mv-link" @click="notify(entry.title)">{{ schedule.notifyLabel }} →</button>
        </li>
      </ul>
    </section>

    <section v-if="replays.enabled && live.replays.length" class="mv-section block">
      <header class="mv-pagehead">
        <p class="mv-eyebrow">{{ replays.eyebrow }}</p>
        <h2 class="mv-title sub">{{ replays.title }}</h2>
      </header>
      <ul class="tiles">
        <li v-for="replay in live.replays" :key="replay.title + replay.url">
          <a :href="replay.url" rel="noopener" target="_blank">
            <img :src="replay.thumbnailUrl" :alt="replay.title" width="564" height="318" loading="lazy" />
            <span>{{ replay.title }}</span>
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.stage {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-bottom: 3rem;
}

.player {
  position: relative;
  width: 100%;
  max-width: 62rem;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 6px;
  background: #000;
}

.player video,
.player img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.onair {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.625rem;
  border-radius: 3px;
  background: var(--mv-red);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.onair i {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: #fff;
  animation: pulse 1.4s ease-in-out infinite;
}

.now {
  position: absolute;
  inset: auto 0 0;
  padding: 1.5rem 1rem 0.75rem;
  background: linear-gradient(transparent, rgb(0 0 0 / 0.75));
  font-weight: 600;
  pointer-events: none;
}

.off {
  display: grid;
  place-items: center;
  overflow: hidden;
  min-height: 90svh;
  text-align: center;
}

.backdrop {
  position: absolute;
  inset: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(28px) brightness(0.45);
  transform: scale(1.1);
}

.center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

.center .mv-title {
  white-space: pre-line;
  font-size: clamp(2.5rem, 6.67vw, 6rem);
  line-height: 1.05;
}

.clock {
  display: flex;
  gap: clamp(1rem, 3vw, 2.5rem);
}

.clock span {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.clock b {
  color: var(--mv-red);
  font-size: clamp(2.5rem, 6.67vw, 6rem);
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.clock small {
  margin-top: 0.5rem;
  font-size: 0.6875rem;
  letter-spacing: 0.2em;
}

.block {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.sub {
  font-size: clamp(2.25rem, 3.9vw, 3.5rem);
}

.cards {
  display: grid;
  gap: 1rem;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1.5rem;
  border: 1px solid color-mix(in srgb, #fff 16%, transparent);
  border-radius: 6px;
}

.card time {
  color: var(--mv-hot);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.16em;
}

.card h3 {
  font-size: 1.5rem;
  font-weight: 600;
}

.tiles {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.tiles a {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.tiles img {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 4px;
}

.tiles a:hover span {
  color: var(--mv-hot);
}

@keyframes pulse {
  50% {
    opacity: 0.35;
  }
}

@media (prefers-reduced-motion: reduce) {
  .onair i {
    animation: none;
  }
}

@media (min-width: 880px) {
  .stage {
    padding-top: 10rem;
  }

  .cards {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .tiles {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>

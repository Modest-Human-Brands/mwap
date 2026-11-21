<script setup lang="ts">
import type { MicroverseMember, MicroversePages } from '~~/templates/portfolio/photographer/MicroverseV1/schema'
import CausticsCanvas from './CausticsCanvas.vue'
import { useCharReveal } from '../useMicroverse'

// The story beside a tall photo, then the team: a portrait, a name and a role each
defineProps<{ story: MicroversePages['about']['story']; team: MicroversePages['about']['team']; members: MicroverseMember[] }>()

const title = ref<HTMLElement>()
useCharReveal(title)
</script>

<template>
  <div>
    <section v-if="story.enabled" id="story" class="mv-sub story">
      <CausticsCanvas position="full" :strength="0.6" />
      <figure class="photo"><img :src="story.photoUrl" :alt="story.title" width="560" height="760" /></figure>
      <div class="text">
        <h1 ref="title" class="mv-title headline">{{ story.title }}</h1>
        <div v-for="(section, index) in story.sections" :key="index" class="block">
          <h2 v-if="section.heading" class="sub">{{ section.heading }}</h2>
          <p v-if="section.body" :class="index === 0 ? 'lead' : 'body'">{{ section.body }}</p>
          <ul v-if="section.items?.length" class="items">
            <li v-for="item in section.items" :key="item.text">
              <span aria-hidden="true">•</span>
              <p>
                <strong v-if="item.label">{{ item.label }}</strong> {{ item.text }}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section v-if="team.enabled" id="team" class="mv-section crew">
      <header class="mv-pagehead">
        <p class="mv-eyebrow">{{ team.eyebrow }}</p>
        <h2 class="mv-title">{{ team.title }}</h2>
      </header>
      <ul class="members">
        <li v-for="member in members" :key="member.name">
          <img :src="member.photoUrl" :alt="member.name" width="360" height="450" loading="lazy" />
          <h3 class="name">{{ member.name }}</h3>
          <p class="role">{{ member.role }}</p>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.story {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background: var(--mv-bg);
}

.photo {
  width: 100%;
}

.photo img {
  width: 100%;
  height: auto;
  aspect-ratio: 560 / 760;
  object-fit: cover;
}

.text {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.headline {
  font-size: clamp(3rem, 6.67vw, 6rem);
  line-height: 1.05;
}

.block {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sub {
  color: var(--mv-red);
  font-size: clamp(1.5rem, 2.5vw, 2.25rem);
  font-weight: 700;
  line-height: 1.2;
}

.lead {
  font-size: clamp(1.125rem, 1.67vw, 1.5rem);
  line-height: 1.5;
}

.body,
.items {
  font-size: clamp(1rem, 1.25vw, 1.125rem);
  line-height: 1.7;
}

.items {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.items li {
  display: flex;
  gap: 0.75rem;
}

.crew {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  background: #050202;
}

.members {
  display: grid;
  gap: 2rem;
}

.members img {
  width: 100%;
  height: auto;
  aspect-ratio: 4 / 5;
  object-fit: cover;
}

.name {
  margin-top: 1rem;
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.25;
}

.role {
  color: var(--mv-hot);
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.2em;
}

@media (min-width: 880px) {
  .story {
    display: grid;
    grid-template-columns: minmax(0, 560px) minmax(0, 600px);
    justify-content: space-between;
    align-items: start;
    gap: 4rem;
    padding-top: 15.6rem;
  }

  .photo {
    position: sticky;
    top: 8rem;
  }

  .members {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 3.75rem;
  }
}
</style>

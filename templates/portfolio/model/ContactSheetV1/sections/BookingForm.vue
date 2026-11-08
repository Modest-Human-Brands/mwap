<script setup lang="ts">
import type { BookingSlot } from '~~/templates/portfolio/model/ContactSheetV1/schema'
import type { SitePayload } from '~~/shared/types/site'
import { useBooking } from '~~/templates/_shared/useBooking'
const props = defineProps<{
  slotContent: BookingSlot
  contact: SitePayload['data']['contact']
  subject: string
}>()

const words = computed(() => props.slotContent.title.split(/\s+/).filter(Boolean))
const chars = computed(() => Math.max(4, ...words.value.map((word) => word.length)))

const { status, submit } = useBooking(
  () => props.contact,
  () => props.subject
)
const action = computed(() => props.contact.bookingEndpoint ?? `mailto:${props.contact.email}`)
</script>

<template>
  <section id="booking" class="booking" :style="{ '--chars': chars }">
    <p class="eyebrow">(05) Booking</p>

    <div class="top">
      <h2 v-gsap.whenVisible.once.stagger.from="{ opacity: 0, yPercent: 40, duration: 0.8, ease: 'power3.out', stagger: 0.1, start: 'top 80%' }" class="title">
        <span v-for="word in words" :key="word" class="word">{{ word }}</span>
      </h2>
      <p v-gsap.whenVisible.once.from="{ opacity: 0, y: 24, duration: 0.7, ease: 'power2.out', start: 'top 85%' }" class="intro">{{ slotContent.intro }}</p>
    </div>

    <form v-gsap.whenVisible.once.from="{ opacity: 0, y: 24, duration: 0.7, ease: 'power2.out', start: 'top 90%' }" class="form" :action="action" method="post" @submit.prevent="submit">
      <label class="field">
        <span>Name</span>
        <input name="Name" type="text" autocomplete="name" required />
      </label>
      <label class="field">
        <span>Email</span>
        <input name="Email" type="email" autocomplete="email" required />
      </label>
      <label class="field">
        <span>Project</span>
        <input name="Project" type="text" />
      </label>
      <button class="send" type="submit" :disabled="status === 'sending'">Send the brief <span aria-hidden="true">→</span></button>
      <p v-if="status === 'sent'" class="status" role="status">Sent. I will reply within two working days.</p>
      <p v-else-if="status === 'error'" class="status" role="alert">Could not send the brief. Please email {{ contact.email }}.</p>
    </form>

    <a class="send open" href="#book">Send the brief <span aria-hidden="true">→</span></a>
  </section>
</template>

<style scoped>
.booking {
  padding: 1.75rem var(--cs-pad) 2rem;
  background: var(--brand-primary);
  color: var(--cs-on-primary);
}

.eyebrow {
  margin: 0;
  font: 500 0.75rem/1 var(--cs-mono);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.top {
  display: grid;
  gap: 1.5rem;
  margin: 1rem 0 2rem;
}

.title {
  margin: 0;
  font: 400 min(300px, calc((100vw - 2 * var(--cs-pad)) / (0.5 * var(--chars)))) / 0.86 var(--cs-display);
  text-transform: uppercase;
}

.word {
  display: block;
}

.intro {
  max-width: 28rem;
  margin: 0;
  font: 400 1.75rem/1.15 var(--cs-serif);
}

.form {
  display: none;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.field span {
  font: 500 0.75rem/1 var(--cs-mono);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.field input {
  padding: 0 0 0.5rem;
  border: 0;
  border-bottom: 2px solid currentcolor;
  border-radius: 0;
  background: transparent;
  color: inherit;
  font: inherit;
}

.field input:focus {
  outline: 0;
  border-bottom-color: var(--brand-bg);
}

.send {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.25rem 1.75rem;
  border: 0;
  background: var(--brand-bg);
  color: var(--brand-text);
  font: 500 0.75rem/1 var(--cs-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
}

.send:disabled {
  opacity: 0.6;
}

.status {
  grid-column: 1 / -1;
  margin: 0;
  font: 500 0.75rem/1.4 var(--cs-mono);
  letter-spacing: 0.06em;
}

@media (min-width: 48rem) {
  .booking {
    padding-block: 2.5rem 3.5rem;
  }

  .top {
    margin-block: 1.5rem 3rem;
  }

  .open {
    display: none;
  }

  .form {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    align-items: end;
  }

  .send:not(.open) {
    grid-column: 1 / -1;
  }
}

@media (min-width: 64rem) {
  .top {
    grid-template-columns: 1.4fr 1fr;
    gap: 4rem;
    align-items: start;
  }

  .intro {
    margin-top: 2rem;
    font-size: 2rem;
  }

  .form {
    grid-template-columns: repeat(3, minmax(0, 18.75rem)) 1fr;
  }

  .send:not(.open) {
    grid-column: auto;
    justify-self: end;
    width: 17.5rem;
  }
}
</style>

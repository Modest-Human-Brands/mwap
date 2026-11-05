<script setup lang="ts">
import type { BookingSlot } from '../schema'
import type { SitePayload } from '../../../../shared/types/site'
import { useBooking } from '../../_shared/useBooking'
const props = defineProps<{
  slotContent: BookingSlot
  contact: SitePayload['data']['contact']
  subject: string
}>()

const { status, submit } = useBooking(
  () => props.contact,
  () => props.subject
)
const action = computed(() => props.contact.bookingEndpoint ?? `mailto:${props.contact.email}`)

const fields = [
  { label: 'Name', type: 'text', autocomplete: 'name', required: true },
  { label: 'Email', type: 'email', autocomplete: 'email', required: true },
  { label: 'Project type', type: 'text', autocomplete: 'off', required: false },
  { label: 'Dates', type: 'text', autocomplete: 'off', required: false },
  { label: 'Budget', type: 'text', autocomplete: 'off', required: false },
]
</script>

<template>
  <aside id="book" class="drawer" aria-label="Book">
    <a class="backdrop" href="#booking" aria-label="Close" tabindex="-1" />
    <p class="ghost" aria-hidden="true">{{ slotContent.drawerTitle.replace(/^book\s+/i, '') }}</p>

    <div class="panel">
      <div class="top">
        <span class="eyebrow">(05) Booking</span>
        <a class="close" href="#booking">Close <span aria-hidden="true">×</span></a>
      </div>

      <h2 class="title">{{ slotContent.drawerTitle }}</h2>
      <p class="intro">{{ slotContent.drawerIntro }}</p>

      <form class="form" :action="action" method="post" @submit.prevent="submit">
        <label v-for="field in fields" :key="field.label" class="field">
          <span>{{ field.label }}</span>
          <input :name="field.label" :type="field.type" :autocomplete="field.autocomplete" :required="field.required" />
        </label>
        <button class="send" type="submit" :disabled="status === 'sending'">Send the brief <span aria-hidden="true">→</span></button>
        <p v-if="status === 'sent'" class="status" role="status">Sent. I will reply within two working days.</p>
        <p v-else-if="status === 'error'" class="status" role="alert">Could not send the brief. Please email {{ contact.email }}.</p>
      </form>
    </div>
  </aside>
</template>

<style scoped>
.drawer {
  position: fixed;
  inset: 0;
  z-index: 70;
  display: none;
  background: var(--brand-bg);
}

.drawer:target {
  display: block;
}

.backdrop {
  position: absolute;
  inset: 0;
}

.ghost {
  position: absolute;
  top: 1.5rem;
  left: 3rem;
  display: none;
  margin: 0;
  font: 400 min(35vw, 560px) / 0.84 var(--cs-display);
  text-transform: uppercase;
  color: var(--cs-frame);
  white-space: nowrap;
  pointer-events: none;
}

.panel {
  position: absolute;
  inset: 0 0 0 auto;
  width: 100%;
  overflow-y: auto;
  padding: 1rem var(--cs-pad) 2rem;
  background: var(--brand-secondary);
  color: var(--cs-on-secondary);
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.eyebrow,
.close,
.field span {
  font: 500 0.75rem/1 var(--cs-mono);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.title {
  margin: 1rem 0 0;
  font: 400 clamp(4rem, 18vw, 6.25rem) / 0.9 var(--cs-display);
  text-transform: uppercase;
}

.intro {
  max-width: 22rem;
  margin: 1rem 0 2rem;
  font: 400 1.625rem/1.15 var(--cs-serif);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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
  border-bottom-color: var(--brand-primary);
}

.send {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding: 1.5rem;
  border: 0;
  background: var(--brand-primary);
  color: var(--cs-on-primary);
  font: 500 0.75rem/1 var(--cs-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
}

.status {
  margin: 0;
  font: 500 0.75rem/1.4 var(--cs-mono);
  letter-spacing: 0.06em;
}

@media (min-width: 48rem) {
  .panel {
    width: min(100%, 40rem);
    padding: 1.75rem 3rem 2.5rem;
  }
}

@media (min-width: 64rem) {
  .ghost {
    display: block;
  }

  .panel {
    width: min(57%, 45rem);
  }
}
</style>

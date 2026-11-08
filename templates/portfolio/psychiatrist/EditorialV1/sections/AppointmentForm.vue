<script setup lang="ts">
import type { AppointmentSlot, EditorialData } from '~~/templates/portfolio/psychiatrist/EditorialV1/schema'
import { useBooking } from '~~/templates/_shared/useBooking'

const props = defineProps<{
  slotContent: AppointmentSlot
  contact: EditorialData['contact']
  subject: string
}>()

const { status, submit } = useBooking(
  () => props.contact,
  () => props.subject
)
// Without a script the form falls back to its own action
const action = computed(() => props.contact.bookingEndpoint ?? `mailto:${props.contact.email}`)
</script>

<template>
  <section id="visit" class="visit">
    <div class="intro">
      <p class="ed-eyebrow">{{ slotContent.eyebrow }}</p>
      <h2 v-gsap.whenVisible.once.from="{ opacity: 0, y: 40, duration: 0.9, ease: 'power3.out', start: 'top 85%' }" class="title ed-display">{{ slotContent.title }}</h2>
      <p class="note">{{ slotContent.note }}</p>
    </div>

    <form v-gsap.whenVisible.once.from="{ opacity: 0, y: 28, duration: 0.8, ease: 'power2.out', start: 'top 88%' }" class="form" :action="action" method="post" @submit.prevent="submit">
      <label class="field">
        <span>Full name</span>
        <input name="Name" type="text" autocomplete="name" required />
      </label>
      <label class="field">
        <span>Email or phone</span>
        <input name="Contact" type="text" autocomplete="email" required />
      </label>
      <label class="field type">
        <span>Visit type: in person or video</span>
        <select name="Visit type">
          <option>In person</option>
          <option>Video</option>
        </select>
      </label>
      <label class="field">
        <span>What would you like help with?</span>
        <textarea name="Message" rows="1"></textarea>
      </label>
      <button class="ed-button submit" type="submit" :disabled="status === 'sending'">{{ slotContent.submitLabel }} <span aria-hidden="true">→</span></button>
      <p v-if="status === 'sent'" class="status" role="status">Thank you. I will reply to confirm a time.</p>
      <p v-else-if="status === 'error'" class="status" role="alert">The request could not be sent. Please email {{ contact.email }}.</p>
    </form>

    <div class="hours">
      <h3 class="ed-eyebrow">{{ slotContent.hoursTitle }}</h3>
      <dl class="rows">
        <div v-for="row in slotContent.hours" :key="row.days" class="hour">
          <dt>{{ row.days }}</dt>
          <dd>{{ row.time }}</dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<style scoped>
.visit {
  padding: 3.5rem var(--ed-pad) 4.5rem;
}

.title {
  max-width: 6em;
  margin-top: 1.25rem;
  font-size: var(--ed-fs-form);
  line-height: 1.08;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

.note {
  max-width: 28rem;
  margin: 1.5rem 0 0;
  color: var(--ed-muted);
  font-size: 0.9375rem;
  line-height: 1.6;
}

.form {
  display: grid;
  gap: 1.75rem;
  margin-top: 2.5rem;
}

.field {
  display: grid;
  gap: 0.5rem;
  color: var(--ed-muted);
  font-size: 0.875rem;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  padding: 0.5rem 0 0.75rem;
  border: 0;
  border-bottom: 1px solid var(--ed-deep);
  border-radius: 0;
  background: transparent;
  color: var(--ed-text);
  font: 400 1.0625rem/1.4 var(--ed-body);
  resize: none;
  field-sizing: content;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  outline: 0;
  border-bottom-color: var(--ed-teal);
  box-shadow: 0 1px 0 var(--ed-teal);
}

/* The phone design has three fields; the visit type is chosen when the time is confirmed */
.type {
  display: none;
}

.submit {
  justify-self: start;
  margin-top: 0.75rem;
  background: var(--ed-deep);
  color: var(--ed-on-deep);
}

.submit:hover {
  box-shadow: 0 0.75rem 1.75rem -0.75rem color-mix(in srgb, var(--ed-deep) 70%, transparent);
}

.submit:disabled {
  opacity: 0.6;
}

.status {
  margin: 0;
  color: var(--ed-teal);
  font-size: 0.9375rem;
}

.hours {
  margin-top: 3.5rem;
}

.rows {
  margin: 1.25rem 0 0;
}

.hour {
  display: grid;
  grid-template-columns: 7.5rem minmax(0, 1fr);
  gap: 1rem;
  padding-block: 0.375rem;
  font-size: 0.9375rem;
  line-height: 1.5;
}

.hour dt {
  color: var(--ed-text);
  font-weight: 400;
}

.hour dd {
  margin: 0;
  color: var(--ed-muted);
}

@media (min-width: 48rem) {
  .type {
    display: grid;
  }

  .form {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 2rem;
  }

  .field:nth-of-type(4),
  .submit,
  .status {
    grid-column: 1 / -1;
  }
}

@media (min-width: 64rem) {
  .visit {
    display: grid;
    grid-template-columns: minmax(0, 1fr) clamp(22rem, 42.8vw, 38.5rem);
    grid-template-areas:
      'intro form'
      'hours form';
    grid-template-rows: auto 1fr;
    column-gap: clamp(2rem, 4.2vw, 3.75rem);
    padding-block: 7.5rem;
  }

  .intro {
    grid-area: intro;
  }

  .form {
    grid-area: form;
    grid-template-columns: 1fr;
    gap: 2.25rem;
    margin-top: 0.25rem;
  }

  .field {
    font-size: 1rem;
  }

  .field input,
  .field select,
  .field textarea {
    padding-top: 1rem;
    font-size: 1.125rem;
  }

  .hours {
    grid-area: hours;
    align-self: end;
    margin-top: 4rem;
  }

  .note {
    margin-top: 4rem;
    font-size: 1rem;
  }

  .hour {
    grid-template-columns: 8rem minmax(0, 1fr);
    padding-block: 0;
    font-size: 1rem;
    line-height: 2.25rem;
  }
}
</style>

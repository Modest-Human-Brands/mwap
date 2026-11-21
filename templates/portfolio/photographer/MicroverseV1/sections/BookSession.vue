<script setup lang="ts">
// The one sticky Book a Session. The form is relayed by the service to the bookingEndpoint of the site (POST contact); a site without
// one, or an endpoint that does not answer, falls back to a mailto link, so a visitor can always reach the studio.
const props = defineProps<{ label: string; slug: string; email: string }>()

const dialog = ref<HTMLDialogElement>()
const state = ref<'idle' | 'sending' | 'sent'>('idle')
const form = reactive({ name: '', email: '', phone: '', message: '' })

function open(message?: string) {
  if (message) form.message = message
  state.value = 'idle'
  dialog.value?.showModal()
}
defineExpose({ open })

function mailto() {
  const body = `${form.message}\n\n${form.name}${form.phone ? ` · ${form.phone}` : ''}`
  window.location.href = `mailto:${props.email}?subject=${encodeURIComponent('Book a session')}&body=${encodeURIComponent(body)}`
}

async function submit() {
  state.value = 'sending'
  try {
    await $fetch(`/api/site/${props.slug}/contact`, { method: 'POST', body: { name: form.name, email: form.email, message: form.message, ...(form.phone ? { phone: form.phone } : {}) } })
    state.value = 'sent'
  } catch {
    state.value = 'idle'
    mailto()
  }
}
</script>

<template>
  <div class="book">
    <button type="button" class="mv-button sticky" @click="open()">
      <span class="label">{{ label }}</span>
      <span class="arrow mv-icon-button" aria-hidden="true">→</span>
    </button>

    <dialog ref="dialog" class="dialog" aria-labelledby="book-title" @click.self="dialog?.close()">
      <form v-if="state !== 'sent'" class="form" method="dialog" @submit.prevent="submit">
        <h2 id="book-title" class="heading">{{ label }}</h2>
        <label>Name <input v-model="form.name" name="name" required maxlength="120" autocomplete="name" /></label>
        <label>Email <input v-model="form.email" name="email" type="email" required autocomplete="email" /></label>
        <label>Phone <input v-model="form.phone" name="phone" type="tel" maxlength="40" autocomplete="tel" /></label>
        <label>Message <textarea v-model="form.message" name="message" required maxlength="4000" rows="4"></textarea></label>
        <div class="actions">
          <button type="button" class="mv-button ghost" @click="dialog?.close()">Cancel</button>
          <button type="submit" class="mv-button" :disabled="state === 'sending'">{{ state === 'sending' ? 'Sending…' : 'Send' }}</button>
        </div>
      </form>
      <div v-else class="form">
        <h2 class="heading">Thank you</h2>
        <p>We got your message and will get back to you soon.</p>
        <button type="button" class="mv-button" @click="dialog?.close()">Close</button>
      </div>
    </dialog>
  </div>
</template>

<style scoped>
.sticky {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 50;
  gap: 0.6875rem;
  min-width: 11.5rem;
  height: 3rem;
  padding: 0.375rem 0.375rem 0.375rem 1rem;
  border: 0;
  background: linear-gradient(90deg, var(--mv-red), color-mix(in srgb, #171717 60%, transparent)), #000;
  font-size: 1rem;
  font-weight: 500;
}

.sticky:hover {
  background: linear-gradient(90deg, var(--mv-hot), color-mix(in srgb, #171717 60%, transparent)), #000;
}

/* The label takes the room the arrow leaves and sits in the middle of it */
.sticky .label {
  flex: 1;
  text-align: center;
}

.arrow {
  flex: none;
  width: 2.25rem;
  height: 2.25rem;
  border-color: transparent;
  background: #fff;
  color: #000;
  backdrop-filter: none;
}

.sticky:hover .arrow {
  background: #fff;
}

@media (min-width: 880px) {
  .sticky {
    right: 2rem;
    bottom: 2rem;
    min-width: 14.4375rem;
    height: 4rem;
    padding: 0.5rem 0.5rem 0.5rem 1.5rem;
    font-size: 1.25rem;
  }

  .arrow {
    width: 3rem;
    height: 3rem;
  }
}

.dialog {
  width: min(32rem, calc(100vw - 2rem));
  padding: 0;
  border: 1px solid var(--mv-line);
  background: var(--mv-bg);
  color: var(--mv-text);
}

.dialog::backdrop {
  background: color-mix(in srgb, #000 70%, transparent);
  backdrop-filter: blur(6px);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
}

.heading {
  font-size: 1.75rem;
  font-weight: 700;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  color: var(--mv-muted);
  font-size: 0.75rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

input,
textarea {
  padding: 0.75rem;
  border: 1px solid var(--mv-line);
  background: var(--mv-raised);
  color: var(--mv-text);
  font: inherit;
  font-size: 1rem;
  letter-spacing: 0;
  text-transform: none;
}

input:focus,
textarea:focus {
  border-color: var(--mv-hot);
  outline: none;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.ghost {
  border-color: var(--mv-line);
  background: transparent;
  color: var(--mv-text);
}
</style>

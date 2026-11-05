import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * v-gsap has no reduced-motion handling of its own. For visitors who ask for less motion, every reveal is finished
 * at once (content in its final state) and scroll-driven effects such as parallax are undone and switched off.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  if (!query.matches) return

  nuxtApp.hook('app:mounted', () => {
    // The directive builds its timelines after the next frame
    setTimeout(() => {
      for (const trigger of ScrollTrigger.getAll()) {
        if (trigger.vars.scrub) trigger.animation?.revert()
        else trigger.animation?.progress(1)
        trigger.kill()
      }
      gsap.globalTimeline.getChildren(false, true, true).forEach((animation) => animation.progress(1))
    }, 600)
  })
})

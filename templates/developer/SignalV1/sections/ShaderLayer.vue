<script setup lang="ts">
import { ChromaFlow, CursorRipples, FlutedGlass, Shader, Swirl } from 'shaders/vue'

// Loaded after first paint by ShaderBackdrop; the shaders package never reaches the server render
defineProps<{
  variant: 'hero' | 'contact' | 'swirl' | 'ambient'
  colors: { primary: string; accent: string; bg: string; text: string }
}>()
defineEmits<{ unavailable: [] }>()
</script>

<template>
  <Shader class="layer" :disable-telemetry="true" @unavailable="$emit('unavailable')">
    <template v-if="variant === 'contact'">
      <ChromaFlow :base-color="colors.primary" :up-color="colors.accent" :down-color="colors.primary" :left-color="colors.bg" :right-color="colors.accent" :intensity="1" :radius="3" />
      <CursorRipples :intensity="6" :chromatic-split="1" />
    </template>
    <template v-else>
      <Swirl :color-a="colors.bg" :color-b="colors.primary" :speed="0.6" :detail="1.2" :blend="35" />
      <FlutedGlass :frequency="variant === 'hero' ? 20 : variant === 'ambient' ? 34 : 26" :softness="0.6" />
      <CursorRipples :intensity="variant === 'ambient' ? 3 : 4" :chromatic-split="0.6" />
    </template>
  </Shader>
</template>

<style scoped>
.layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
</style>

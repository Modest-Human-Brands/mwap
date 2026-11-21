<script setup lang="ts">
import { TresCanvas, type TresContext } from '@tresjs/core'
import { Color, NoToneMapping, SRGBColorSpace, Vector2, Vector3, VideoTexture, type WebGLRenderer } from 'three'
import { onBeforeUnmount, onMounted } from 'vue'
import { useMicroverseMotion } from '../useMicroverse'

// The TresJS scene of the hero reel: the video as a texture on a full-screen plane. A fragment shader grades it to a red/black
// duotone, the cursor is a lens (a barrel warp with an RGB split that grows with its speed) and the scroll velocity adds a
// short vertical smear. Drawn on demand by the parent's visibility loop (render-mode manual).
const props = defineProps<{ video: HTMLVideoElement; root: HTMLElement }>()
const emit = defineEmits<{ ready: []; error: [] }>()

const motion = useMicroverseMotion()

const vertexShader = 'varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position,1.0);}'
const fragmentShader = `
precision highp float;
uniform sampler2D uMap; uniform vec2 uRes; uniform vec2 uVideo; uniform vec2 uMouse; uniform float uSpeed; uniform float uActive; uniform float uVel; uniform vec3 uDark; uniform vec3 uHot; uniform float uTime; uniform float uShrink;
varying vec2 vUv;
vec2 cover(vec2 uv) {
  float a = uRes.x / uRes.y; float b = uVideo.x / uVideo.y;
  vec2 s = a > b ? vec2(1.0, b / a) : vec2(a / b, 1.0);
  return (uv - 0.5) * s + 0.5;
}
vec3 grade(vec3 c) {
  float l = dot(c, vec3(0.299, 0.587, 0.114));
  return mix(uDark, uHot, smoothstep(0.02, 0.95, pow(l, 0.85)));
}
void main() {
  vec2 uv = (vUv - 0.5) / uShrink + 0.5;
  vec2 px = uv * uRes;
  vec2 m = uMouse * uRes;
  float radius = 220.0; float strength = 0.18 * uActive;
  vec2 d = px - m; float r = length(d) / radius;
  vec2 warp = r < 1.0 ? d * (1.0 - strength * (1.0 - r * r)) / max(length(d), 0.0001) * length(d) : d;
  vec2 lens = (m + warp) / uRes;
  float k = r < 1.0 ? 1.0 : 0.0;
  vec2 smear = vec2(0.0, uVel * 0.0006);
  float split = 0.0015 + uSpeed * 0.01 * k;
  vec2 dir = normalize(d + 0.0001) * split;
  vec2 base = cover(lens + smear);
  float rr = texture2D(uMap, base + dir).r; float gg = texture2D(uMap, base).g; float bb = texture2D(uMap, base - dir).b;
  vec3 col = grade(vec3(rr, gg, bb));
  float edge = smoothstep(0.0, 0.02, uv.x) * smoothstep(1.0, 0.98, uv.x) * smoothstep(0.0, 0.02, uv.y) * smoothstep(1.0, 0.98, uv.y);
  gl_FragColor = vec4(col * edge, 1.0);
}`

const texture = new VideoTexture(props.video)
texture.colorSpace = SRGBColorSpace
const style = getComputedStyle(document.documentElement)
const dark = new Color(style.getPropertyValue('--brand-bg').trim() || '#090303')
const hot = new Color(style.getPropertyValue('--brand-accent').trim() || '#FB3737')
const uniforms = {
  uMap: { value: texture },
  uRes: { value: new Vector2(1, 1) },
  uVideo: { value: new Vector2(16, 9) },
  uMouse: { value: new Vector2(0.5, 0.5) },
  uSpeed: { value: 0 },
  uActive: { value: 0 },
  uVel: { value: 0 },
  uDark: { value: new Vector3(dark.r, dark.g, dark.b) },
  uHot: { value: new Vector3(hot.r, hot.g, hot.b) },
  uTime: { value: 0 },
  uShrink: { value: 1 },
}

const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

// The cursor is the lens: position (0..1, y up), its change per move, and whether it is over the hero
const mouse = { x: 0.5, y: 0.5, vx: 0, vy: 0, active: 0 }
const move = (event: PointerEvent) => {
  const rect = props.root.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width
  const y = 1 - (event.clientY - rect.top) / rect.height
  mouse.vx = x - mouse.x
  mouse.vy = y - mouse.y
  mouse.x = x
  mouse.y = y
  mouse.active = 1
}
const leave = () => (mouse.active = 0)

onMounted(() => {
  props.root.addEventListener('pointermove', move, { passive: true })
  props.root.addEventListener('pointerleave', leave)
})

onBeforeUnmount(() => {
  props.root.removeEventListener('pointermove', move)
  props.root.removeEventListener('pointerleave', leave)
  texture.dispose()
})

let context: TresContext | undefined
const size = new Vector2()
let speed = 0
let activeNow = 0

function onReady(ctx: TresContext) {
  context = ctx
  emit('ready')
}

/** One frame: eases the lens, feeds the clock and scroll velocity to the shader and draws */
function frame(time: number) {
  if (!context) return
  const el = props.video
  if (el.videoWidth) uniforms.uVideo.value.set(el.videoWidth, el.videoHeight)
  speed += (Math.min(Math.hypot(mouse.vx, mouse.vy) * 8, 1) - speed) * 0.15
  mouse.vx *= 0.8
  mouse.vy *= 0.8
  activeNow += (mouse.active - activeNow) * 0.12
  ;(context.renderer.instance as WebGLRenderer).getDrawingBufferSize(size)
  uniforms.uRes.value.copy(size)
  uniforms.uMouse.value.set(mouse.x, mouse.y)
  uniforms.uSpeed.value = speed
  uniforms.uActive.value = activeNow
  uniforms.uVel.value = motion.velocity.value
  uniforms.uTime.value = time
  // The plane scales 1 -> 0.9 and darkens as you scroll into the next section
  const box = props.root.getBoundingClientRect()
  const progress = Math.min(Math.max(-box.top / Math.max(box.height, 1), 0), 1)
  uniforms.uShrink.value = 1 - progress * 0.1
  context.renderer.advance()
}

defineExpose({ frame })
</script>

<template>
  <TresCanvas
    render-mode="manual"
    :antialias="false"
    :depth="false"
    :stencil="false"
    power-preference="high-performance"
    :tone-mapping="NoToneMapping"
    :dpr="dpr"
    @ready="onReady"
    @error="emit('error')">
    <TresOrthographicCamera :args="[-1, 1, 1, -1, 0, 1]" />
    <TresMesh :frustum-culled="false">
      <TresPlaneGeometry :args="[2, 2]" />
      <TresShaderMaterial :uniforms="uniforms" :vertex-shader="vertexShader" :fragment-shader="fragmentShader" />
    </TresMesh>
  </TresCanvas>
</template>

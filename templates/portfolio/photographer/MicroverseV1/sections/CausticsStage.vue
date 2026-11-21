<script setup lang="ts">
import { TresCanvas, type TresContext } from '@tresjs/core'
import { Color, NoToneMapping, Vector2, Vector3, type WebGLRenderer } from 'three'
import { useMicroverseMotion } from '../useMicroverse'

// The TresJS scene of the caustics: one full-screen plane with the caustic fragment shader, drawn on demand by the parent's
// visibility loop (render-mode manual), so the canvas costs nothing while it is off screen.
const props = defineProps<{ strength: number; full: boolean }>()
const emit = defineEmits<{ ready: []; error: [] }>()

const motion = useMicroverseMotion()

const vertexShader = 'void main(){gl_Position=vec4(position,1.0);}'
const fragmentShader = `
precision highp float;
uniform float uTime; uniform vec2 uRes; uniform vec3 uColor; uniform float uVel; uniform float uStrength; uniform float uFull;
float caustic(vec2 p, float t) {
  vec2 i = p;
  float c = 1.0;
  float inten = 0.005;
  for (int n = 0; n < 5; n++) {
    float tt = t * (1.0 - (3.5 / float(n + 1)));
    i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
    c += 1.0 / length(vec2(p.x / (sin(i.x + tt) / inten), p.y / (cos(i.y + tt) / inten)));
  }
  c /= 5.0;
  c = 1.17 - pow(c, 1.4);
  return pow(abs(c), 8.0);
}
void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = mod(uv * 6.2831853 * vec2(uRes.x / uRes.y, 1.0) * 0.6, 6.2831853) - 250.0;
  float t = uTime * 0.35 + uVel * 0.15;
  float c = caustic(p, t);
  float fade = mix(smoothstep(0.85, 0.0, uv.y), 1.0, uFull);
  vec3 col = uColor * c * 1.6 * fade * uStrength;
  gl_FragColor = vec4(col, min(1.0, max(col.r, max(col.g, col.b))));
}`

const color = new Color(getComputedStyle(document.documentElement).getPropertyValue('--brand-accent').trim() || '#FB3737')
const uniforms = {
  uTime: { value: 0 },
  uRes: { value: new Vector2(1, 1) },
  uColor: { value: new Vector3(color.r, color.g, color.b) },
  uVel: { value: 0 },
  uStrength: { value: props.strength },
  uFull: { value: props.full ? 1 : 0 },
}

// Mobile renders at a lower resolution (the design's budget)
const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * (window.innerWidth < 768 ? 0.5 : 1)

let context: TresContext | undefined
const size = new Vector2()

function onReady(ctx: TresContext) {
  context = ctx
  emit('ready')
}

/** One frame: the shader reads the clock and the scroll velocity, the drawing-buffer size is its resolution */
function frame(time: number) {
  if (!context) return
  ;(context.renderer.instance as WebGLRenderer).getDrawingBufferSize(size)
  uniforms.uRes.value.copy(size)
  uniforms.uTime.value = time
  uniforms.uVel.value = motion.velocity.value
  context.renderer.advance()
}

defineExpose({ frame })
</script>

<template>
  <TresCanvas
    render-mode="manual"
    alpha
    :clear-alpha="0"
    :antialias="false"
    :depth="false"
    :stencil="false"
    power-preference="low-power"
    :tone-mapping="NoToneMapping"
    :dpr="dpr"
    @ready="onReady"
    @error="emit('error')">
    <TresOrthographicCamera :args="[-1, 1, 1, -1, 0, 1]" />
    <TresMesh :frustum-culled="false">
      <TresPlaneGeometry :args="[2, 2]" />
      <TresShaderMaterial transparent :uniforms="uniforms" :vertex-shader="vertexShader" :fragment-shader="fragmentShader" />
    </TresMesh>
  </TresCanvas>
</template>

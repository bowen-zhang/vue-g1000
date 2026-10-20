<template>
  <div ref="root" class="g1000-root" :style="{ width: '100%', lineHeight: 0 }">
    <v-stage :config="{ width: fit.width, height: fit.height }">
      <v-layer :config="{ scaleX: fit.scale, scaleY: fit.scale }">
        <!-- attitude indicator -->
        <v-group :config="{ clip: { x: 0, y: 0, width: W, height: H } }">
          <v-group :config="horizonGroup">
            <v-rect :config="{ x: -1000, y: -1500, width: 2000, height: 1500, fill: '#1e78d2' }" />
            <v-rect :config="{ x: -1000, y: 0, width: 2000, height: 1500, fill: '#8b5a2b' }" />
            <v-line :config="{ points: [-1000, 0, 1000, 0], stroke: '#fff', strokeWidth: 3 }" />
            <template v-for="p in pitchMarks" :key="p">
              <v-line :config="{ points: [-(p % 10 === 0 ? 60 : 30), -p * PPD, (p % 10 === 0 ? 60 : 30), -p * PPD], stroke: '#fff', strokeWidth: 2 }" />
              <v-text v-if="p % 10 === 0" :config="{ x: 66, y: -p * PPD - 8, text: String(Math.abs(p)), fill: '#fff', fontSize: 16 }" />
              <v-text v-if="p % 10 === 0" :config="{ x: -86, y: -p * PPD - 8, text: String(Math.abs(p)), fill: '#fff', fontSize: 16 }" />
            </template>
          </v-group>
          <!-- bank scale -->
          <v-group :config="{ x: CX, y: CY, rotation: -bank }">
            <v-line v-for="a in bankTicks" :key="a" :config="bankTick(a)" />
            <v-line :config="{ points: [-8, -BR + 2, 8, -BR + 2, 0, -BR + 14], closed: true, fill: '#ffd400' }" />
          </v-group>
          <v-line :config="{ points: [CX - 10, CY - BR - 2, CX + 10, CY - BR - 2, CX, CY - BR + 12], closed: true, fill: '#fff', stroke: '#fff' }" />
          <!-- slip/skid -->
          <v-rect :config="{ x: CX - 40, y: CY - BR + 20, width: 80, height: 14, stroke: '#fff', strokeWidth: 1, fill: '#00000066' }" />
          <v-circle :config="{ x: CX + slipOffset, y: CY - BR + 27, radius: 6, fill: '#fff' }" />
          <!-- aircraft symbol -->
          <v-line :config="{ points: [CX - 110, CY, CX - 40, CY, CX - 40, CY + 18], stroke: '#ffd400', strokeWidth: 6 }" />
          <v-line :config="{ points: [CX + 110, CY, CX + 40, CY, CX + 40, CY + 18], stroke: '#ffd400', strokeWidth: 6 }" />
          <v-rect :config="{ x: CX - 4, y: CY - 4, width: 8, height: 8, fill: '#ffd400' }" />
        </v-group>

        <!-- airspeed tape -->
        <v-group :config="{ x: 0, y: TOP }">
          <v-rect :config="{ x: 0, y: 0, width: 120, height: TAPE_H, fill: '#000000aa' }" />
          <v-group :config="{ clip: { x: 0, y: 0, width: 120, height: TAPE_H } }">
            <v-rect v-for="(a, i) in arcs" :key="'a' + i" :config="arcRect(a)" />
            <template v-for="t in speedTicks" :key="'t' + t">
              <v-line :config="{ points: [100, speedY(t), 120, speedY(t)], stroke: '#fff', strokeWidth: 2 }" />
              <v-text v-if="t % 20 === 0" :config="{ x: 40, y: speedY(t) - 9, width: 56, align: 'right', text: String(t), fill: '#fff', fontSize: 18 }" />
            </template>
            <v-text v-for="b in bugs" :key="b.label" :config="{ x: 6, y: speedY(b.value) - 9, text: b.label, fill: '#0ff', fontSize: 16, fontStyle: 'bold' }" />
          </v-group>
          <v-rect :config="{ x: 0, y: TAPE_H / 2 - 18, width: 100, height: 36, fill: '#000', stroke: '#fff', strokeWidth: 2 }" />
          <v-text :config="{ x: 0, y: TAPE_H / 2 - 12, width: 96, align: 'right', text: String(Math.round(spd)), fill: '#fff', fontSize: 24, fontStyle: 'bold' }" />
        </v-group>

        <!-- altitude tape -->
        <v-group :config="{ x: W - 120, y: TOP }">
          <v-rect :config="{ x: 0, y: 0, width: 120, height: TAPE_H, fill: '#000000aa' }" />
          <v-group :config="{ clip: { x: 0, y: 0, width: 120, height: TAPE_H } }">
            <template v-for="t in altTicks" :key="'t' + t">
              <v-line :config="{ points: [0, altY(t), 16, altY(t)], stroke: '#fff', strokeWidth: 2 }" />
              <v-text v-if="t % 100 === 0" :config="{ x: 22, y: altY(t) - 9, text: String(t), fill: '#fff', fontSize: 18 }" />
            </template>
          </v-group>
          <v-rect :config="{ x: 10, y: TAPE_H / 2 - 18, width: 110, height: 36, fill: '#000', stroke: '#fff', strokeWidth: 2 }" />
          <v-text :config="{ x: 14, y: TAPE_H / 2 - 12, width: 102, align: 'right', text: String(Math.round(alt)), fill: '#fff', fontSize: 24, fontStyle: 'bold' }" />
        </v-group>

        <!-- vertical speed -->
        <v-group :config="{ x: W - 170, y: TOP }">
          <v-rect :config="{ x: 0, y: 0, width: 44, height: TAPE_H, fill: '#000000aa' }" />
          <v-line :config="{ points: [44, TAPE_H / 2, 0, TAPE_H / 2 - vsPx], stroke: '#f0f', strokeWidth: 3 }" />
          <v-text :config="{ x: 0, y: vsLabelY, width: 44, align: 'center', text: String(Math.round(vs / 10) * 10), fill: '#fff', fontSize: 14 }" />
        </v-group>

        <!-- heading -->
        <v-group :config="{ x: CX - 150, y: H - 70 }">
          <v-rect :config="{ x: 0, y: 0, width: 300, height: 70, fill: '#000000cc' }" />
          <v-group :config="{ clip: { x: 0, y: 0, width: 300, height: 70 } }">
            <template v-for="t in hdgTicks" :key="'h' + t">
              <v-line :config="{ points: [hdgX(t), 28, hdgX(t), t % 10 === 0 ? 46 : 38], stroke: '#fff', strokeWidth: 2 }" />
              <v-text v-if="t % 10 === 0" :config="{ x: hdgX(t) - 20, y: 48, width: 40, align: 'center', text: hdgLabel(t), fill: '#fff', fontSize: 16 }" />
            </template>
          </v-group>
          <v-line :config="{ points: [150, 28, 142, 14, 158, 14], closed: true, fill: '#ffd400' }" />
          <v-rect :config="{ x: 120, y: 0, width: 60, height: 24, fill: '#000', stroke: '#fff' }" />
          <v-text :config="{ x: 120, y: 3, width: 60, align: 'center', text: hdgLabel(hdg), fill: '#fff', fontSize: 20, fontStyle: 'bold' }" />
        </v-group>

        <!-- optional MFD engine section -->
        <v-group v-if="showEngine" :config="{ y: H }">
          <v-rect :config="{ x: 0, y: 0, width: W, height: MH, fill: '#0b0b0b' }" />
          <v-text :config="{ x: 20, y: 12, text: powerMode === 'manifold' ? 'MAN PRESS (inHg)' : 'POWER %', fill: '#fff', fontSize: 18 }" />
          <v-rect :config="{ x: 20, y: 40, width: 340, height: 24, stroke: '#fff' }" />
          <v-rect :config="{ x: 20, y: 40, width: 340 * powerFrac, height: 24, fill: powerColor }" />
          <v-text :config="{ x: 20, y: 70, text: powerText, fill: '#0f0', fontSize: 26 }" />
          <v-text :config="{ x: 420, y: 12, text: 'RPM', fill: '#fff', fontSize: 18 }" />
          <v-rect :config="{ x: 420, y: 40, width: 340, height: 24, stroke: '#fff' }" />
          <v-rect :config="{ x: 420, y: 40, width: 340 * rpmFrac, height: 24, fill: rpmColor }" />
          <v-text :config="{ x: 420, y: 70, text: String(Math.round(rpmValue)), fill: '#0f0', fontSize: 26 }" />
          <v-text :config="{ x: 20, y: 130, text: 'FLAPS', fill: '#fff', fontSize: 18 }" />
          <template v-for="(f, i) in flapPositions" :key="'f' + i">
            <v-rect :config="{ x: 110 + i * 70, y: 126, width: 60, height: 26, stroke: '#fff', fill: f === nearestFlap ? '#00c8c8' : 'transparent' }" />
            <v-text :config="{ x: 110 + i * 70, y: 131, width: 60, align: 'center', text: f + '°', fill: f === nearestFlap ? '#000' : '#fff', fontSize: 16 }" />
          </template>
          <v-text :config="{ x: 110 + flapPositions.length * 70 + 10, y: 128, text: Math.round(flapsValue) + '°', fill: '#0f0', fontSize: 22 }" />
        </v-group>
      </v-layer>
    </v-stage>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { ensureKonva } from './useKonva.js'
import {
  PFD_WIDTH as W, PFD_HEIGHT as H, MFD_HEIGHT as MH,
  DEFAULT_SPEEDS, clamp, num, normalizeHeading, speedArcs, speedBugs, ticks, fitScale
} from './utils.js'

ensureKonva()

const props = defineProps({
  airspeed: { type: Number, default: 0 },
  pitch: { type: Number, default: 0 },
  roll: { type: Number, default: 0 },
  slip: { type: Number, default: 0 },
  altitude: { type: Number, default: 0 },
  verticalSpeed: { type: Number, default: 0 },
  heading: { type: Number, default: 0 },
  vSpeeds: { type: Object, default: () => ({ ...DEFAULT_SPEEDS }) },
  showEngine: { type: Boolean, default: false },
  powerMode: { type: String, default: 'percent', validator: (v) => ['percent', 'manifold'].includes(v) },
  power: { type: Number, default: 0 },
  maxManifoldPressure: { type: Number, default: 30 },
  rpm: { type: Number, default: 0 },
  maxRpm: { type: Number, default: 2700 },
  flaps: { type: Number, default: 0 },
  flapPositions: { type: Array, default: () => [0, 10, 20, 30] }
})

const PPD = 8
const CX = W / 2
const CY = 270
const BR = 190
const TOP = 70
const TAPE_H = 400
const PPK = 4
const PPF = 0.4

const root = ref(null)
const size = ref({ w: 800, h: 0 })
let ro = null
onMounted(() => {
  const update = () => {
    const el = root.value
    if (el) size.value = { w: el.clientWidth || 800, h: el.parentElement ? el.parentElement.clientHeight : 0 }
  }
  update()
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(update)
    ro.observe(root.value)
    if (root.value.parentElement) ro.observe(root.value.parentElement)
  }
})
onBeforeUnmount(() => ro && ro.disconnect())

const totalH = computed(() => H + (props.showEngine ? MH : 0))
const fit = computed(() => fitScale(size.value.w, size.value.h, W, totalH.value))

const spd = computed(() => Math.max(0, num(props.airspeed)))
const alt = computed(() => num(props.altitude))
const vs = computed(() => num(props.verticalSpeed))
const hdg = computed(() => normalizeHeading(props.heading))
const pitch = computed(() => clamp(num(props.pitch), -90, 90))
const bank = computed(() => num(props.roll))
const slipOffset = computed(() => clamp(num(props.slip), -1, 1) * 30)

const horizonGroup = computed(() => ({ x: CX, y: CY, rotation: -bank.value, offsetY: -pitch.value * PPD }))
const pitchMarks = computed(() => {
  const c = Math.round(pitch.value / 5) * 5
  return ticks(c - 30, c + 30, 5).filter((p) => p !== 0 && Math.abs(p) <= 90)
})
const bankTicks = [-60, -45, -30, -20, -10, 0, 10, 20, 30, 45, 60]
const bankTick = (a) => {
  const len = Math.abs(a) % 30 === 0 ? 18 : 10
  const r = (a * Math.PI) / 180
  return {
    points: [Math.sin(r) * BR, -Math.cos(r) * BR, Math.sin(r) * (BR - len), -Math.cos(r) * (BR - len)],
    stroke: '#fff', strokeWidth: 2
  }
}

const arcs = computed(() => speedArcs(props.vSpeeds))
const bugs = computed(() => speedBugs(props.vSpeeds))
const speedY = (v) => TAPE_H / 2 - (v - spd.value) * PPK
const arcRect = (a) => {
  const y1 = speedY(a.to)
  const y2 = speedY(a.from)
  return { x: 92 - a.width + 8, y: y1, width: a.width, height: y2 - y1, fill: a.color }
}
const speedTicks = computed(() => ticks(Math.max(0, spd.value - 50), spd.value + 50, 10))

const altY = (v) => TAPE_H / 2 - (v - alt.value) * PPF
const altTicks = computed(() => ticks(alt.value - 500, alt.value + 500, 20))

const vsPx = computed(() => clamp(vs.value, -2000, 2000) / 2000 * 150)
const vsLabelY = computed(() => clamp(TAPE_H / 2 - vsPx.value - 20, 2, TAPE_H - 18))

const hdgX = (t) => 150 + (t - hdg.value) * 3
const hdgTicks = computed(() => ticks(Math.floor(hdg.value) - 55, Math.floor(hdg.value) + 55, 5))
const hdgLabel = (t) => String(Math.round(normalizeHeading(t)) % 360).padStart(3, '0')

const powerFrac = computed(() =>
  props.powerMode === 'manifold'
    ? clamp(num(props.power) / props.maxManifoldPressure, 0, 1)
    : clamp(num(props.power) / 100, 0, 1))
const powerText = computed(() =>
  props.powerMode === 'manifold' ? num(props.power).toFixed(1) + ' inHg' : Math.round(num(props.power)) + ' %')
const powerColor = computed(() => (powerFrac.value > 0.97 ? '#ff0000' : '#00c800'))
const rpmValue = computed(() => Math.max(0, num(props.rpm)))
const rpmFrac = computed(() => clamp(rpmValue.value / props.maxRpm, 0, 1))
const rpmColor = computed(() => (rpmFrac.value > 0.97 ? '#ff0000' : '#00c800'))
const flapsValue = computed(() => num(props.flaps))
const nearestFlap = computed(() =>
  props.flapPositions.reduce((b, f) => (Math.abs(f - flapsValue.value) < Math.abs(b - flapsValue.value) ? f : b), props.flapPositions[0]))
</script>

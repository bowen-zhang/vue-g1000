export const PFD_WIDTH = 800
export const PFD_HEIGHT = 600
export const MFD_HEIGHT = 200

export const DEFAULT_SPEEDS = {
  vs0: 48, vs1: 55, vr: 55, vx: 62, vy: 74, vno: 129, vne: 163
}

export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

export const num = (v, fallback = 0) => (Number.isFinite(Number(v)) ? Number(v) : fallback)

export const normalizeHeading = (h) => ((num(h) % 360) + 360) % 360

/** Airspeed arcs: white (Vs0..Vno-ish flap range), green (Vs1..Vno), yellow (Vno..Vne), red line at Vne. */
export function speedArcs(speeds) {
  const s = { ...DEFAULT_SPEEDS, ...speeds }
  return [
    { color: '#ffffff', from: s.vs0, to: s.vs1, width: 4 },
    { color: '#00c800', from: s.vs1, to: s.vno, width: 8 },
    { color: '#ffd400', from: s.vno, to: s.vne, width: 8 },
    { color: '#ff0000', from: s.vne, to: s.vne + 20, width: 8 }
  ]
}

/** Reference speed bugs shown on the tape. */
export function speedBugs(speeds) {
  const s = { ...DEFAULT_SPEEDS, ...speeds }
  return [
    { label: 'R', value: s.vr },
    { label: 'X', value: s.vx },
    { label: 'Y', value: s.vy }
  ].filter((b) => Number.isFinite(b.value))
}

/** Tick values within [min,max] at a given step. */
export function ticks(min, max, step) {
  const out = []
  for (let v = Math.ceil(min / step) * step; v <= max; v += step) out.push(v)
  return out
}

/** Scale factor + offsets to fit virtual drawing into a container preserving aspect ratio. */
export function fitScale(containerW, containerH, virtualW, virtualH) {
  const cw = Math.max(1, num(containerW, 1))
  const ch = containerH ? Math.max(1, num(containerH, 1)) : Infinity
  const scale = Math.min(cw / virtualW, ch / virtualH)
  return { scale, width: virtualW * scale, height: virtualH * scale }
}

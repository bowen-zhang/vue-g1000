import { describe, it, expect } from 'vitest'
import { speedArcs, speedBugs, ticks, fitScale, normalizeHeading, clamp } from '../src/utils.js'

describe('utils', () => {
  it('builds speed arcs from configured speeds', () => {
    const a = speedArcs({ vs0: 40, vs1: 50, vno: 100, vne: 150 })
    expect(a[0]).toMatchObject({ from: 40, to: 50 })
    expect(a[1]).toMatchObject({ from: 50, to: 100 })
    expect(a[2]).toMatchObject({ from: 100, to: 150 })
    expect(a[3].from).toBe(150)
  })
  it('builds bugs', () => {
    expect(speedBugs({ vr: 55, vx: 60, vy: 70 }).map((b) => b.value)).toEqual([55, 60, 70])
  })
  it('ticks', () => expect(ticks(3, 31, 10)).toEqual([10, 20, 30]))
  it('normalizes heading', () => {
    expect(normalizeHeading(-10)).toBe(350)
    expect(normalizeHeading(370)).toBe(10)
  })
  it('clamps', () => expect(clamp(5, 0, 3)).toBe(3))
  it('fits scale by width and height', () => {
    expect(fitScale(400, 0, 800, 600)).toMatchObject({ scale: 0.5, width: 400, height: 300 })
    expect(fitScale(800, 150, 800, 600).scale).toBe(0.25)
  })
})

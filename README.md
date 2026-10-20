# vue-g1000

Vue 3 component rendering a simplified Garmin G1000 PFD using [vue-konva](https://github.com/konvajs/vue-konva),
with an optional MFD engine section (power % or manifold pressure, RPM, flaps).
It scales to its container width (and parent height if set), from phones to desktops.

```js
import { G1000PFD } from 'vue-g1000'
```

```vue
<G1000PFD
  :airspeed="95" :pitch="3" :roll="-10" :slip="0.1"
  :altitude="3500" :vertical-speed="500" :heading="270"
  :v-speeds="{ vs0: 48, vs1: 55, vr: 55, vx: 62, vy: 74, vno: 129, vne: 163 }"
  show-engine power-mode="manifold" :power="23.5" :rpm="2400" :flaps="10"
/>
```

Peer dependencies: `vue`, `konva`, `vue-konva`. The component registers vue-konva on the host app if needed.

## Props
| Prop | Description |
|---|---|
| `airspeed`, `altitude`, `verticalSpeed` (fpm), `heading` (deg) | Flight data |
| `pitch`, `roll` (deg), `slip` (-1..1) | Attitude / coordination |
| `vSpeeds` | `{ vs0, vs1, vr, vx, vy, vno, vne }` |
| `showEngine` | Render MFD engine section |
| `powerMode` | `'percent'` or `'manifold'`; with `power`, `maxManifoldPressure` |
| `rpm`, `maxRpm` | RPM gauge |
| `flaps`, `flapPositions` | Flap angle and detents |

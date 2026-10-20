import { getCurrentInstance } from 'vue'
import VueKonva from 'vue-konva'

/** Makes sure vue-konva components are registered on the host app. */
export function ensureKonva() {
  const inst = getCurrentInstance()
  const app = inst && inst.appContext.app
  if (app && !app.component('v-stage')) app.use(VueKonva)
}

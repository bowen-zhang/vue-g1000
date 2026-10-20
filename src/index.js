import G1000PFD from './G1000PFD.vue'

export { G1000PFD }
export { DEFAULT_SPEEDS } from './utils.js'
export default {
  install(app) {
    app.component('G1000PFD', G1000PFD)
  }
}

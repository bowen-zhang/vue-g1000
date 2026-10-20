import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: { entry: 'src/index.js', name: 'VueG1000', fileName: 'vue-g1000' },
    rollupOptions: {
      external: ['vue', 'konva', 'vue-konva'],
      output: { exports: 'named', globals: { vue: 'Vue', konva: 'Konva', 'vue-konva': 'VueKonva' } }
    }
  },
  test: { environment: 'node' }
})

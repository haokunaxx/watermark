import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
export default defineConfig({
  plugins: [
    dts({
      rollupTypes: true,
    })
  ],
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/index.ts',
      name: 'WaterMark',
      fileName: (format) => `WaterMark.${format}.js`
    }    
  }
})
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'react-native',
  format: ['cjs'], // Build for commonJS and ESmodules
  dts: true, // Generate declaration file (.d.ts)
  splitting: false,
  sourcemap: false,
  clean: true,
  treeshake: true,
  minify: true,
})

import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/native-entry.ts'],
  outDir: 'react-native',
  format: ['cjs', 'esm'], // Build for commonJS and ESmodules
  dts: true, // Generate declaration file (.d.ts)
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: true,
  external: ['react-native', 'react'],
})

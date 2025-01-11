import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';

export default defineConfig({
    // base: '/lilt/', // uncomment if you have a non-default base dir e.g. https://hikar.org/lilt
    plugins: [react(), mdx()]
});

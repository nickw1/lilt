import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    // base: '/lilt/', // uncomment if you have a non-default base dir e.g. https://hikar.org/lilt
    plugins: [react()],
    port: 3002,
    resolve: { external: ["cookie"] }
});

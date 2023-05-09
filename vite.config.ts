import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslintPlugin from 'vite-plugin-eslint';
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        eslintPlugin({
            emitWarning: true,
            fix: true,
        }),
        checker({
            typescript: true,
        }),
    ],
    server: {
        watch: {
            usePolling: true,
        },
    },
});

import { defineConfig } from "vite";

const tiledPlugin = () => {
    return {
        name: 'tiled-tileset-plugin',
        resolveId: {
            order: 'pre',
            handler(sourceId, importer, options) {
                if (!sourceId.endsWith(".tsx")) return;
                return { id: 'tileset:' + sourceId, external: 'relative' }
            }
        }
    };
}

export default defineConfig({
    base: './', // optionally give a base path, useful for itch.io to serve relative instead of the default absolut
    plugins: [tiledPlugin()], // hint vite that tiled tilesets should be treated as external
    // currently excalibur plugins are commonjs
    // this forces vite to keep things from bundling ESM together with commonjs
    optimizeDeps: {
        exclude: ["excalibur"],
    },
    build: {
        assetsInlineLimit: 0, // excalibur cannot handle inlined xml in prod mode
        sourcemap: true,
        // Vite uses rollup currently for prod builds so a separate config is needed
        // to keep vite from bundling ESM together with commonjs
        rollupOptions: {
            output: {
                format: 'umd'
            }
        }
    }
});

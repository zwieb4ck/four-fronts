import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        dts({
            rollupTypes: true,
        }),
    ],
    build: {
        outDir: "./lib",
        minify: false,
        sourcemap: true,
        lib: {
            // src/indext.ts is where we have exported the component(s)
            entry: resolve(__dirname, "src/index.ts"),
            name: "SharedModules",
            // the name of the output files when the build is run
            fileName: "shared-modules",
            formats: ["es"],
        },
    },
});

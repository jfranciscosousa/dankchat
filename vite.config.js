export default {
  publicDir: "./assets/static",
  build: {
    target: "es2018",
    minify: true,
    outDir: "./priv/static",
    emptyOutDir: true,
    rollupOptions: {
      input: ["assets/js/app.js", "assets/css/app.css"],
      output: {
        entryFileNames: "js/[name].js",
        chunkFileNames: "js/[name].js",
        assetFileNames: "[ext]/[name][extname]",
      },
    },
    assetsInlineLimit: 0,
  },
  define: {
    global: "globalThis",
  },
};

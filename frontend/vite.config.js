import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Prebundle cả thư viện ở các trang lazy để không đổi cache khi vừa mở admin.
  optimizeDeps: { include: ['recharts', 'react-quill-new', 'xlsx'] },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react/') || id.includes('react-dom/') || id.includes('react-router-dom/')) {
              return 'vendor-react';
            }
            if (id.includes('recharts')) {
              return 'vendor-charts';
            }
            if (id.includes('react-quill-new')) {
              return 'vendor-editor';
            }
            if (id.includes('xlsx')) {
              return 'vendor-xlsx';
            }
            if (id.includes('lucide-react') || id.includes('sonner') || id.includes('sweetalert2') || id.includes('swiper')) {
              return 'vendor-ui';
            }
          }
        },
      },
    },
  },
});

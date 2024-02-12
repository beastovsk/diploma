import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	// server: {
	// 	proxy: {
	// 		"/index.php": {
	// 			target: "https://tbs2.gaminatorv.com/_engine/api_admin.php",
	// 			secure: false,
	// 			changeOrigin: true,
	// 		},
	// 	},
	// },
});

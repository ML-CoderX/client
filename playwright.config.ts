import { defineConfig } from "@playwright/test";
export default defineConfig({ testDir: "./tests", fullyParallel: false, workers: 1, timeout: 90000, use: { baseURL: process.env.TEST_BASE_URL || "http://localhost:3001", channel: "chrome", headless: true, viewport: {width:1440,height:1000} }, reporter: [["list"],["html",{open:"never"}]] });

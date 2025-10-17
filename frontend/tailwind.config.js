/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}", // Tailwind schaut in alle React-Dateien rein
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}
// Workshift - preset Tailwind v3. module.exports = { presets: [require('./tailwind.preset.js')] }
module.exports = {
  theme: {
    extend: {
      colors: {
        'sage': '#E6E8DD',
        'lime': '#9CE069',
        'lime-deep': '#81C44E',
        'ink': '#000000',
        'white': '#FFFFFF',
        'muted-dark': '#595959',
        'muted-light': '#AAAAAA',
        'destructive': '#DD453D',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: { card: '20px', panel: '24px' },
      maxWidth: { site: '1320px' },
      transitionTimingFunction: { ws: 'cubic-bezier(0.21, 0.47, 0.32, 0.98)' },
    },
  },
};

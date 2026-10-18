import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: '#00f0ff',
          pink: '#ff2bd6',
          purple: '#8a2bff',
          yellow: '#ffe600',
          green: '#39ff14',
        },
        ink: '#05070d',
      },
      fontFamily: {
        display: ['"Orbitron"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        scanline: 'scanline 6s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%,100%': { boxShadow: '0 0 10px #00f0ff, 0 0 30px #00f0ff55' },
          '50%': { boxShadow: '0 0 25px #00f0ff, 0 0 60px #00f0ff88' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [
    // Custom variant for "this device's primary input is a mouse/trackpad"
    // (as opposed to touch) — used by the HUD to pick desktop vs. mobile
    // layout based on actual input capability rather than viewport width,
    // since a touch device (phone landscape, tablet) can easily be wider
    // than the `sm:` breakpoint.
    plugin(({ addVariant }) => {
      addVariant('pointer-fine', '@media (pointer: fine)');
      // Short viewports (landscape phones): not enough vertical room for a
      // top cluster + a separately bottom-anchored cluster to both exist
      // without the bottom one climbing into the top one.
      addVariant('short', '@media (max-height: 500px)');
    }),
  ],
};

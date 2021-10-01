module.exports = {
    mode: 'jit',
    purge: {
      enabled: true,
      content: ['_site/**/*.html'],
      options: {
        safelist: [],
      },
    },
    theme: {
      extend: {
        colors: {
          change: 'transparent',
        },
      },
    },
    variants: {},
    plugins: [],
  }
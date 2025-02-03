export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,

  modules: [
    '@vueuse/nuxt',
    '@nuxt/image',
    'nuxt-typed-router',
    'nuxt-file-storage',
    'nuxt-svgo',
    '@pinia/nuxt',
  ],

  svgo: {
    autoImportPath: '~/assets/svg',
    componentPrefix: 'svg',
  },

  app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon/favicon-96x96.png',
          sizes: '96x96',
        },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon/favicon.svg' },
        { rel: 'shortcut icon', href: '/favicon/favicon.ico' },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/favicon/apple-touch-icon.png',
        },
        { rel: 'manifest', href: '/favicon/site.webmanifest' },
      ],
      meta: [{ name: 'apple-mobile-web-app-title', content: 'Prismium UI' }],
    },
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
  },

  plugins: [
    '~/plugins/has-polyfill.client.js',
    '~/plugins/blank-polyfill.client.js',
    '~/plugins/global-sizes.client.js',
  ],

  image: {
    dir: 'assets/images',
    quality: 80,
    format: ['avif', 'webp', 'jpg', 'jpeg', 'png', 'gif'],
    densities: [1, 2],
  },

  css: ['~/assets/scss/main.scss'],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use '~/assets/scss/mixins/media' as *;
            @use '~/assets/scss/mixins/mini' as *;
            @use '~/assets/scss/mixins/disable-mob-hover' as *;
            @use '~/assets/scss/mixins/pseudo-hover' as *;
            @use '~/assets/scss/mixins/scrollbar' as *;
          `,
          silenceDeprecations: ['legacy-js-api', 'import'],
        },
      },
      devSourcemap: true,
    },
  },

  postcss: {
    plugins: {
      'postcss-media-minmax': {},
      'css-blank-pseudo': { preserve: false },
      '@csstools/postcss-is-pseudo-class': {
        preserve: false,
        onComplexSelector: 'warning',
        onPseudoElement: 'warning',
      },
      'css-has-pseudo': { preserve: true },
      autoprefixer: {},
    },
  },

  compatibilityDate: '2024-12-16',
});

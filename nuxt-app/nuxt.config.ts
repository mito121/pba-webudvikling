// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    // app: {
    //     head: {
    //         meta: [
    //             { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    //         ],
    //     },
    // },
    pages: true,

    // serverHandlers: [
    //     { route: '*', handler: 'middleware/index.js' }
    // ],

    alias: {
        "@": "/<rootDir>"
    },

    css: [
        'assets/scss/main.scss'
    ]

})

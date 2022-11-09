export default defineEventHandler(async (event) => {
    const { count } = await $fetch('https://api.publicapis.org/entries')
    return {
        count
    }
})
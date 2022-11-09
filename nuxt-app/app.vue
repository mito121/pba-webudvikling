<script>
export default {
  async setup() {
    const data = reactive({
      nWord: "naga"
    })

    /* If using async setup(), make sure to register lifecycle hooks before the first await statement. */
    onMounted(() => {
      console.log("app mounted")
    })

    const fetchData = await $fetch('/api/hello')
    console.log(fetchData)


    return {
      data
    }
  }
}
</script>

<template>
  <div>
    <nav>
      <NuxtLink to="/">home</NuxtLink>
      <NuxtLink to="/about">page 1</NuxtLink>
    </nav>
    <p>nWord: {{ data.nWord }}</p>
    <input type="text" v-model="data.nWord">
    <LazyNuxtPage />
  </div>
</template>

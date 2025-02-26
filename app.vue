<template>
  <main class="container">
    <nav>
      <ul>
        <li><nuxt-link to="/">Home</nuxt-link></li>
      </ul>
    </nav>
    Hi Fusion 2025!
    <form @submit.prevent="handleSubmission">
      <input v-model="prompt" type="text" placeholder="How do you want things to change?" />
      <button :aria-busy="loading">Submit request</button>
    </form>
    <MalleableComponent />
  </main>
</template>

<script setup lang="ts">
import '@picocss/pico'

const prompt = ref('')

const malleables = reactive({
  query: `query List {
  cards {
    name
    abilities {
      effect
      name
      type
    }
    evolveFrom
    category
    rarity
    energyType
    attacks {
      cost
      damage
      effect
    }
    description
  }
}`,
template: `<ul>
  <li v-for="card in data?.data.cards || []">
    {{ card.name }}
  </li>
</ul>`
})

const loading = ref(false)
async function handleSubmission() {
  loading.value = true
  try {
    const res = await $fetch('/api/completion', {
      method: 'POST',
      body: {
        malleables,
        prompt: prompt.value
      }
    })
    console.log(res)
    Object.assign(malleables, res)
  } catch (e) {
    console.error(e)
  }
  loading.value = false
}

const MalleableComponent = defineComponent({
  async setup () {
    const { data } = await useFetch('https://api.tcgdex.net/v2/graphql', {
      method: 'POST',
      body: {
        query: malleables.query
      }
    })

    return () => h({
      data: () => ({ data }),
      template: malleables.template
    })
  }
})
</script>

<template>
<button @click="setGame(true)">Snake</button>
<button @click="setGame(false)">Flappy Bird</button>
<div>{{ selected ? 'Snake' : 'Flappy Bird' }}</div>
<Snake v-if="selected"/>
<Flappy v-else/>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Snake from './games/Snake/Index.vue'
import Flappy from './games/FlappyBird/Index.vue'
export default defineComponent({
  name: 'App',
  setup(){
    const selected = ref(true)
    function setGame(v: boolean){
      selected.value = v
    }
    return{
      selected,
      setGame
    }
  },
  components:{
    Snake,
    Flappy
  }
})
</script>

<style></style>

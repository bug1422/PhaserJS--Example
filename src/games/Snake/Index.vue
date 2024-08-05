<script setup lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import StartGame from '../../config';
import { AUTO } from 'phaser';
import { Main } from './scenes/Main';

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 640 ,
    height: 480,
    backgroundColor: '#028af8',
    scene: [
        Main
    ]
}

const game = ref()

onMounted(() => {
    game.value = StartGame(config,'game-container')
})
onUnmounted(() => {
    if (game.value){
        game.value.destroy(true)
        game.value = null
    }
})

</script>
<script lang="ts">
export default defineComponent({
    name: "Snake"
})
</script>
<template>
        <div id="game-container"></div>
</template>
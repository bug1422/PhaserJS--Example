<script setup lang="ts">
import { AUTO } from 'phaser';
import { Main } from './scenes/Main';
import { onMounted, onUnmounted, ref } from 'vue';
import StartGame from '../../config';


const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1280,
    height: 720,
    backgroundColor: '#028af8',
    physics:{
        default: 'matter',
        matter: {
            gravity: { x:0, y: 1 },
            debug: false
        }
    },
    scene: [
        Main
    ]
}

const game = ref()

onMounted(()=>{
    game.value = StartGame(config,'game-container')
})

onUnmounted(()=>{
    if(game.value){
        game.value.destroy(true)
        game.value = null
    }
})
</script>

<template>
    <div class="game-container"></div>
</template>
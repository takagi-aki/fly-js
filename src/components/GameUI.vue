<template>
  <span v-if="game_run" v-bind:score="score">
    <div>
      <p>SCORE: {{ score }}</p>
    </div>
  </span>
  <span v-else v-bind:score="score" v-bind:restart_func="restart_func">
    <div class="popup">
      <p>SCORE: {{ score }}</p>
      <button v-on:click="restart_func">restart</button>
    </div>
  </span>
</template>


<script lang="ts">
import { computed, defineComponent, toRef } from "vue";

export default defineComponent({
  props: {
    is_gameover: Boolean,
    score: Number,
    restart_func: Function,
  },
  components: {},
  setup(props, context) {
    const game_run = computed(() => !toRef(props, "is_gameover").value);
    return {
      game_run: game_run,
      score: toRef(props, "score"),
      restart_func: toRef(props, "restart_func"),
    };
  },
});
</script>


<style>
.popup {
  color: red;
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 3% 10%;
  transform : translate(-50%,-50%);
  border: 3px solid black;
  border-radius: 10px;
  background: whitesmoke;
  text-align: center;
}
</style>

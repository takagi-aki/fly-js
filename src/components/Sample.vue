<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {},
    components: {},
    setup(props, context) {
      return {
        greeting: "Hello World!",
      };
    },
  });
</script>

<template>
  <p class="greeting">{{ greeting }}</p>
  <p class="greeting">{{ hoge }}</p>
</template>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
</style>

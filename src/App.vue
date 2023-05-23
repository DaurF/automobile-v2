<template>
  <TheHeader />
  <div id="app">
    <div class="container py-4">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import TheHeader from "@/layout/TheHeader.vue";
</script>

<style scoped></style>

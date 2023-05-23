<template>
  <div class="row gap-4">
    <div v-for="car in cars" :key="car.id" class="col">
      <RouterLink :to="{ name: 'CarShow', params: { id: car.id } }">
        <CarListItem :car="car" />
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Car } from "@/stores/CarsStore";
import CarListItem from "./CarListItem.vue";

defineProps<{ cars: Car[] }>();
</script>

<style scoped></style>

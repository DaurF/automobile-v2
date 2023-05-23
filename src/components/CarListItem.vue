<template>
  <div class="card mb-3">
    <img :src="car.url" class="card-img-top" alt="Car Image" />
    <div class="card-body">
      <h5 class="card-title">{{ `${car.make} ${car.model}` }}</h5>
      <p class="card-text">Price: {{ price }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
import { useCarsStore, type Car } from "@/stores/CarsStore";

const props = defineProps<{ car: Car }>();
const { car } = toRefs(props);

const price = useCarsStore().price(car.value.id);
</script>

<style scoped>
.card-img-top {
  height: 10rem;
  object-fit: cover;
  object-position: center;
}
</style>

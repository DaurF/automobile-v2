<template>
  <section>
    <h1 class="py-3 fs-2 text-center text-uppercase fw-light">Автомобили</h1>
    <div class="container-fluid">
      <CarList :cars="carList" />
    </div>
  </section>
</template>

<script setup lang="ts">
import CarList from "@/components/CarList.vue";
import { computed, onMounted } from "vue";
import { useCarsStore } from "@/stores/CarsStore";
import { storeToRefs } from "pinia";

const { carList } = useCarsStore();
</script>

<style scoped lang="scss"></style>

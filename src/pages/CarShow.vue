<template>
  <section class="section-car d-flex p-2">
    <div class="card car__card">
      <img :src="car.url" class="img-fluid" alt="Car Image" />

      <div class="card-body">
        <h5 class="card-title">{{ `${car.make} ${car.model}` }}</h5>
        <p class="card-text">Price: {{ carPrice }}</p>
      </div>
    </div>

    <div class="details">
      <DetailsTreeView v-if="details(id).length" :nodes="details(id)" />
      <div v-else class="not-found ms-5">
        <h4>Деталей не найдено</h4>
        <button
          class="btn btn-success"
          type="button"
          id="dropdownMenuButton"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <AddPlus />
          Добавить
        </button>
        <div class="dropdown-menu">
          <form class="px-4 py-2" @submit.prevent="onSubmit(id)">
            <div class="mb-3">
              <label for="name" class="form-label">Название</label>
              <input
                type="text"
                class="form-control"
                id="name"
                placeholder="Двигатель"
                v-model="form.name"
              />
            </div>
            <div class="mb-3">
              <label for="price" class="form-label"> Цена </label>
              <input
                type="number"
                class="form-control"
                id="price"
                placeholder="10"
                min="0"
                v-model="form.price"
              />
            </div>

            <div class="mb-3">
              <label for="quantity" class="form-label"> Кол-во </label>
              <input
                type="number"
                class="form-control"
                id="quantity"
                placeholder="1"
                min="0"
                v-model="form.quantity"
              />
            </div>
            <button type="submit" class="btn btn-success">Добавить</button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";
import { useCarsStore } from "@/stores/CarsStore";
import DetailsTreeView from "@/components/DetailsTreeView.vue";
import { useDetailsStore } from "@/stores/DetailsStore";

const props = defineProps<{
  id: string;
}>();

const { carById, price, details } = useCarsStore();

const car = computed(() => carById(props.id));
const carPrice = computed(() => price(car.value.id));

const form = reactive<{
  name: string;
  price: null | number;
  quantity: number;
}>({
  name: "",
  price: null,
  quantity: 1,
});

const detailsStore = useDetailsStore();

function onSubmit(id: string) {
  if (form.name === "" || form.price === null) {
    return;
  }

  detailsStore.add({ car_id: id, data: form });

  clearForm();
}

function clearForm() {
  form.name = "";
  form.price = null;
  form.quantity = 1;
}
</script>

<style scoped lang="scss">
.car {
  &__card {
    max-width: 40%;
  }
}
</style>

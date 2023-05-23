<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link :to="{ name: 'Home' }" class="navbar-brand">
        <IconPorsche />
      </router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link
              :to="{ name: 'Cars' }"
              class="nav-link"
              aria-current="page"
            >
              Машины
            </router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'Details' }" class="nav-link" href="#">
              Детали
            </router-link>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Действия
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li><a class="dropdown-item" href="#">Action</a></li>
              <li><a class="dropdown-item" href="#">Another action</a></li>
              <li><hr class="dropdown-divider" /></li>
              <li><a class="dropdown-item" href="#">Something else here</a></li>
            </ul>
          </li>
          <!-- <li class="nav-item">
            <a
              class="nav-link disabled"
              href="#"
              tabindex="-1"
              aria-disabled="true"
              >Disabled</a
            >
          </li> -->
        </ul>
        <!-- <form class="d-flex">
          <input
            class="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form> -->
        <button
          class="btn btn-success d-flex align-items-center gap-1"
          type="button"
          @click="exportExcel"
        >
          <IconExcel />
          Скачать таблицу
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import IconExcel from "@/components/icons/IconExcel.vue";
import IconPorsche from "@/components/icons/IconPorsche.vue";
import { useCarsStore, type Car } from "@/stores/CarsStore";
import { useDetailsStore, type Detail } from "@/stores/DetailsStore";
import { utils, writeFile } from "xlsx";

const { carList } = useCarsStore();
const { detailList, totalPrice } = useDetailsStore();

function exportExcel() {
  const carsSheetData = [
    ["ID", "Марка", "Модель", "Картинка", "Детали"],
    ...carList.map((car: Car) => [
      car.id,
      car.make,
      car.model,
      car.url,
      car.details.join(", "),
    ]),
  ];
  const detailsSheetData = [
    ["ID", "Название", "Цена", "Кол-во", "Детали", "Стоимость"],
    ...detailList.map((detail: Detail) => [
      detail.id,
      detail.name,
      detail._price,
      detail.quantity,
      detail.children.join(", "),
      totalPrice(detail.id),
    ]),
  ];
  const workbook = utils.book_new();
  const carsSheet = utils.sheet_add_aoa(utils.aoa_to_sheet([]), carsSheetData);
  const detailsSheet = utils.sheet_add_aoa(
    utils.aoa_to_sheet([]),
    detailsSheetData
  );
  utils.book_append_sheet(workbook, carsSheet, "Машины");
  utils.book_append_sheet(workbook, detailsSheet, "Детали");

  writeFile(workbook, "cars.xlsx");
}
</script>

<style scoped lang="scss">
.router-link-exact-active {
  color: #000;
}
</style>

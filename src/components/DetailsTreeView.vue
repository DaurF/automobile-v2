<template>
  <ul v-if="nodes.length">
    <!-- :class="{ 'tree-level-down': treeLevel }" -->

    <li
      v-for="node in nodes"
      :key="node.id"
      class="node__list"
      :style="{ 'margin-left': !node.children.length ? '2.8rem' : '1rem' }"
    >
      <div class="d-flex">
        <button @click="expanded = !expanded" v-if="node.children.length">
          <ArrowRight v-if="!expanded" />
          <ArrowDown v-else />
        </button>
        <div class="node__content">
          <span class="node__name">{{ node.name }}</span>
          <div class="node__actions">
            <div class="btn-group gap-2">
              <button
                @click="edit(node.id)"
                class="node__action node__action--edit"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <EditOutline />
                Редактировать
              </button>
              <button
                @click="add"
                class="node__action node__action--add"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <AddPlus />
                Добавить
              </button>
              <div class="dropdown-menu">
                <form class="px-4 py-2" @submit.prevent="onSubmit(node.id)">
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
                  <button
                    v-if="!editMode"
                    type="submit"
                    class="btn btn-success"
                  >
                    Добавить
                  </button>
                  <button v-else type="submit" class="btn btn-primary">
                    Обновить
                  </button>
                </form>
              </div>
            </div>
            <button
              @click="onDeleteDetail(node.id)"
              type="button"
              class="node__action node__action--delete"
            >
              <DeleteOutline />
              Удалить
            </button>
          </div>
        </div>
      </div>

      <DetailsTreeView
        v-if="expanded && node.children.length"
        :nodes="detailsStore.children(node.id)"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useDetailsStore, type Detail } from "@/stores/DetailsStore";
import { ref, reactive } from "vue";
import ArrowRight from "@/components/icons/IconArrowRight.vue";
import ArrowDown from "@/components/icons/IconArrowDown.vue";
import AddPlus from "@/components/icons/IconAdd.vue";
import DeleteOutline from "@/components/icons/IconDelete.vue";
import EditOutline from "@/components/icons/IconEdit.vue";

defineProps<{
  nodes: Detail[];
}>();

const detailsStore = useDetailsStore();

const expanded = ref(false);
const editMode = ref(false);
const form = reactive<{
  name: string;
  price: null | number;
  quantity: number;
}>({
  name: "",
  price: null,
  quantity: 1,
});

function onDeleteDetail(id: string) {
  detailsStore.delete(id);
}

function onSubmit(id: string) {
  if (form.name === "" || form.price === null) {
    return;
  }

  if (editMode.value) {
    detailsStore.update(id, form);
    editMode.value = false;
  } else {
    detailsStore.add({ parent_id: id, data: form });
  }
  clearForm();
}

function clearForm() {
  form.name = "";
  form.price = null;
  form.quantity = 1;
}

function edit(id: string) {
  editMode.value = true;
  const { name, quantity, _price: price } = detailsStore.detailById(id);
  form.name = name;
  form.quantity = quantity;
  form.price = price;
}

function add() {
  editMode.value = false;
  clearForm();
}
</script>

<style scoped lang="scss">
.node {
  display: flex;
  flex-direction: column;

  &__list {
    margin-top: 0.5rem;
  }

  &__content {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &__actions {
    display: flex;
    gap: 0.6rem;
  }

  &__action {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.15rem;
    font-size: 0.9rem;

    padding: 0.2rem 0.4rem;
    border-radius: 7px;

    transition: all 0.2s;

    &--add {
      color: #22c55e;
      background-color: #bbf7d0;
      border: 1px solid #22c55e;

      &:hover {
        background-color: #86efac;
      }
    }

    &--delete {
      color: #ef4444;
      background-color: #fecaca;
      border: 1px solid #ef4444;

      &:hover {
        background-color: #fca5a5;
      }
    }

    &--edit {
      color: #3b82f6;
      background-color: #bfdbfe;
      border: 1px solid #3b82f6;

      &:hover {
        background-color: #7dd3fc;
      }
    }
  }
}
</style>

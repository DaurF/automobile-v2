import { defineStore } from "pinia";
import { useCarsStore } from "./CarsStore";
import { nanoid } from "nanoid";

type Detail = {
  car_id?: string;
  parent_id?: string;
  id: string;
  name: string;
  _price: number;
  quantity: number;
  children: string[];
};

const useDetailsStore = defineStore("DetailsStore", {
  state() {
    return {
      details: [
        {
          car_id: "1",
          id: "11",
          name: "Кузов",
          quantity: 1,
          _price: 100,
          children: ["12"],
        },
        {
          car_id: "2",
          id: "22",
          name: "Двигатель",
          quantity: 2,
          _price: 250,
          children: [],
        },
        {
          car_id: "3",
          id: "33",
          name: "Окно",
          quantity: 4,
          _price: 50,
          children: [],
        },
        {
          parent_id: "11",
          id: "12",
          name: "Подвески",
          quantity: 4,
          _price: 50,
          children: [],
        },
      ] as Detail[],
    };
  },
  getters: {
    detailList: ({ details }) => details,
    detailById:
      ({ details }) =>
      (id: string): Detail => {
        const detail = details.find((detail: Detail) => detail.id === id);

        if (!detail) throw new ReferenceError("Detail was not found!🥲");

        return detail;
      },
    price() {
      return (id: string, total: boolean): number => {
        const detail = this.detailById(id);

        if (detail.children.length === 0) {
          if (total) {
            return detail._price * detail.quantity;
          } else {
            return detail._price;
          }
        }

        const price = detail.children.reduce(
          (acc: number, detailId: string) => acc + this.price(detailId, true),
          0
        );

        if (total) {
          return price * detail.quantity;
        }

        return price;
      };
    },
    totalPrice() {
      return (id: string): number => {
        const detail = this.detailById(id);
        return this.price(id, true) * detail.quantity;
      };
    },
    children:
      ({ details }) =>
      (id: string): Detail[] =>
        details.filter((detail: Detail) => detail.parent_id === id),
    descendants() {
      return (id: string): string[] => {
        const detail = this.detailById(id);

        if (detail.children.length === 0) {
          return [detail.id];
        }

        return [
          detail.id,
          ...detail.children.map((id: string) => this.descendants(id)),
        ] as string[];
      };
    },
  },
  actions: {
    delete(id: string) {
      // Удалить id этой детали в родителе (машина/ст. деталь)
      this.deleteInParent(id);

      // Удалить все дочерние детали из массива 'details'
      const descendants = this.descendants(id).flat(999);
      this.details = this.details.filter(
        (detail: Detail) => !descendants.includes(detail.id)
      );
    },
    deleteInParent(id: string) {
      const detail = this.detailById(id);

      if (detail.parent_id) {
        const parentDetail = this.detailById(detail.parent_id);
        const index = parentDetail.children.indexOf(id);
        parentDetail.children.splice(index, 1);
      } else if (detail.car_id) {
        const car = useCarsStore().carById(detail.car_id);
        const index = car.details.indexOf(id);
        car.details.splice(index, 1);
      }
    },
    add(payload: { parent_id?: string; car_id?: string; data: any }) {
      const { parent_id, car_id, data } = payload;
      const id = nanoid();

      const { price: _price, ...rest } = data;

      if (parent_id) {
        const newDetail = {
          ...rest,
          _price,
          parent_id,
          id,
          children: [],
        } as Detail;

        // Добавить в детали родителя
        this.detailById(parent_id).children.push(id);

        // Добавить в общие детали
        this.details.push(newDetail);
      } else if (car_id) {
        const newDetail = {
          ...rest,
          _price,
          car_id,
          id,
          children: [],
        } as Detail;

        // Добавить в детали машины
        useCarsStore().carById(car_id).details.push(id);

        // Добавить в общие детали
        this.details.push(newDetail);
      }
    },
    update(id: string, data: any) {
      const { price: _price, ...rest } = data;

      const updatedDetail = {
        ...this.detailById(id),
        ...rest,
        _price,
      };
      const index = this.details.findIndex(
        (detail: Detail) => detail.id === id
      );

      this.details.splice(index, 1, updatedDetail);
    },
  },
});

export { type Detail, useDetailsStore };

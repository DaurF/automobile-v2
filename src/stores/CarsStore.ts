import { defineStore } from "pinia";
import { useDetailsStore } from "./DetailsStore";

type Car = {
  id: string;
  make: string;
  model: string;
  url: string;
  details: string[];
};

const useCarsStore = defineStore("CarsStore", {
  state() {
    return {
      cars: [
        {
          id: "1",
          make: "Porsche",
          model: "911",
          url: "https://files.porsche.com/filestore/image/multimedia/none/992-gt3-modelimage-sideshot/model/765dfc51-51bc-11eb-80d1-005056bbdc38/porsche-model.png",
          details: ["11"],
        },
        {
          id: "2",
          make: "Tesla",
          model: "Model X",
          url: "https://www.pngmart.com/files/22/Tesla-PNG-Transparent.png",
          details: ["22"],
        },
        {
          id: "3",
          make: "Mercedes",
          model: "E 53",
          url: "https://images.carandbike.com/car-images/colors/mercedes-amg/e-53/mercedes-amg-e-53-hi-tech-silver.png?v=1626785840",
          details: ["33"],
        },
      ] as Car[],
    };
  },
  getters: {
    carList({ cars }) {
      return cars;
    },
    carById:
      ({ cars }) =>
      (id: string): Car => {
        const car = cars.find((car: Car) => car.id === id);

        if (!car) throw new ReferenceError("Car was not found!🥲");

        return car;
      },
    price() {
      return (id: string): number => {
        const { totalPrice } = useDetailsStore();
        const car = this.carById(id);

        if (car.details.length === 0) return 0;

        return car.details.reduce(
          (acc: number, detailId: string) => acc + totalPrice(detailId),
          0
        );
      };
    },
    details() {
      return (id: string) => {
        const car = this.carById(id);
        const { detailById } = useDetailsStore();
        return car.details.map((id: string) => detailById(id));
      };
    },
    deleteDetail() {
      return (id: string) => {
        const detailsStore = useDetailsStore();
        const { detailById, descendants } = detailsStore;
        const detail = detailById(id);
        detailsStore.delete(id);
      };
    },
  },
});

export { type Car, useCarsStore };

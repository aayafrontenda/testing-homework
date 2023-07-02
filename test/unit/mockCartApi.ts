import { LOCAL_STORAGE_CART_KEY } from "../../src/client/api";
import { CartState } from "../../src/common/types";

export const CART_STATE: CartState = {
  0: {
    count: 1,
    name: "Practical Ball",
    price: 159,
  },
  1: {
    count: 5,
    name: "Licensed Bike",
    price: 680,
  },
};

export let EMPTY_CART_STATE: CartState = {};

export class MockCartApi {
  state: CartState;
  constructor(state: CartState) {
    this.state = state;
  }
  getState(): CartState {
    try {
      const json = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      return this.state;
    } catch {
      return {};
    }
  }

  setState(cart: CartState) {
    localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));
  }
}

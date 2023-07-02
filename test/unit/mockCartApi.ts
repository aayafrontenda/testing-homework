import { LOCAL_STORAGE_CART_KEY } from "../../src/client/api";
import { CartState } from "../../src/common/types";

export class MockCartApi {
  state: CartState;
  constructor(state: CartState) {
    this.state = state;
  }
  getState(): CartState {
    try {
      const json = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      return (JSON.parse(json) as CartState) || {};
    } catch {
      return {};
    }
  }

  setState(cart: CartState) {
    localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));
  }
}
import React from "react";

import { render, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { Provider } from "react-redux";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from "react-router";
import { Application } from "../../src/client/Application";
import { ExampleApi } from "../../src/client/api";
import { ApplicationState, initStore } from "../../src/client/store";
import events from "@testing-library/user-event";
import { Action, Store } from "redux";
import { q } from "msw/lib/glossary-de6278a9";
import { CART_STATE, EMPTY_CART_STATE, MockCartApi } from "./mockCartApi";

const products = [
  {
    id: 0,
    name: "Practical Ball",
    price: 159,
  },
  {
    id: 1,
    name: "Licensed Bike",
    price: 680,
  },
  {
    id: 2,
    name: "Gorgeous Ball",
    price: 664,
  },
  {
    id: 3,
    name: "Sleek Chips",
    price: 713,
  },
  {
    id: 4,
    name: "Intelligent Chair",
    price: 608,
  },
  {
    id: 5,
    name: "Unbranded Keyboard",
    price: 739,
  },
  {
    id: 6,
    name: "Practical Chicken",
    price: 361,
  },
  {
    id: 7,
    name: "Handmade Soap",
    price: 950,
  },
  {
    id: 8,
    name: "Sleek Shirt",
    price: 668,
  },
  {
    id: 9,
    name: "Unbranded Bacon",
    price: 609,
  },
  {
    id: 10,
    name: "Rustic Sausages",
    price: 74,
  },
  {
    id: 11,
    name: "Ergonomic Keyboard",
    price: 774,
  },
  {
    id: 12,
    name: "Gorgeous Bike",
    price: 748,
  },
  {
    id: 13,
    name: "Ergonomic Keyboard",
    price: 632,
  },
  {
    id: 14,
    name: "Unbranded Pizza",
    price: 979,
  },
  {
    id: 15,
    name: "Sleek Ball",
    price: 876,
  },
  {
    id: 16,
    name: "Incredible Pants",
    price: 845,
  },
  {
    id: 17,
    name: "Gorgeous Sausages",
    price: 19,
  },
  {
    id: 18,
    name: "Handmade Hat",
    price: 156,
  },
  {
    id: 19,
    name: "Sleek Chicken",
    price: 734,
  },
  {
    id: 20,
    name: "Refined Salad",
    price: 894,
  },
  {
    id: 21,
    name: "Tasty Towels",
    price: 10,
  },
  {
    id: 22,
    name: "Generic Computer",
    price: 754,
  },
  {
    id: 23,
    name: "Intelligent Shirt",
    price: 290,
  },
  {
    id: 24,
    name: "Incredible Sausages",
    price: 405,
  },
  {
    id: 25,
    name: "Handmade Towels",
    price: 59,
  },
  {
    id: 26,
    name: "Rustic Soap",
    price: 39,
  },
];

const BUG_ID = process.env.BUG_ID ? `?bug_id=${process.env.BUG_ID}` : "";

const handlers = products
  .map((product, index) =>
    rest.get(`hw/store/api/products/${index}`, (req, res, ctx) => {
      return res(ctx.json(product));
    })
  )
  .concat(
    rest.get("hw/store/api/products", (req, res, ctx) => {
      return res(ctx.json(products));
    })
  );

const server = setupServer(...handlers);

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});

const setupPage = (
  pagePath: string,
  index: number = -1,
  api: ExampleApi,
  cart: MockCartApi,
  store: Store<ApplicationState, Action>
) => {
  const application = (
    <MemoryRouter
      initialEntries={index !== -1 ? [`${pagePath}/${index}`] : [pagePath]}
    >
      <Provider store={store}>
        <Application />
      </Provider>
    </MemoryRouter>
  );

  return render(application);
};

describe("Отображение товаров в каталоге", () => {
  it("В каталоге должны отображаться товары, список которых приходит с сервера", async () => {
    const api = new ExampleApi("/hw/store");
    const mockCartApi = new MockCartApi(EMPTY_CART_STATE);
    const store = initStore(api, mockCartApi);
    const { queryAllByTestId } = setupPage(
      `/catalog${BUG_ID}`,
      -1,
      api,
      mockCartApi,
      store
    );

    await waitFor(() => {
      for (let productId = 0; productId < products.length; productId++) {
        const product = queryAllByTestId(`${productId}`);
        expect(product[0]).toBeVisible();
      }
    });
  });

  it("Для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре", async () => {
    const api = new ExampleApi("/hw/store");
    const mockCartApi = new MockCartApi(EMPTY_CART_STATE);
    const store = initStore(api, mockCartApi);
    const { queryAllByTestId } = setupPage(
      `/catalog${BUG_ID}`,
      -1,
      api,
      mockCartApi,
      store
    );

    await waitFor(() => {
      for (let productId = 0; productId < products.length; productId++) {
        const product = queryAllByTestId(`${productId}`);
        const info = [
          product[1].querySelector(".ProductItem-Name"),
          product[1].querySelector(".ProductItem-Price"),
          product[1].querySelector(".ProductItem-DetailsLink"),
        ];

        for (let i = 0; i < info.length; i++) {
          expect(info[i]).not.toBeNull();
          expect(info[i]).toBeVisible();
        }
      }
    });
  });

  it(`На странице с подробной информацией отображаются: название товара, его описание, цена, цвет, материал и кнопка * * "добавить в корзину"`, async () => {
    const api = new ExampleApi("/hw/store");
    const mockCartApi = new MockCartApi(EMPTY_CART_STATE);
    const store = initStore(api, mockCartApi);
    for (let i = 0; i < products.length; i++) {
      const { container } = setupPage(
        `/catalog${BUG_ID}`,
        i,
        api,
        mockCartApi,
        store
      );
      await waitFor(() => {
        const info = [
          container.querySelector(".ProductDetails-Name"),
          container.querySelector(".ProductDetails-Description"),
          container.querySelector(".ProductDetails-Price"),
          container.querySelector(".ProductDetails-AddToCart"),
          container.querySelector(".ProductDetails-Color"),
          container.querySelector(".ProductDetails-Material"),
        ];

        for (let i = 0; i < info.length; i++) {
          expect(info[i]).not.toBeNull();
          expect(info[i]).toBeVisible();
        }
      });
    }
  });
});

describe("Удаление товаров из корзины", () => {
  it(`В корзине должна быть кнопка "очистить корзину", по нажатию на которую все товары должны удаляться`, async () => {
    const api = new ExampleApi("/hw/store");
    const mockCartApi = new MockCartApi(CART_STATE);
    const store = initStore(api, mockCartApi);
    await waitFor(async () => {
      const { container } = setupPage(
        `/cart${BUG_ID}`,
        -1,
        api,
        mockCartApi,
        store
      );

      const cartClearButton = container.querySelector(".Cart-Clear");
      await events.click(cartClearButton);
      const cartLink = container.querySelector(
        ".nav-link[href='/cart']"
      ).innerHTML;
      expect(cartLink).toBe("Cart");
    });
  });

  it(`Если корзина пустая, должна отображаться ссылка на каталог товаров`, async () => {
    const api = new ExampleApi("/hw/store");
    const mockCartApi = new MockCartApi(EMPTY_CART_STATE);
    const store = initStore(api, mockCartApi);

    const { container } = setupPage(
      `/cart${BUG_ID}`,
      -1,
      api,
      mockCartApi,
      store
    );
    const catalogLink = container.querySelector("a[href='/cart']");
    expect(catalogLink).toBeVisible();
  });
});

describe("Добавление товара в корзину", () => {
  it(`При нажатии на кнопку "Add to cart" товар добавляется в корзину`, async () => {
    const api = new ExampleApi("/hw/store");
    const mockCartApi = new MockCartApi({
      ...CART_STATE,
      3: {
        count: 1,
        name: "Product 3",
        price: 300,
      },
    });
    const store = initStore(api, mockCartApi);
    await waitFor(async () => {
      {
        const { container } = setupPage(
          `/cart${BUG_ID}`,
          -1,
          api,
          mockCartApi,
          store
        );

        const product = container.querySelector(`[data-testid="3"]`);
        expect(product).not.toBeNull();
        expect(product).toBeVisible();
      }
    });
  });

  it(`Если товар уже добавлен в корзину, в каталоге и на странице товара должно отображаться сообщение об этом`, async () => {
    const api = new ExampleApi("/hw/store");
    const mockCartApi = new MockCartApi(CART_STATE);
    const store = initStore(api, mockCartApi);
    const { container } = setupPage(
      `/catalog${BUG_ID}`,
      -1,
      api,
      mockCartApi,
      store
    );

    await waitFor(async () => {
      {
        const cartBadge = container
          .querySelectorAll('[data-testid="1"]')[0]
          .querySelector(".CartBadge");
        expect(cartBadge).not.toBeNull();
        expect(cartBadge).toBeVisible();
      }
      const cartBadge = container
        .querySelectorAll('[data-testid="1"]')[0]
        .querySelector(".CartBadge");
      expect(cartBadge).not.toBeNull();
      expect(cartBadge).toBeVisible();
    });
  });

  it(`Если товар уже добавлен в корзину, повторное нажатие кнопки "добавить в корзину" должно увеличивать его количество`, async () => {
    const api = new ExampleApi("/hw/store");
    const modifiedCartState = CART_STATE[0]
      ? {
          0: {
            count: CART_STATE[0].count + 1,
            name: "Practical Ball",
            price: 159,
          },
          1: {
            count: 5,
            name: "Licensed Bike",
            price: 680,
          },
        }
      : {
          CART_STATE,
        };

    const mockCartApi = new MockCartApi(modifiedCartState);
    const store = initStore(api, mockCartApi);

    const { container } = setupPage(
      `/catalog${BUG_ID}`,
      0,
      api,
      mockCartApi,
      store
    );

    const { queryAllByTestId } = setupPage(
      `/cart${BUG_ID}`,
      -1,
      api,
      mockCartApi,
      store
    );

    await waitFor(async () => {
      const addButton = container.querySelector(".ProductDetails-AddToCart");
      await events.click(addButton);

      const product = queryAllByTestId(`0`);
      expect(product.length).toBe(1);
      await events.click(addButton);
      const count = product[0].querySelector(".Cart-Count");
      expect(count.innerHTML).toBe("2");
    });
  });
});

describe("Отображение товаров в корзине", () => {
  it("В шапке рядом со ссылкой на корзину должно отображаться количество не повторяющихся товаров в ней", async () => {
    const api = new ExampleApi("/hw/store");
    const mockCartApi = new MockCartApi(CART_STATE);
    const store = initStore(api, mockCartApi);

    const { container } = setupPage(
      `/cart${BUG_ID}`,
      -1,
      api,
      mockCartApi,
      store
    );

    await waitFor(async () => {
      const cartLink = container.querySelector(".nav-link[href='/cart']");
      const count = cartLink.innerHTML
        .split(" ")[1]
        .replace("(", "")
        .replace(")", "");

      expect(count).toBe(Object.keys(CART_STATE).length.toString());
    });
  });

  it("В корзине должна отображаться таблица с добавленными в нее товарами", async () => {
    const api = new ExampleApi("/hw/store");
    const mockCartApi = new MockCartApi(CART_STATE);
    const store = initStore(api, mockCartApi);

    await waitFor(async () => {
      let { queryByTestId, container } = setupPage(
        `/cart${BUG_ID}`,
        -1,
        api,
        mockCartApi,
        store
      );

      const table = container.querySelector(".Cart-Table");
      expect(table).toBeVisible();

      const productIds = Object.keys(CART_STATE);
      for (const productId of productIds) {
        const product = queryByTestId(`${productId}`);
        const info = [
          product.querySelector(".Cart-Name"),
          product.querySelector(".Cart-Price"),
          product.querySelector(".Cart-Count"),
          product.querySelector(".Cart-Total"),
        ];

        for (let i = 0; i < info.length; i++) {
          expect(info[i]).not.toBeNull();
          expect(info[i]).toBeVisible();
        }
      }
    });
  });
});

describe("Перезагрузка страницы", () => {
  const { location } = window as any;

  beforeAll(() => {
    delete (window as any).location;
    (window as any).location = { reload: jest.fn() };
  });

  afterAll(() => {
    (window as any).location = location;
  });

  it("Содержимое корзины должно сохраняться между перезагрузками страницы", async () => {
    const api = new ExampleApi("/hw/store");
    const mockCartApi = new MockCartApi(CART_STATE);
    const store = initStore(api, mockCartApi);

    let { getByTestId } = setupPage(
      `/cart${BUG_ID}`,
      -1,
      api,
      mockCartApi,
      store
    );

    window.location.reload();
    await waitFor(async () => {
      const ids = Object.keys(CART_STATE);
      for (const id in ids) {
        const product = getByTestId(`${id}`);
        expect(product).not.toBeNull();
        expect(product).toBeInTheDocument();
      }
    });
  });
});

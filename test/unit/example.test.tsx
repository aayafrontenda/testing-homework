import React from "react";

import { render, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { Application } from "../../src/client/Application";
import { ExampleApi, CartApi } from "../../src/client/api";
import { initStore } from "../../src/client/store";
import { set } from "immer/dist/internal";

const handlers = [
  rest.get("hw/store/api/products", (req, res, ctx) => {
    return res(
      ctx.json([
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
      ])
    );
  }),
];

const server = setupServer(...handlers);

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});

const setupCatalog = () => {
  const api = new ExampleApi("/hw/store");
  const cart = new CartApi();
  const store = initStore(api, cart);

  const application = (
    <MemoryRouter initialEntries={["/catalog"]}>
      <Provider store={store}>
        <Application />
      </Provider>
    </MemoryRouter>
  );

  return render(application);
};

const setupCatalogProudct = (index: number) => {
  const api = new ExampleApi("/hw/store");
  const cart = new CartApi();
  const store = initStore(api, cart);

  const application = (
    <MemoryRouter initialEntries={[`/catalog/${index}`]}>
      <Provider store={store}>
        <Application />
      </Provider>
    </MemoryRouter>
  );

  return render(application);
};

describe("Отображение товаров", () => {
  it("В каталоге должны отображаться товары, список которых приходит с сервера", async () => {
    const { queryAllByTestId } = setupCatalog();

    await waitFor(() => {
      for (let productId = 0; productId < 27; productId++) {
        const product = queryAllByTestId(`${productId}`);
        const style = getComputedStyle(product[0]);
        const displayed = style.getPropertyValue("display") !== "none";
        expect(displayed).toBe(true);
      }
    });
  });
  it("Для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре", async () => {
    const { queryAllByTestId } = setupCatalog();

    await waitFor(() => {
      for (let productId = 0; productId < 27; productId++) {
        const product = queryAllByTestId(`${productId}`);
        const info = [
          product[1].querySelector(".ProductItem-Name"),
          product[1].querySelector(".ProductItem-Price"),
          product[1].querySelector(".ProductItem-DetailsLink"),
        ];

        for (let i = 0; i < info.length; i++) {
          const style = getComputedStyle(info[i]);
          const displayed = style.getPropertyValue("display") !== "none";
          expect(displayed).toBe(true);
        }
      }
    });
  });
});

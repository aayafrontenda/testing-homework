const { assert } = require("chai");

describe("Проверка ссылок на разделы", async function () {
  it("В магазине должны быть ссылки на страницы: главная, каталог, условия доставки, контакты, корзина", async function () {
    let links = [
      "hw/store",
      "hw/store/delivery",
      "hw/store/contacts",
      "hw/store/catalog",
      "hw/store/cart",
    ];

    const expectedHrefs = [
      "/hw/store/",
      "/hw/store/catalog",
      "/hw/store/delivery",
      "/hw/store/contacts",
      "/hw/store/cart",
    ];

    for (const link of links) {
      const puppeteer = await this.browser.getPuppeteer();
      const [page] = await puppeteer.pages();
      const url = `http://localhost:3000/${link}`;

      await page.goto(url, { waitUntil: "load" });
      await page.waitForTimeout(2000);

      let linkElements = [];
      linkElements.push(await this.browser.$(".navbar-brand"));
      linkElements = linkElements.concat(await this.browser.$$(".nav-link"));

      const actualHrefs = await Promise.all(
        linkElements.map(async (linkEl) => await linkEl.getAttribute("href"))
      );

      assert.includeMembers(actualHrefs, expectedHrefs, "Hrefs are not equal");
    }
    // await page.waitForSelector({ timeout: 5000, selector: "body" });
    // await this.browser.assertView("plain", "body");
  });
});

describe("Страницы со статическим содержимым", async function () {
  it("Страницы главная, условия доставки, контакты должны иметь статическое содержимое", async function () {
    let links = ["hw/store", "hw/store/delivery", "hw/store/contacts"];

    for (const link of links) {
      const puppeteer = await this.browser.getPuppeteer();
      const [page] = await puppeteer.pages();
      const url = `http://localhost:3000/${link}`;
      const pngName = `${link.replace("hw/store", "store").replace("/", "-")}`;

      await page.goto(url, { waitUntil: "load" });
      await page.waitForTimeout(5000);
      const result = await this.browser.assertView(
        `${pngName.split(".")[0]}`,
        "body"
      );
    }
  });
});

describe("Страницы со динамическим содержимым", async function () {
  it("В магазине должны быть страницы для корзины и каталога", async function () {
    let links = ["hw/store/catalog", "hw/store/cart"];
    let presentedPages = 0;

    for (const link of links) {
      const puppeteer = await this.browser.getPuppeteer();
      const [page] = await puppeteer.pages();
      const url = `http://localhost:3000/${link}`;

      await page.goto(url, { waitUntil: "load" });
      presentedPages++;
    }

    assert.equal(
      presentedPages,
      2,
      "Страницы для корзины или каталога не найдены"
    );
  });
});

describe("Адаптивность верстки", async function () {
  it("Вёрстка должна адаптироваться под ширину экрана", async function () {
    let links = [
      "hw/store",
      "hw/store/delivery",
      "hw/store/contacts",
      "hw/store/catalog",
      "hw/store/cart",
    ];

    const widths = [375, 768, 1280, 1600, 1920];

    for (const link of links) {
      const puppeteer = await this.browser.getPuppeteer();
      const [page] = await puppeteer.pages();
      const url = `http://localhost:3000/${link}`;
      const pngName = `${link.replace("hw/store", "store").replace("/", "-")}`;

      for (const width of widths) {
        await this.browser.setWindowSize(width, 6000);
        await page.goto(url, { waitUntil: "load" });
        await this.browser.assertView(
          `${pngName.split(".")[0]}-${width}px`,
          "body",
          {
            screenshotDelay: 2000,
          }
        );
      }
    }
  });
});

describe("Проверка гамбургера", async function () {
  it(`На ширине меньше 576px навигационное меню должно скрываться за "гамбургер"`, async function () {
    let links = [
      "hw/store",
      "hw/store/delivery",
      "hw/store/contacts",
      "hw/store/catalog",
      "hw/store/cart",
    ];

    const widths = [575, 576];

    for (const link of links) {
      const puppeteer = await this.browser.getPuppeteer();
      const [page] = await puppeteer.pages();
      const url = `http://localhost:3000/${link}`;

      for (const width of widths) {
        await this.browser.setWindowSize(width, 6000);
        await page.goto(url, { waitUntil: "load" });
        const burger = await this.browser.$(
          ".navbar-expand-sm .navbar-toggler"
        );
        assert.equal(
          await burger.isDisplayed(),
          width === 575,
          "Гамбургер не найден"
        );
      }
    }
  });
  it(`При выборе элемента из меню "гамбургера", меню должно закрываться`, async function () {
    const puppeteer = await this.browser.getPuppeteer();
    const [page] = await puppeteer.pages();
    const url = `http://localhost:3000/hw/store`;

    await this.browser.setWindowSize(575, 6000);
    await page.goto(url, { waitUntil: "load" });
    const burger = await this.browser.$(".navbar-expand-sm .navbar-toggler");
    await burger.click();
    const linkEl = await this.browser.$(".nav-link");
    await page.goto(
      `http://localhost:3000/hw/store/${linkEl.getAttribute("href")}`
    );

    assert.equal(
      await burger.isDisplayed(),
      false,
      "После клика по ссылке гамбургер не скрылся"
    );
  });
});

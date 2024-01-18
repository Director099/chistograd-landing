import {MediaSize} from "../../shared/utils-js/utils";

new Swiper("[data-grid-slider]", {
  slidesPerView: "auto",
  grid: {
    rows: 2,
  },
  spaceBetween: 10,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    [MediaSize.XL]: {
      slidesPerView: 3,
      spaceBetween: 20,
    }
  }
});

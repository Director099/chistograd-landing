import {MediaSize} from "../../shared/utils-js/utils";

document.querySelectorAll("[data-slider-view]").forEach(item =>
  new Swiper(item, {
    slidesPerView: item.dataset.sliderView === "1" ? 1 : 'auto',
    spaceBetween: item.dataset.sliderView === "1" ? 15 : 20,
    pagination: {
      el: item.parentElement.querySelector(".swiper-pagination"),
      clickable: true,
    },
    navigation: {
      nextEl: item.parentElement.querySelector(".swiper-button--next"),
      prevEl: item.parentElement.querySelector(".swiper-button--prev"),
    },
    breakpoints: {
      [MediaSize.XL]: {
        slidesPerView: item.dataset.sliderView,
        spaceBetween: 20,
      }
    }
  })
);

(function (factory) {
  typeof define === 'function' && define.amd ? define('custom', factory) :
  factory();
}((function () { 'use strict';

  Fancybox.bind("[data-fancybox]", {
    dragToClose: false
  });
  document.querySelectorAll('[type="tel"]').forEach(item => {
    new IMask(item, {
      mask: '{+7} (000) 000 00 00',
      lazy: false
    });
  });

  // Вспомогательная функция открытия и закрытия
  document.querySelectorAll('[data-fancybox-src]')?.forEach(item => item.addEventListener('click', e => {
    Fancybox.close();
    Fancybox.show([{
      src: e.target.dataset.fancyboxSrc,
      dragToClose: false,
      defaultType: 'inline'
    }]);
  }));

  class WindowScrollHidden {
    constructor({
      watcher,
      elementHidden
    }) {
      this.watch = document.querySelectorAll(watcher);
      this.elementHidden = document.querySelector(elementHidden);
      this._init();
    }
    hiddenElement() {
      this.elementHidden.classList.add('visibility-hidden');
    }
    showElement() {
      this.elementHidden.classList.remove('visibility-hidden');
    }
    elementInViewport(elem) {
      const getElementBounding = elem.getBoundingClientRect();
      return getElementBounding.top + getElementBounding.height > 0 &&
      // Елемент ниже верхней границы
      window.innerHeight - getElementBounding.top > 0 &&
      // Выше нижней
      getElementBounding.left + getElementBounding.width > 0 &&
      // Правее левой
      window.innerWidth - getElementBounding.left > 0 // Левее правой
      ;
    }
    hasAllElementInViewport() {
      let array = [];
      this.watch.forEach(item => array.push(this.elementInViewport(item)));
      return array.every(i => i === false);
    }
    toggleElement() {
      this.hasAllElementInViewport() ? this.showElement() : this.hiddenElement();
    }
    _init() {
      this.toggleElement();
      window.addEventListener('scroll', () => this.toggleElement());
    }
  }
  new WindowScrollHidden({
    watcher: '[data-watch-hidden]',
    elementHidden: '.soc-fix'
  });

  document.querySelectorAll("[data-form]").forEach(itemForm => {
    const pristine = new Pristine(itemForm, {
      classTo: 'required',
      errorTextParent: 'required'
    });
    const submitForm = e => {
      const _disabled = 'disabled';
      const valid = pristine.validate();
      const btnSubmit = pristine.form.querySelector("[data-form-btn]");
      valid ? btnSubmit.removeAttribute(_disabled) : btnSubmit.setAttribute(_disabled, _disabled);
      return valid ? true : e.preventDefault();
    };
    ["submit", "input"].forEach(item => itemForm.addEventListener(item, e => submitForm(e)));
  });

  class Accordion {
    constructor() {
      this._openHeight = 0;
      this._windowWidth = window.innerWidth;
      this._documentClickHandler = this._documentClickHandler.bind(this);
      this._windowResizeHandler = this._windowResizeHandler.bind(this);
      this._init();
    }
    _init() {
      this.fullUpdate();
      document.addEventListener('click', this._documentClickHandler);
      window.addEventListener('resize', this._windowResizeHandler);
    }
    _documentClickHandler(evt) {
      const target = evt.target;
      if (!target.closest('[data-accordion="button"]')) {
        return;
      }
      evt.preventDefault();
      const parent = target.closest('[data-accordion="parent"]');
      if (parent.dataset.destroy && !window.matchMedia(parent.dataset.destroy).matches) {
        return;
      }
      const element = target.closest('[data-accordion="element"]');
      if (element.classList.contains('is-active')) {
        this.closeAccordion(element);
        return;
      }
      this.openAccordion(element);
    }
    _windowResizeHandler() {
      if (this._windowWidth === window.innerWidth) {
        return;
      }
      this._windowWidth = window.innerWidth;
      this.updateAccordionsHeight();
    }
    closeAllAccordion(parent) {
      const elements = parent.querySelectorAll('[data-accordion="element"]');
      elements.forEach(element => {
        const currentParent = element.closest('[data-accordion="parent"]');
        if (currentParent === parent) {
          this.closeAccordion(element);
        }
      });
    }
    updateAccordionsHeight(element = null) {
      if (element) {
        const content = element.querySelector('[data-accordion="content"]');
        content.style.transition = 'none';
        content.style.maxHeight = `${content.scrollHeight}px`;
        setTimeout(() => {
          content.style.transition = null;
        });
        return;
      }
      const closeElements = document.querySelectorAll('[data-accordion="element"]:not(.is-active)');
      closeElements.forEach(closeElement => {
        const parent = closeElement.closest('[data-accordion="parent"]');
        const content = closeElement.querySelector('[data-accordion="content"]');
        if (parent.dataset.destroy && !window.matchMedia(parent.dataset.destroy).matches) {
          content.style.maxHeight = '100%';
          return;
        }
        content.style.maxHeight = null;
      });
      const openElements = document.querySelectorAll('[data-accordion="element"].is-active');
      openElements.forEach(openElement => {
        const content = openElement.querySelector('[data-accordion="content"]');
        const parent = openElement.closest('[data-accordion="parent"]');
        if (parent.dataset.destroy && !window.matchMedia(parent.dataset.destroy).matches) {
          content.style.maxHeight = '100%';
          return;
        }
        content.style.transition = 'none';
        content.style.maxHeight = `${content.scrollHeight}px`;
        setTimeout(() => {
          content.style.transition = null;
        });
      });
    }
    fullUpdate(parent = null, transition = false) {
      let openElements;
      if (parent) {
        openElements = parent.querySelectorAll('[data-accordion="element"].is-active');
      } else {
        openElements = document.querySelectorAll('[data-accordion="element"].is-active');
      }
      openElements.forEach(openElement => {
        const innerParent = openElement.querySelector('[data-accordion="parent"]');
        if (innerParent) {
          return;
        }
        this.openAccordion(openElement, transition);
      });
      this.updateAccordionsHeight();
    }
    openAccordion(element, transition = true) {
      const parentElement = element.closest('[data-accordion="parent"]');
      const contentElement = element.querySelector('[data-accordion="content"]');
      this._openHeight += contentElement.scrollHeight;
      if (parentElement.hasAttribute('data-single')) {
        this.closeAllAccordion(parentElement);
      }
      element.classList.add('is-active');
      if (transition) {
        contentElement.style.maxHeight = `${this._openHeight}px`;
      } else {
        contentElement.style.transition = 'none';
        contentElement.style.maxHeight = `${this._openHeight}px`;
        setTimeout(() => {
          contentElement.style.transition = null;
        });
      }
      if (parentElement.closest('[data-accordion="element"]')) {
        this.openAccordion(parentElement.closest('[data-accordion="element"]'), transition);
        return;
      }
      this._openHeight = 0;
    }
    closeAccordion(element, transition = true) {
      const contentElement = element.querySelector('[data-accordion="content"]');
      if (!contentElement) {
        return;
      }
      element.classList.remove('is-active');
      if (transition) {
        contentElement.style.maxHeight = '0';
      } else {
        contentElement.style.transition = 'none';
        contentElement.style.maxHeight = '0';
        setTimeout(() => {
          contentElement.style.transition = null;
        });
      }
    }
  }
  new Accordion();

  class ToggleSoundVideo {
    constructor({
      video,
      btn
    }) {
      this.video = document.querySelector(video);
      this.btn = document.querySelector(btn);
      !!this.video && this._init();
    }
    toggleIcon() {
      this.btn.classList.toggle('active');
    }
    toggleMutedVideo() {
      if (this.video.muted) {
        this.video.muted = false;
        this.video.play();
      } else {
        this.video.muted = true;
      }
    }
    _events() {
      this.btn.addEventListener('click', () => {
        this.toggleMutedVideo();
        this.toggleIcon();
      });
    }
    _init() {
      this._events();
    }
  }
  new ToggleSoundVideo({
    video: '[data-video]',
    btn: "[data-toggle-sound-video]"
  });

  const MediaSize = {
    XL: 1300
  };

  new Swiper("[data-grid-slider]", {
    slidesPerView: "auto",
    grid: {
      rows: 2
    },
    spaceBetween: 10,
    pagination: {
      el: ".swiper-pagination",
      clickable: true
    },
    breakpoints: {
      [MediaSize.XL]: {
        slidesPerView: 3,
        spaceBetween: 20
      }
    }
  });

  document.querySelectorAll("[data-slider-view]").forEach(item => new Swiper(item, {
    slidesPerView: item.dataset.sliderView === "1" ? 1 : 'auto',
    spaceBetween: item.dataset.sliderView === "1" ? 15 : 20,
    pagination: {
      el: item.parentElement.querySelector(".swiper-pagination"),
      clickable: true
    },
    navigation: {
      nextEl: item.parentElement.querySelector(".swiper-button--next"),
      prevEl: item.parentElement.querySelector(".swiper-button--prev")
    },
    breakpoints: {
      [MediaSize.XL]: {
        slidesPerView: item.dataset.sliderView,
        spaceBetween: 20
      }
    }
  }));

  document.querySelector('.soc-fix__pic').addEventListener('click', function () {
    this.nextElementSibling.classList.toggle('visibility-hidden');
  });

})));

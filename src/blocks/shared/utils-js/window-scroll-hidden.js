export class WindowScrollHidden {
  constructor({watcher, elementHidden}) {
    this.watch = document.querySelectorAll(watcher);
    this.elementHidden = document.querySelector(elementHidden);
    this._init();
  }

  hiddenElement() {
    this.elementHidden.classList.add('visibility-hidden')
  }

  showElement() {
    this.elementHidden.classList.remove('visibility-hidden')
  }

  elementInViewport(elem) {
    const getElementBounding = elem.getBoundingClientRect();
    return (
      getElementBounding.top + getElementBounding.height > 0 && // Елемент ниже верхней границы
      window.innerHeight - getElementBounding.top > 0 && // Выше нижней
      getElementBounding.left + getElementBounding.width > 0 && // Правее левой
      window.innerWidth - getElementBounding.left > 0 // Левее правой
    )
  }

  hasAllElementInViewport() {
    let array = [];
    this.watch.forEach(item => array.push(this.elementInViewport(item)))
    return array.every((i) => i === false)
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
})

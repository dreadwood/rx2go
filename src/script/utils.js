'use strict'

window.utils = {
  BREAKPOINT_MOBILE: '(max-width: 767px)',
  BREAKPOINT_TABLET: '(max-width: 1023px)',

  /**
   * add/remove css class when click button
   * @param {HTMLButtonElement} btn
   * @param {String} className
   */
  toggleCssClass(btn, className) {
    if (!btn) {
      throw new Error('toggleCssClass: Button not passed to parameters')
    }
    if (typeof className !== 'string') {
      throw new Error(
        'toggleCssClass: className is not passed or is not a string'
      )
    }
    btn.classList.toggle(className)
    btn.blur()
  }
}

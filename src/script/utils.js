'use strict'

window.utils = {
  BREAKPOINT_MOBILE: '(max-width: 767px)',
  BREAKPOINT_TABLET: '(max-width: 1023px)',

  /**
   * for show/hide a list when click button
   * @param {HTMLButtonElement} btn
   * @param {String} className
   */
  toggleParentCssClass(btn, className) {
    if (!btn) {
      throw new Error('toggleParentCssClass: Button not passed to parameters')
    }
    if (typeof className !== 'string') {
      throw new Error(
        'toggleParentCssClass: className is not passed or is not a string'
      )
    }
    btn.parentElement.classList.toggle(className)
    btn.blur()
  }
}

/**
 * Removes specified classes from a list of elements.
 *
 * @param {HTMLElement[]} elements - An array of HTML elements to clear classes from.
 * @param {...string} classes - The class names to be removed from each element.
 */
export function clearClasses(elements, ...classes) {
  elements.forEach(el => el.classList.remove(...classes));
}
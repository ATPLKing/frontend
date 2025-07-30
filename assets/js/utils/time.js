/**
 * Chrono utility functions for time calculations.
 */

/**
 * Converts seconds to a formatted string HH:MM:SS.
 * @param {number} seconds
 * @returns {string}
 */
export function formatSeconds(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  if (hrs < 0) {
    return [
      mins.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ].join(":");
  } else {
    return [
      hrs.toString().padStart(2, "0"),
      mins.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ].join(":");
  }
}

/**
 * Parses a formatted string HH:MM:SS into seconds.
 * @param {string} timeStr
 * @returns {number}
 */
export function parseTimeString(timeStr) {
  const parts = timeStr.split(":").map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 1) {
    return parts[0];
  }
  return 0;
}


/**
 * Updates the text content of a given HTML element to display a formatted time string.
 *
 * @param {HTMLElement} timerSpan - The HTML element where the formatted time will be displayed.
 * @param {number} timeElapsed - The time in seconds to be formatted and displayed.
 */
export function displayTime(timerSpan, timeElapsed) {
  let timeStr = formatSeconds(timeElapsed);
  timerSpan.innerText = timeStr;
}

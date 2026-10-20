// PART 1 — implement the functions below. See TASK_*.md for the exact rules.
// You may add helper functions and use anything from ./utils.js.

const { parseODataDate, normalizeEquipmentId } = require('./utils');

/**
 * Open orders of a plant, sorted.
 * @param {object[]} orders  - orders as in data/orders.json (d.results)
 * @param {string} plant     - e.g. "1000"
 * @returns {object[]}
 */
function getOpenOrders(orders, plant) {
  throw new Error('Not implemented');
}

/**
 * Number of notifications per equipment.
 * @param {object[]} notifications
 * @returns {Object<string, number>}  e.g. { "000000000010000101": 3 }
 */
function countNotificationsByEquipment(notifications) {
  throw new Error('Not implemented');
}

/**
 * Validates a new notification before it is saved.
 * @param {object} notification  - see TASK_*.md for the fields
 * @param {object[]} equipmentList
 * @param {object} config        - result of loadConfig(plant)
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateNotification(notification, equipmentList, config) {
  throw new Error('Not implemented');
}

module.exports = { getOpenOrders, countNotificationsByEquipment, validateNotification };

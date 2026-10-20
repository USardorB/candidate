// PART 1 — implement the functions below. See TASK_*.md for the exact rules.
// You may add helper functions and use anything from ./utils.js.

const { parseODataDate, normalizeEquipmentId } = require('./utils');

const CLOSED_STATUSES = ['TECO', 'CLSD'];

// "Empty" as defined in the task: missing, null, "" or only spaces.
function isBlank(value) {
  return value === undefined || value === null || String(value).trim() === '';
}

function isClosed(order) {
  const statuses = String(order.SystemStatus || '').split(/\s+/);
  return statuses.some((status) => CLOSED_STATUSES.includes(status));
}

// Empty priority gets Infinity so it is sorted after every real priority.
function priorityRank(order) {
  return isBlank(order.Priority) ? Infinity : Number(order.Priority);
}

function startTime(order) {
  return parseODataDate(order.BasicStartDate)?.getTime() ?? Infinity;
}

function compareOrders(a, b) {
  return (
    compareNumbers(priorityRank(a), priorityRank(b)) ||
    compareNumbers(startTime(a), startTime(b)) ||
    String(a.OrderId).localeCompare(String(b.OrderId))
  );
}

// Safe for Infinity (Infinity - Infinity would be NaN).
function compareNumbers(x, y) {
  if (x === y) return 0;
  return x < y ? -1 : 1;
}

/**
 * Open orders of a plant, sorted.
 * @param {object[]} orders  - orders as in data/orders.json (d.results)
 * @param {string} plant     - e.g. "1000"
 * @returns {object[]}
 */
function getOpenOrders(orders, plant) {
  // filter() returns a new array, so sort() does not touch the input.
  return orders
    .filter((order) => order.Plant === plant && !isClosed(order))
    .sort(compareOrders);
}

/**
 * Number of notifications per equipment.
 * @param {object[]} notifications
 * @returns {Object<string, number>}  e.g. { "000000000010000101": 3 }
 */
function countNotificationsByEquipment(notifications) {
  const counts = {};
  for (const { EquipmentId } of notifications) {
    if (isBlank(EquipmentId)) continue;
    const id = normalizeEquipmentId(EquipmentId);
    counts[id] = (counts[id] || 0) + 1;
  }
  return counts;
}

// A date that is not given is fine; a given date must be readable and start <= end.
function hasInvalidDates({ MalfunctionStart, MalfunctionEnd }) {
  const start = isBlank(MalfunctionStart) ? null : new Date(MalfunctionStart);
  const end = isBlank(MalfunctionEnd) ? null : new Date(MalfunctionEnd);
  const unreadable = [start, end].some((date) => date && Number.isNaN(date.getTime()));
  if (unreadable) return true;
  return Boolean(start && end && start > end);
}

function equipmentExists(equipmentId, equipmentList) {
  const id = normalizeEquipmentId(equipmentId);
  return equipmentList.some((equipment) => normalizeEquipmentId(equipment.EquipmentId) === id);
}

/**
 * Validates a new notification before it is saved.
 * @param {object} notification  - see TASK_*.md for the fields
 * @param {object[]} equipmentList
 * @param {object} config        - result of loadConfig(plant)
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateNotification(notification, equipmentList, config) {
  const { requiredFields, descriptionMaxLength } = config.notification;
  const errors = [];

  for (const field of requiredFields) {
    if (isBlank(notification[field])) errors.push(`REQUIRED:${field}`);
  }

  if (String(notification.Description ?? '').length > descriptionMaxLength) {
    errors.push('DESCRIPTION_TOO_LONG');
  }

  if (hasInvalidDates(notification)) {
    errors.push('DATES_INVALID');
  }

  if (!isBlank(notification.EquipmentId) && !equipmentExists(notification.EquipmentId, equipmentList)) {
    errors.push('EQUIPMENT_NOT_FOUND');
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { getOpenOrders, countNotificationsByEquipment, validateNotification };

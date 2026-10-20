/**
 * Bonus 5C: MTBF & MTTR Analysis
 * Calculates reliability metrics for each equipment over the 12-month period (8760 hours).
 */
const fs = require('fs');
const path = require('path');
const { parseODataDate, normalizeEquipmentId } = require('../src/utils');

const history = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/history.json'), 'utf-8')).d.results;
const equipment = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/equipment.json'), 'utf-8')).d.results;

const equipMap = {};
equipment.forEach((e) => {
  equipMap[normalizeEquipmentId(e.EquipmentId)] = e;
});

// Period: 12 months = 365 days * 24 hours = 8760 hours
const TOTAL_PERIOD_HOURS = 365 * 24;

const stats = {};
for (const item of history) {
  const eqId = normalizeEquipmentId(item.EquipmentId);
  if (!stats[eqId]) {
    stats[eqId] = {
      equipmentId: eqId,
      name: equipMap[eqId]?.Description || 'Unknown',
      plant: equipMap[eqId]?.Plant || item.Plant,
      failures: 0,
      totalDowntimeHours: 0,
    };
  }
  const start = parseODataDate(item.MalfunctionStart);
  const end = parseODataDate(item.MalfunctionEnd);
  const downtimeHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

  stats[eqId].failures += 1;
  stats[eqId].totalDowntimeHours += downtimeHours;
}

const report = Object.values(stats).map((s) => {
  const operatingHours = TOTAL_PERIOD_HOURS - s.totalDowntimeHours;
  const mtbf = s.failures > 0 ? operatingHours / s.failures : TOTAL_PERIOD_HOURS;
  const mttr = s.failures > 0 ? s.totalDowntimeHours / s.failures : 0;
  const availability = (operatingHours / TOTAL_PERIOD_HOURS) * 100;

  return {
    equipmentId: s.equipmentId,
    name: s.name,
    plant: s.plant,
    failures: s.failures,
    totalDowntimeHours: Number(s.totalDowntimeHours.toFixed(1)),
    mtbfHours: Number(mtbf.toFixed(1)),
    mttrHours: Number(mttr.toFixed(1)),
    availabilityPercent: Number(availability.toFixed(2)),
  };
});

// Sort by MTBF ascending (lowest MTBF = most frequently failing)
report.sort((a, b) => a.mtbfHours - b.mtbfHours);

console.log('=== MTBF & MTTR Analysis Report (12 months / 8760h) ===\n');
console.table(report);

module.exports = { report };

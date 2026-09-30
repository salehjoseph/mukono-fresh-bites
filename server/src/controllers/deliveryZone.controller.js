import * as zoneRepo from '../repositories/deliveryZone.repository.js';

export async function listZones(req, res, next) {
  try {
    const zones = await zoneRepo.findActiveZones();
    res.json({ success: true, data: zones });
  } catch (err) {
    next(err);
  }
}
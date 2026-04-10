const RECORDS_KEY = 'sbti_records_v1';
const CURRENT_RESULT_ID_KEY = 'sbti_current_result_id_v1';

function pad(n) {
  return String(n).padStart(2, '0');
}

function formatTime(ts) {
  const date = new Date(ts);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function normalizeRecord(result, timestamp = Date.now()) {
  return {
    id: `${timestamp}_${result.finalType.code}`,
    timestamp,
    timeText: formatTime(timestamp),
    finalType: result.finalType,
    badge: result.badge,
    sub: result.sub,
    modeKicker: result.modeKicker,
    special: result.special,
    funNote: result.funNote,
    dimList: result.dimList,
    rawScores: result.rawScores,
    levels: result.levels,
    secondaryType: result.secondaryType || null
  };
}

function listRecords() {
  try {
    const records = wx.getStorageSync(RECORDS_KEY) || [];
    return Array.isArray(records) ? records : [];
  } catch (error) {
    return [];
  }
}

function saveRecord(result) {
  const record = normalizeRecord(result);
  const records = [record, ...listRecords()]
    .slice(0, 30)
    .sort((a, b) => b.timestamp - a.timestamp);
  wx.setStorageSync(RECORDS_KEY, records);
  setCurrentResultId(record.id);
  return record;
}

function getLatestRecord() {
  return listRecords()[0] || null;
}

function findRecordById(id) {
  if (!id) return null;
  return listRecords().find((item) => item.id === id) || null;
}

function setCurrentResultId(id) {
  if (!id) return;
  wx.setStorageSync(CURRENT_RESULT_ID_KEY, id);
}

function getCurrentResultId() {
  try {
    return wx.getStorageSync(CURRENT_RESULT_ID_KEY) || '';
  } catch (error) {
    return '';
  }
}

module.exports = {
  RECORDS_KEY,
  formatTime,
  normalizeRecord,
  listRecords,
  saveRecord,
  getLatestRecord,
  findRecordById,
  setCurrentResultId,
  getCurrentResultId
};

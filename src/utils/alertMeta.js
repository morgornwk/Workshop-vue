export const ALERT_META = {
  success: { tag: 'OK', title: 'สำเร็จ' },
  error: { tag: 'Error', title: 'เกิดข้อผิดพลาด' },
  warning: { tag: 'Warning', title: 'โปรดทราบ' },
  info: { tag: 'Info', title: 'แจ้งให้ทราบ' },
}

export const ALERT_ICON_PATHS = {
  success: 'M4 12.5l5 5L20 6.5',
  error: 'M5 5l14 14M19 5L5 19',
  warning: 'M12 4v10M12 19v1',
  info: 'M12 11v9M12 5v1',
  close: 'M5 5l14 14M19 5L5 19',
}

export function normalizeAlertType(type) {
  return Object.prototype.hasOwnProperty.call(ALERT_META, type) ? type : 'info'
}

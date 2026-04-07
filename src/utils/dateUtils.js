// src/utils/dateUtils.js
// 共用日期工具函數

/**
 * 將 Date 物件格式化為 "YYYY-MM-DD" 字串
 * @param {Date} date
 * @returns {string}
 */
export const formatDateString = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

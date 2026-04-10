const { findRecordById, getLatestRecord } = require('../../utils/storage');

Page({
  data: {
    result: null,
    empty: false
  },

  onLoad(options) {
    this.loadResult(options || {});
  },

  onShow() {
    if (!this.data.result) {
      this.loadResult({});
    }
  },

  loadResult(options) {
    const record = options.id ? findRecordById(options.id) : getLatestRecord();
    if (!record) {
      this.setData({ empty: true, result: null });
      return;
    }
    this.setData({ result: record, empty: false });
  },

  restartTest() {
    wx.redirectTo({
      url: '/pages/test/index'
    });
  },

  backHome() {
    wx.reLaunch({
      url: '/pages/home/index'
    });
  },

  openHistory() {
    wx.navigateTo({
      url: '/pages/history/index'
    });
  }
});

const { getLatestRecord } = require('../../utils/storage');

Page({
  data: {
    latestRecord: null
  },

  onShow() {
    this.loadLatest();
  },

  loadLatest() {
    this.setData({
      latestRecord: getLatestRecord()
    });
  },

  startTest() {
    wx.navigateTo({
      url: '/pages/test/index'
    });
  },

  openLatestResult() {
    const { latestRecord } = this.data;
    if (!latestRecord) return;
    wx.navigateTo({
      url: `/pages/result/index?id=${latestRecord.id}`
    });
  },

  openHistory() {
    wx.navigateTo({
      url: '/pages/history/index'
    });
  }
});

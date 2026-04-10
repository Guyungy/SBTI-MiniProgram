const { listRecords } = require('../../utils/storage');

Page({
  data: {
    records: []
  },

  onShow() {
    this.setData({
      records: listRecords()
    });
  },

  openResult(event) {
    const { id } = event.currentTarget.dataset;
    if (!id) return;
    wx.navigateTo({
      url: `/pages/result/index?id=${id}`
    });
  },

  backHome() {
    wx.reLaunch({
      url: '/pages/home/index'
    });
  }
});

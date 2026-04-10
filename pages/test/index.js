const { createShuffledQuestions, getVisibleQuestions, computeResult } = require('../../utils/logic');
const { saveRecord } = require('../../utils/storage');

Page({
  data: {
    currentQuestion: null,
    currentIndex: 0,
    totalQuestions: 0,
    answeredCount: 0,
    progressPercent: 0,
    testHint: '选择后会自动进入下一题。',
    answerLocked: false
  },

  onLoad() {
    this.answers = {};
    this.shuffledQuestions = createShuffledQuestions();
    this.autoNextTimer = null;
    this.refreshTestState(0);
  },

  onUnload() {
    this.clearTimer();
  },

  clearTimer() {
    if (this.autoNextTimer) {
      clearTimeout(this.autoNextTimer);
      this.autoNextTimer = null;
    }
  },

  backHome() {
    this.clearTimer();
    wx.navigateBack({
      delta: 1,
      fail: () => {
        wx.reLaunch({ url: '/pages/home/index' });
      }
    });
  },

  goPrevQuestion() {
    if (this.data.currentIndex <= 0) return;
    this.clearTimer();
    this.refreshTestState(this.data.currentIndex - 1);
  },

  refreshTestState(targetIndex = this.data.currentIndex) {
    const visibleQuestions = getVisibleQuestions(this.shuffledQuestions, this.answers);
    const total = visibleQuestions.length;
    const safeIndex = Math.max(0, Math.min(targetIndex, Math.max(total - 1, 0)));
    const question = visibleQuestions[safeIndex] || null;
    const answeredCount = visibleQuestions.filter((q) => this.answers[q.id] !== undefined).length;

    const currentQuestion = question ? {
      ...question,
      index: safeIndex + 1,
      answerValue: this.answers[question.id] !== undefined ? String(this.answers[question.id]) : '',
      options: question.options.map((opt, optionIndex) => ({
        ...opt,
        optionCode: ['A', 'B', 'C', 'D'][optionIndex] || String(optionIndex + 1),
        valueText: String(opt.value)
      }))
    } : null;

    this.setData({
      currentQuestion,
      currentIndex: safeIndex,
      totalQuestions: total,
      answeredCount,
      progressPercent: total ? Math.round((answeredCount / total) * 100) : 0,
      testHint: safeIndex + 1 >= total ? '最后一题，选完会自动出结果。' : '选择后会自动进入下一题。',
      answerLocked: false
    });
  },

  handleOptionChange(event) {
    if (this.data.answerLocked || !this.data.currentQuestion) return;
    const { questionId } = event.currentTarget.dataset;
    const value = Number(event.detail.value);
    this.answers[questionId] = value;

    if (questionId === 'drink_gate_q1' && value !== 3) {
      delete this.answers.drink_gate_q2;
    }

    const nextQuestions = getVisibleQuestions(this.shuffledQuestions, this.answers);
    const total = nextQuestions.length;
    const answeredCount = nextQuestions.filter((q) => this.answers[q.id] !== undefined).length;
    const nextIndex = Math.min(this.data.currentIndex + 1, Math.max(total - 1, 0));

    this.setData({ answerLocked: true });

    this.clearTimer();
    this.autoNextTimer = setTimeout(() => {
      if (answeredCount >= total && total > 0) {
        this.submitResult();
      } else {
        this.refreshTestState(nextIndex);
      }
      this.autoNextTimer = null;
    }, 180);
  },

  submitResult() {
    this.clearTimer();
    const result = computeResult(this.answers);
    const record = saveRecord(result);
    wx.redirectTo({
      url: `/pages/result/index?id=${record.id}`
    });
  }
});

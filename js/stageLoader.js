class StageLoader {
  constructor() {
    this.stageCache = new Map();
    this.currentStage = null;
  }

  async loadStage(stageId) {
    try {
      if (this.stageCache.has(stageId)) {
        return this.stageCache.get(stageId);
      }

      const response = await fetch(`/stages/${stageId}.html`);
      if (!response.ok) throw new Error(`Failed to load stage ${stageId}`);

      const html = await response.text();
      this.stageCache.set(stageId, html);
      return html;
    } catch (error) {
      console.error("Error loading stage:", error);
      return null;
    }
  }

  async showStage(stageId) {
    try {
      const response = await fetch(`stages/${stageId}.html`);
      const html = await response.text();
      const container = document.getElementById(stageId);
      
      // 隐藏所有阶段
      document.querySelectorAll('.stage-container').forEach(el => {
          el.style.display = 'none';
      });
      
      // 显示当前阶段
      container.innerHTML = html;
      container.style.display = 'block';

      this.updateTimelineState(stageId);  // 添加this关键字
      
      // 让调用者知道内容已加载完成
      return Promise.resolve();
    } catch (error) {
      console.error('Error loading stage:', error);
      return Promise.reject(error);
    }
  }

  updateTimelineState(stageId) {
    // 更新时间线item的状态
    const timelineItems = document.querySelectorAll(".timeline-item");
    timelineItems.forEach((item) => {
      item.classList.remove("active");
    });
    const activeItem = document.querySelector(`.timeline-item[data-stage="${stageId}"]`);
    activeItem.classList.add("active");

    // 更新时间线状态
    const dots = document.querySelectorAll(".timeline-dot");
    dots.forEach((dot) => dot.classList.remove("active"));

    const activeDot = document.querySelector(`.timeline-item[data-stage="${stageId}"] .timeline-dot`);
    if (activeDot) activeDot.classList.add("active");
  }

  initializeTabsForStage() {
    // 初始化当前stage的标签页
    const tabButtons = document.querySelectorAll(".tab-button");
    tabButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const tabContainer = e.target.closest(".tab-container");
        const targetTab = e.target.getAttribute("data-tab");

        // 更新按钮状态
        tabContainer.querySelectorAll(".tab-button").forEach((btn) => btn.classList.toggle("active", btn === e.target));

        // 更新内容显示
        tabContainer
          .querySelectorAll(".tab-content")
          .forEach((content) => content.classList.toggle("active", content.getAttribute("data-tab") === targetTab));
      });
    });
  }
}

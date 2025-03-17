document.addEventListener('DOMContentLoaded', function() {
    const stageLoader = new StageLoader();

    // 确保初始内容加载后调用高亮
    stageLoader.showStage('stage1').then(() => {
        hljs.highlightAll();
    });

    // 绑定时间线点击事件，确保内容加载后调用高亮
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.addEventListener('click', function() {
            const stage = this.getAttribute('data-stage');
            stageLoader.showStage(stage).then(() => {
                hljs.highlightAll();
            });
        });
    });

    // 使用事件委托处理动态加载的内容
    document.addEventListener('click', async function(e) {
        if (e.target && e.target.id === 'generateBtn') {
            const tokenPrediction = document.getElementById('tokenPrediction');
            const outputContent = document.getElementById('outputContent');
            
            // 定义完整的预测序列，每组包含正确答案和其他候选项
            const predictionSequence = [
                {
                    correct: "生活方式",
                    candidates: [
                        { text: "生活方式", prob: "32%" },
                        { text: "工作环境", prob: "25%" },
                        { text: "社会形态", prob: "18%" },
                        { text: "思维模式", prob: "15%" }
                    ]
                },
                {
                    correct: "，",
                    candidates: [
                        { text: "，", prob: "45%" },
                        { text: "。", prob: "25%" },
                        { text: "；", prob: "18%" },
                        { text: "：", prob: "12%" }
                    ]
                },
                {
                    correct: "从",
                    candidates: [
                        { text: "从", prob: "35%" },
                        { text: "在", prob: "28%" },
                        { text: "把", prob: "20%" },
                        { text: "对", prob: "17%" }
                    ]
                },
                {
                    correct: "智能手机",
                    candidates: [
                        { text: "智能手机", prob: "40%" },
                        { text: "人工智能", prob: "25%" },
                        { text: "机器人", prob: "20%" },
                        { text: "计算机", prob: "15%" }
                    ]
                },
                {
                    correct: "助手",
                    candidates: [
                        { text: "助手", prob: "38%" },
                        { text: "设备", prob: "28%" },
                        { text: "系统", prob: "22%" },
                        { text: "工具", prob: "12%" }
                    ]
                }
            ];

            // 重置显示状态
            tokenPrediction.style.display = 'block';
            tokenPrediction.innerHTML = ''; // 清空现有预测组
            outputContent.classList.add('typing');
            outputContent.textContent = "人工智能正在改变我们的";

            // 为每组预测创建DOM元素
            predictionSequence.forEach((pred, index) => {
                const predGroup = document.createElement('div');
                predGroup.className = 'prediction-group';
                predGroup.style.display = index === 0 ? 'block' : 'none';
                
                pred.candidates.forEach(candidate => {
                    const tokenDiv = document.createElement('div');
                    tokenDiv.className = 'token';
                    tokenDiv.innerHTML = `${candidate.text} <span class="token-prob">${candidate.prob}</span>`;
                    predGroup.appendChild(tokenDiv);
                });
                
                tokenPrediction.appendChild(predGroup);
            });

            // 同步处理预测和输出
            for (let i = 0; i < predictionSequence.length; i++) {
                const currentGroup = tokenPrediction.children[i];
                
                // 显示当前预测组
                currentGroup.style.display = 'block';
                setTimeout(() => currentGroup.classList.add('active'), 100);
                await new Promise(resolve => setTimeout(resolve, 800));
                
                // 高亮选中的token
                const correctToken = Array.from(currentGroup.querySelectorAll('.token'))
                    .find(token => token.textContent.includes(predictionSequence[i].correct));
                
                if (correctToken) {
                    correctToken.classList.add('selected');
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
                
                // 输出选中的文本
                outputContent.textContent += predictionSequence[i].correct;
                
                // 准备下一组预测
                if (i < predictionSequence.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    currentGroup.classList.remove('active');
                    currentGroup.style.display = 'none';
                }
            }

            // 最后淡出预测显示
            setTimeout(() => {
                tokenPrediction.querySelectorAll('.prediction-group').forEach(group => {
                    group.classList.remove('active');
                });
                setTimeout(() => {
                    tokenPrediction.style.display = 'none';
                    tokenPrediction.querySelectorAll('.token').forEach(token => {
                        token.classList.remove('selected');
                    });
                }, 300);
            }, 1000);

            // 完成预测后，输出剩余文本
            await new Promise(resolve => setTimeout(resolve, 800));
            const remainingText = "到自动驾驶汽车，人工智能技术正在各个领域取得突破。";
            for (let char of remainingText) {
                outputContent.textContent += char;
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            
            outputContent.classList.remove('typing');
            
        }
    });

    // 选项卡点击事件处理也使用事件委托
    document.addEventListener('click', function(e) {
        if (e.target.matches('.tab-button')) {
            const button = e.target;
            const tabContainer = button.closest('.tab-container');
            
            // 移除同组所有按钮的active类
            tabContainer.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // 添加当前按钮的active类
            button.classList.add('active');
            
            // 获取目标内容标识
            const targetTab = button.getAttribute('data-tab');
            
            // 隐藏所有内容
            tabContainer.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // 显示目标内容
            tabContainer.querySelector(`.tab-content[data-tab="${targetTab}"]`).classList.add('active');
        }
    });
});
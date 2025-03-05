document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const resetBtn = document.getElementById('reset-btn');
    const timerDisplay = document.querySelector('.timer');
    const currentTestSpan = document.getElementById('current-test');
    const progressFill = document.querySelector('.progress-fill');
    const resultDiv = document.getElementById('result');
    const scoreSpan = document.getElementById('score');

    let startTime;
    let timerInterval;
    let testCount = 0;
    let totalTime = 0;
    const maxTests = 3;

    // 设置计时器显示样式
    timerDisplay.style.fontSize = '4rem';
    timerDisplay.style.fontWeight = 'bold';
    timerDisplay.style.textAlign = 'center';
    timerDisplay.style.width = '100%';
    timerDisplay.style.display = 'flex';
    timerDisplay.style.justifyContent = 'center';
    timerDisplay.style.alignItems = 'center';

    // 设置结果页面文字样式
    const resultTitle = document.querySelector('.result-title');
    const resultText = document.querySelector('.result-text');
    if (resultTitle && resultText) {
        resultTitle.style.fontSize = '2rem';
        resultText.style.fontSize = '2rem';
        resultText.style.marginTop = '1rem';
    }

    function updateTimer() {
        const currentTime = (Date.now() - startTime) / 1000;
        timerDisplay.textContent = Math.floor(currentTime);
    }

    function startTest() {
        startBtn.disabled = true;
        stopBtn.disabled = false;
        resetBtn.disabled = true;
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 100);
    }

    function stopTest() {
        clearInterval(timerInterval);
        const endTime = (Date.now() - startTime) / 1000;
        totalTime += endTime;
        testCount++;

        // 更新进度条
        const progress = (testCount / maxTests) * 100;
        progressFill.style.width = `${progress}%`;
        currentTestSpan.textContent = testCount + 1;

        if (testCount < maxTests) {
            // 准备下一次测试
            setTimeout(() => {
                startBtn.disabled = false;
                stopBtn.disabled = true;
                resetBtn.disabled = false;
                timerDisplay.textContent = '0';
            }, 2000);
        } else {
            // 测试完成
            const averageTime = totalTime / maxTests;
            showResult(averageTime);
        }
    }

    function resetTest() {
        clearInterval(timerInterval);
        timerDisplay.textContent = '0';
        startBtn.disabled = false;
        stopBtn.disabled = true;
        resetBtn.disabled = true;
    }

    function showResult(averageTime) {
        // 隐藏测试区域，显示结果
        document.getElementById('test-area').style.display = 'none';
        resultDiv.style.display = 'block';
        
        // 添加结果动画
        resultDiv.style.opacity = '0';
        resultDiv.style.transform = 'translateY(20px)';
        setTimeout(() => {
            resultDiv.style.transition = 'all 0.5s var(--animation-curve)';
            resultDiv.style.opacity = '1';
            resultDiv.style.transform = 'translateY(0)';
        }, 100);

        // 动画显示分数
        animateScore(scoreSpan, averageTime);
    }

    function animateScore(element, finalScore) {
        let currentScore = 0;
        const duration = 1000;
        const startTime = performance.now();
        const increment = finalScore / (duration / 16);

        function updateScore(currentTime) {
            const elapsed = currentTime - startTime;
            if (elapsed < duration) {
                currentScore = Math.min(currentScore + increment, finalScore);
                element.textContent = Math.floor(currentScore);
                requestAnimationFrame(updateScore);
            } else {
                element.textContent = Math.floor(finalScore);
            }
        }

        requestAnimationFrame(updateScore);
    }

    // 添加按钮事件监听器
    startBtn.addEventListener('click', startTest);
    stopBtn.addEventListener('click', stopTest);
    resetBtn.addEventListener('click', resetTest);

    // 添加按钮动画效果
    const buttons = document.querySelectorAll('.control-button');
    buttons.forEach(button => {
        button.addEventListener('mouseover', () => {
            button.style.transform = 'translateY(-2px)';
        });
        button.addEventListener('mouseout', () => {
            button.style.transform = 'translateY(0)';
        });
    });
}); 
document.addEventListener('DOMContentLoaded', () => {
    const questions = document.querySelectorAll('.question');
    const options = document.querySelectorAll('.option');
    let answers = new Array(questions.length).fill(null);
    let currentQuestion = 0;
    const submitBtn = document.getElementById('submit-btn');
    const resultDiv = document.getElementById('result');
    const scoreSpan = document.getElementById('score');

    // 添加问题渐入动画
    questions.forEach((question, index) => {
        question.style.animationDelay = `${index * 0.3}s`;
    });

    // 添加选项点击效果
    options.forEach(option => {
        option.addEventListener('click', () => {
            const questionDiv = option.closest('.question');
            const questionIndex = Array.from(questions).indexOf(questionDiv);
            const value = parseInt(option.dataset.value);

            // 添加触感反馈
            if ('vibrate' in navigator) {
                navigator.vibrate(50);
            }

            // 移除其他选项的选中状态
            questionDiv.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
                opt.style.transform = 'translateX(0)';
            });

            // 添加选中状态和动画
            option.classList.add('selected');
            option.style.transform = 'translateX(10px)';
            answers[questionIndex] = value;

            // 检查是否所有问题都已回答
            if (answers.every(answer => answer !== null)) {
                calculateScore();
            }
        });
    });

    function calculateScore() {
        let totalScore = 0;
        let answeredQuestions = 0;

        // 检查所有问题是否都已回答
        for (let i = 1; i <= 12; i++) {
            const selectedOption = document.querySelector(`input[name="q${i}"]:checked`);
            if (selectedOption) {
                totalScore += parseInt(selectedOption.value);
                answeredQuestions++;
            }
        }

        // 如果所有问题都已回答，计算最终得分
        if (answeredQuestions === 12) {
            return totalScore;
        }
        return null;
    }

    function showResult(score) {
        // 隐藏问卷，显示结果
        document.querySelector('.questionnaire').style.display = 'none';
        document.querySelector('.button-container').style.display = 'none';
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
        animateScore(scoreSpan, score);
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
                element.textContent = finalScore;
            }
        }

        requestAnimationFrame(updateScore);
    }

    submitBtn.addEventListener('click', () => {
        const score = calculateScore();
        if (score !== null) {
            showResult(score);
        } else {
            alert('请回答所有问题后再提交');
        }
    });

    // 添加选项动画效果
    const optionLabels = document.querySelectorAll('.options label');
    optionLabels.forEach(option => {
        option.addEventListener('mouseover', () => {
            option.style.transform = 'translateX(5px)';
        });
        option.addEventListener('mouseout', () => {
            option.style.transform = 'translateX(0)';
        });
    });
});

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes scoreParticle {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(
                ${Math.random() * 200 - 100}px,
                ${Math.random() * 200 - 100}px
            ) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style); 
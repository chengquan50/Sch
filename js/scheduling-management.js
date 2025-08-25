// 调度管理模块

// 初始化任务状态图表
function initTaskCharts() {
    // 任务状态饼图
    const taskStatusCtx = document.getElementById('taskStatusChart');
    if (taskStatusCtx) {
        new Chart(taskStatusCtx, {
            type: 'doughnut',
            data: {
                labels: ['运行中', '等待中', '已完成'],
                datasets: [{
                    data: [23, 8, 125],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 10,
                            font: {
                                size: 11
                            }
                        }
                    }
                }
            }
        });
    }
}

// 概率滑块交互
function initEventSlider() {
    const slider = document.getElementById('eventProbability');
    const valueDisplay = document.getElementById('probabilityValue');
    
    if (slider && valueDisplay) {
        slider.addEventListener('input', function() {
            valueDisplay.textContent = this.value + '%';
        });
    }
}

// 初始化结果统计图表
function initResultCharts() {
    // 策略性能对比图
    const performanceCtx = document.getElementById('performanceComparisonChart');
    if (performanceCtx) {
        new Chart(performanceCtx, {
            type: 'bar',
            data: {
                labels: ['DRL (全开)', 'FIFO', 'SJF', 'Priority', 'DRL (部分)'],
                datasets: [{
                    label: 'Makespan (分钟)',
                    data: [8.7, 12.3, 10.1, 11.5, 10.1],
                    backgroundColor: 'rgba(54, 162, 235, 0.8)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }, {
                    label: '资源利用率 (%)',
                    data: [89.2, 76.4, 82.1, 79.8, 87.3],
                    backgroundColor: 'rgba(75, 192, 192, 0.8)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    yAxisID: 'y1'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Makespan (分钟)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: '资源利用率 (%)'
                        },
                        grid: {
                            drawOnChartArea: false,
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            padding: 20
                        }
                    }
                }
            }
        });
    }

    // 收敛性分析图
    const convergenceCtx = document.getElementById('convergenceChart');
    if (convergenceCtx) {
        new Chart(convergenceCtx, {
            type: 'line',
            data: {
                labels: Array.from({length: 100}, (_, i) => (i + 1) * 10),
                datasets: [{
                    label: 'DRL奖励值',
                    data: generateConvergenceData(),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Episode'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: '累积奖励'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

// 生成收敛性数据
function generateConvergenceData() {
    const data = [];
    let value = -100;
    
    for (let i = 0; i < 100; i++) {
        value += Math.random() * 3 - 1;
        if (i > 50) {
            value += (85 - value) * 0.02;
        }
        data.push(value);
    }
    
    return data;
}

// 初始化调度管理模块
document.addEventListener('DOMContentLoaded', function() {
    console.log('调度管理模块已加载');
    initTaskCharts();
    initEventSlider();
    initResultCharts();
});
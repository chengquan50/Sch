// 任务管理相关JavaScript代码

// DAG生成和渲染函数
function generateDAG(nodeCount, seed) {
    // 使用种子生成伪随机数
    let rng = seedRandom(seed);
    
    const nodes = [];
    const links = [];
    
    // 生成起始节点
    nodes.push({
        id: `start_${seed}`,
        name: '开始',
        x: 50,
        y: 100,
        status: 'completed'
    });
    
    // 生成中间节点
    for (let i = 1; i < nodeCount - 1; i++) {
        const nodeTypes = [
            '数据预处理', '参数设置', '仿真运行', '结果分析', 
            '质量检测', '参数调优', '验证测试', '报告生成'
        ];
        const statuses = ['completed', 'completed', 'completed'];
        
        nodes.push({
            id: `node_${i}_${seed}`,
            name: nodeTypes[Math.floor(rng() * nodeTypes.length)],
            x: 50 + (i % 4) * 150,
            y: 100 + Math.floor(i / 4) * 80,
            status: statuses[Math.floor(rng() * statuses.length)]
        });
    }
    
    // 生成结束节点
    nodes.push({
        id: `end_${seed}`,
        name: '完成',
        x: 50 + ((nodeCount - 1) % 4) * 150,
        y: 100 + Math.floor((nodeCount - 1) / 4) * 80,
        status: 'completed'
    });
    
    // 生成连接关系
    for (let i = 0; i < nodeCount - 1; i++) {
        links.push({
            source: nodes[i].id,
            target: nodes[i + 1].id
        });
        
        // 添加一些随机的依赖关系
        if (i > 1 && rng() > 0.7) {
            links.push({
                source: nodes[Math.floor(rng() * i)].id,
                target: nodes[i].id
            });
        }
    }
    
    return { nodes, links };
}

// 简单的种子随机数生成器
function seedRandom(seed) {
    let x = Math.sin(seed) * 10000;
    return function() {
        x = Math.sin(x) * 10000;
        return x - Math.floor(x);
    };
}

// 显示DAG图形
function showDAG(taskId, seed) {
    const modal = document.getElementById('dagModal');
    const title = document.getElementById('dagModalTitle');
    const container = document.getElementById('dagContainer');
    
    // 根据任务ID获取子任务数量
    const subtaskCounts = {
        'lcd-ito-window-202408-001': 34,
        'lcd-pi-bake-202408-002': 27,
        'lcd-litho-resist-202408-003': 41,
        'cell-align-pretilt-202408-004': 25,
        'seal-uv-cure-202408-005': 22,
        'module-aoi-tuning-202408-006': 24,
        'led-mocvd-gan-202408-007': 38,
        'mini-led-reflow-202408-008': 32,
        'led-phosphor-mix-202408-009': 29,
        'led-wirebond-202408-010': 45,
        'target-lcd-ito-001': 36,
        'target-lcd-pi-002': 28,
        'target-led-mocvd-003': 40,
        'target-mini-led-reflow-004': 30,
        'target-module-aoi-005': 26
    };
    
    const nodeCount = subtaskCounts[taskId] || 20;
    const dagData = generateDAG(nodeCount, seed);
    
    title.textContent = `DAG结构 - ${taskId}`;
    
    // 清除之前的内容
    container.innerHTML = '';
    
    // 创建SVG画布
    const svg = d3.select(container)
        .append('svg')
        .attr('width', 800)
        .attr('height', 500)
        .attr('viewBox', '0 0 800 500');
    
    // 定义箭头标记
    svg.append('defs').append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 8)
        .attr('refY', 0)
        .attr('markerWidth', 4)
        .attr('markerHeight', 4)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#666');
    
    // 绘制连接线
    svg.selectAll('.link')
        .data(dagData.links)
        .enter()
        .append('line')
        .attr('class', 'link')
        .attr('x1', d => {
            const sourceNode = dagData.nodes.find(n => n.id === d.source);
            return sourceNode ? sourceNode.x + 40 : 0;
        })
        .attr('y1', d => {
            const sourceNode = dagData.nodes.find(n => n.id === d.source);
            return sourceNode ? sourceNode.y + 20 : 0;
        })
        .attr('x2', d => {
            const targetNode = dagData.nodes.find(n => n.id === d.target);
            return targetNode ? targetNode.x : 0;
        })
        .attr('y2', d => {
            const targetNode = dagData.nodes.find(n => n.id === d.target);
            return targetNode ? targetNode.y + 20 : 0;
        })
        .attr('stroke', '#666')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrowhead)');
    
    // 绘制节点
    const nodeGroups = svg.selectAll('.node')
        .data(dagData.nodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x}, ${d.y})`);
    
    // 添加节点圆圈
    nodeGroups.append('rect')
        .attr('width', 80)
        .attr('height', 40)
        .attr('rx', 5)
        .attr('fill', d => {
            if (d.id.includes('start') || d.id.includes('end')) return '#17a2b8';
            return d.status === 'completed' ? '#28a745' : '#6c757d';
        })
        .attr('stroke', '#fff')
        .attr('stroke-width', 2);
    
    // 添加节点文本
    nodeGroups.append('text')
        .attr('x', 40)
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .text(d => d.name);
    
    // 显示模态框
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
}

// 批次创建功能
function initBatchCreationModal() {
    const modal = document.getElementById('createBatchModal');
    const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
    const numberInputs = modal.querySelectorAll('input[type="number"]');
    const totalTaskCountSpan = document.getElementById('totalTaskCount');
    const createBatchBtn = document.getElementById('createBatchBtn');
    const batchNameInput = document.getElementById('batchName');
    
    // 复选框变化事件
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const countInput = document.getElementById(`count_${this.id.replace('task_', '')}`);
            countInput.disabled = !this.checked;
            if (!this.checked) {
                countInput.value = 1;
            }
            updateTotalCount();
            updateCreateButtonState();
        });
    });
    
    // 数量输入变化事件
    numberInputs.forEach(input => {
        input.addEventListener('input', function() {
            updateTotalCount();
        });
    });
    
    // 批次名称输入事件
    batchNameInput.addEventListener('input', function() {
        updateCreateButtonState();
    });
    
    // 更新总任务数
    function updateTotalCount() {
        let total = 0;
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const countInput = document.getElementById(`count_${checkbox.id.replace('task_', '')}`);
                total += parseInt(countInput.value) || 0;
            }
        });
        totalTaskCountSpan.textContent = total;
    }
    
    // 更新创建按钮状态
    function updateCreateButtonState() {
        const hasName = batchNameInput.value.trim().length > 0;
        const hasSelectedTasks = Array.from(checkboxes).some(cb => cb.checked);
        createBatchBtn.disabled = !(hasName && hasSelectedTasks);
    }
    
    // 创建批次按钮点击事件
    createBatchBtn.addEventListener('click', function() {
        const batchName = batchNameInput.value.trim();
        const batchDescription = document.getElementById('batchDescription').value.trim();
        const selectedTasks = [];
        
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const taskName = checkbox.getAttribute('data-task');
                const countInput = document.getElementById(`count_${checkbox.id.replace('task_', '')}`);
                const count = parseInt(countInput.value) || 1;
                selectedTasks.push({
                    name: taskName,
                    count: count
                });
            }
        });
        
        if (selectedTasks.length > 0) {
            createNewBatch(batchName, batchDescription, selectedTasks);
            // 关闭模态框
            const bootstrapModal = bootstrap.Modal.getInstance(modal);
            bootstrapModal.hide();
            // 重置表单
            resetBatchForm();
        }
    });
    
    // 重置表单
    function resetBatchForm() {
        batchNameInput.value = '';
        document.getElementById('batchDescription').value = '';
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            const countInput = document.getElementById(`count_${checkbox.id.replace('task_', '')}`);
            countInput.disabled = true;
            countInput.value = 1;
        });
        totalTaskCountSpan.textContent = '0';
        createBatchBtn.disabled = true;
    }
}

// 创建新批次
function createNewBatch(name, description, tasks) {
    // 生成新的批次ID
    const batchId = `target-batch-${Date.now().toString().slice(-3)}`;
    const totalTaskCount = tasks.reduce((sum, task) => sum + task.count, 0);
    
    // 创建新的批次卡片HTML
    const batchCard = `
        <div class="col-lg-4 mb-3">
            <div class="card border-info">
                <div class="card-header bg-info text-white d-flex justify-content-between align-items-center">
                    <h6 class="mb-0">${name}</h6>
                    <span class="badge bg-light text-info">计划中</span>
                </div>
                <div class="card-body">
                    <div class="mb-2">
                        <strong>批次ID:</strong> ${batchId}
                    </div>
                    <strong>包含任务:</strong>
                    <ul class="list-unstyled small mt-2">
                        ${tasks.map(task => `<li>${task.name} × ${task.count}</li>`).join('')}
                    </ul>
                    <div class="mb-3">
                        <strong>总任务数:</strong> ${totalTaskCount}个
                    </div>
                    ${description ? `<div class="mb-3 text-muted small">${description}</div>` : ''}
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-outline-info">
                            <i class="fas fa-edit me-1"></i>编辑
                        </button>
                        <button class="btn btn-sm btn-success">
                            <i class="fas fa-play me-1"></i>启动
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 将新批次添加到页面
    const batchContainer = document.querySelector('#target-batches .card-body .row');
    if (batchContainer) {
        batchContainer.insertAdjacentHTML('beforeend', batchCard);
        
        // 显示成功消息
        showNotification('成功创建批次：' + name, 'success');
    }
}

// 显示通知消息
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // 3秒后自动移除
    setTimeout(() => {
        if (notification && notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// 初始化任务管理模块
document.addEventListener('DOMContentLoaded', function() {
    console.log('任务管理模块已加载');
    initBatchCreationModal();
});
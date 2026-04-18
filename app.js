// HANZO Dashboard v3.0 - LA GUARIDA
// All functions in correct order

// DATA
var agents = [
    { id: 1, name: 'Hanzo', avatar: '🦞', status: 'online', task: 'Dashboard v3.0', specialty: 'General', progress: 85 },
    { id: 2, name: 'Claude', avatar: '🧠', status: 'offline', task: 'En espera', specialty: 'Analisis', progress: 0 },
    { id: 3, name: 'Codex', avatar: '💻', status: 'offline', task: 'En espera', specialty: 'Coding', progress: 0 },
    { id: 4, name: 'Gemini', avatar: '⭐', status: 'offline', task: 'En espera', specialty: 'Research', progress: 0 }
];
var businesses = [{ id: 'ubicore', name: 'Ubicore', icon: '📦', sales: '4.2K€', orders: 12, status: 'active' }];
var currentMission = { name: 'Dashboard v3.0 SUPREME', progress: 85, startTime: '09:00', elapsed: '10h 42m', agent: '🦞 Hanzo' };
var kanbanTasks = {
    pendiente: [{ id: 1, title: 'Terminar modulo Calendario', priority: 'high', type: 'mision', agent: 'Hanzo' }],
    asignado: [],
    progreso: [{ id: 2, title: 'Dashboard v3.0', priority: 'high', type: 'mision', agent: 'Hanzo' }],
    revision: [],
    testing: [],
    terminado: [{ id: 3, title: 'Editor avatares', priority: 'high', type: 'mision', agent: 'Hanzo' }]
};
var pomodoroTime = 25 * 60;
var pomodoroInterval = null;
var pomodorosCompleted = 0;
var activityLog = [];

// LOG
function log(msg) {
    console.log(msg);
    var entry = { time: new Date().toLocaleTimeString(), text: msg };
    activityLog.unshift(entry);
    if (activityLog.length > 50) activityLog.pop();
    var logEl = document.getElementById('activity-log');
    if (logEl) {
        var html = activityLog.map(function(e) { return '<div class="activity-item"><span class="time">' + e.time + '</span><span class="text">' + e.text + '</span></div>'; }).join('');
        logEl.innerHTML = html;
    }
}

// SAVE/LOAD
function saveData() {
    var data = { agents: agents, businesses: businesses, currentMission: currentMission, kanbanTasks: kanbanTasks, pomodorosCompleted: pomodorosCompleted, activityLog: activityLog };
    localStorage.setItem('hanzoDashboard', JSON.stringify(data));
    log('💾 Guardado');
}
function loadData() {
    var data = JSON.parse(localStorage.getItem('hanzoDashboard') || '{}');
    if (data.agents) agents = data.agents;
    if (data.businesses) businesses = data.businesses;
    if (data.currentMission) currentMission = data.currentMission;
    if (data.kanbanTasks) kanbanTasks = data.kanbanTasks;
    if (data.pomodorosCompleted) pomodorosCompleted = data.pomodorosCompleted;
    if (data.activityLog) activityLog = data.activityLog;
    log('📂 Datos cargados');
}

// INIT
function initClock() {
    setInterval(function() {
        var now = new Date();
        var clock = document.getElementById('clock');
        if (clock) clock.textContent = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }, 1000);
}
function renderDate() {
    var date = document.getElementById('date');
    if (date) date.textContent = new Date().toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
}

// AGENTS
function renderAgents() {
    var grid = document.getElementById('agents-grid');
    if (!grid) return;
    grid.innerHTML = agents.map(function(a) {
        var statusClass = a.status === 'online' ? 'online' : 'offline';
        return '<div class="agent-card"><div class="agent-avatar">' + a.avatar + '</div><div class="agent-info"><div class="agent-name">' + a.name + '</div><div class="agent-task">' + a.task + '</div><div class="agent-status ' + statusClass + '">' + (a.status === 'online' ? '🟢 Online' : '🔴 Offline') + '</div></div><div class="agent-actions"><button class="btn-small" onclick="editAgent(' + a.id + ')">✏️ Editar</button></div></div>';
    }).join('');
    updateAgentCount();
}
function updateAgentCount() {
    var el = document.getElementById('agent-count');
    if (el) el.textContent = agents.filter(function(a) { return a.status === 'online'; }).length + '/' + agents.length;
}

// AGENT MODALS
function addNewAgent() {
    var modal = document.getElementById('agent-modal');
    if (modal) modal.classList.add('show');
}
function closeAgentModal() {
    var m = document.getElementById('agent-modal');
    if (m) m.classList.remove('show');
}
function selectAgentEmoji(emoji, type) {
    var preview = document.getElementById('new-agent-avatar-preview');
    if (preview) { preview.textContent = emoji; preview.dataset.emoji = emoji; preview.dataset.type = 'emoji'; }
}
function handleAgentAvatarUpload(input, type) {
    var file = input.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var preview = document.getElementById('new-agent-avatar-preview');
            if (preview) { preview.innerHTML = '<img src="' + e.target.result + '" style="width:50px;height:50px;border-radius:50%;">'; preview.dataset.emoji = e.target.result; preview.dataset.type = 'image'; }
        };
        reader.readAsDataURL(file);
    }
}
function createAgentFromModal() {
    var name = document.getElementById('agent-name').value;
    var specialty = document.getElementById('agent-specialty').value;
    var preview = document.getElementById('new-agent-avatar-preview');
    var avatar = preview ? (preview.dataset.type === 'image' ? preview.dataset.emoji : (preview.textContent || '🦞')) : '🦞';
    if (!name) { alert('Pon un nombre!'); return; }
    agents.push({ id: agents.length + 1, name: name, avatar: avatar, status: 'offline', task: 'En espera', specialty: specialty, progress: 0 });
    log('✅ Nuevo agente: ' + name);
    closeAgentModal();
    renderAgents();
    saveData();
}
function editAgent(id) {
    var agent = agents.find(function(a) { return a.id === id; });
    if (agent) {
        document.getElementById('edit-agent-id').value = id;
        document.getElementById('edit-agent-name').value = agent.name;
        document.getElementById('edit-agent-specialty').value = agent.specialty;
        document.getElementById('edit-agent-status').value = agent.status;
        var modal = document.getElementById('edit-agent-modal');
        if (modal) modal.classList.add('show');
    }
}
function closeEditAgentModal() {
    var m = document.getElementById('edit-agent-modal');
    if (m) m.classList.remove('show');
}
function saveEditAgent() {
    var id = parseInt(document.getElementById('edit-agent-id').value);
    var agent = agents.find(function(a) { return a.id === id; });
    if (agent) {
        agent.name = document.getElementById('edit-agent-name').value;
        agent.specialty = document.getElementById('edit-agent-specialty').value;
        agent.status = document.getElementById('edit-agent-status').value;
        log('💾 Guardado: ' + agent.name);
        closeEditAgentModal();
        renderAgents();
        saveData();
    }
}

// AVATAR EDITOR
function openAvatarEditor() {
    var modal = document.getElementById('avatar-modal');
    if (modal) modal.classList.add('show');
}
function closeModal() {
    var m = document.getElementById('avatar-modal');
    if (m) m.classList.remove('show');
}
function selectAvatar(avatar) {
    var preview = document.getElementById('preview-avatar');
    if (preview) preview.textContent = avatar;
    var name = document.getElementById('preview-name');
    if (name) name.textContent = agents[0].name;
}
function saveAvatar() {
    var preview = document.getElementById('preview-avatar');
    if (preview && agents[0]) {
        agents[0].avatar = preview.textContent;
        log('💾 Avatar guardado: ' + agents[0].avatar);
        renderAgents();
        saveData();
    }
    closeModal();
}

// BUSINESS
function renderBusinesses() {
    var grid = document.getElementById('business-grid');
    if (!grid) return;
    grid.innerHTML = businesses.map(function(b) { return '<div class="business-card"><div class="business-icon">' + b.icon + '</div><div class="business-name">' + b.name + '</div><div class="business-sales">' + b.sales + '</div></div>'; }).join('');
}

function addNewBusiness() {
    var name = prompt('Nombre del negocio:');
    if (name) {
        businesses.push({ id: Date.now(), name: name, icon: '📦', sales: '0€', status: 'active' });
        renderBusinesses();
        saveData();
    }
}

// KANBAN
function renderKanban() {
    var board = document.getElementById('kanban-board');
    if (!board) return;
    var columns = ['pendiente', 'asignado', 'progreso', 'revision', 'testing', 'terminado'];
    var titles = ['📋 Pendiente', '👤 Asignado', '⚙️ Progreso', '🔍 Revision', '🧪 Testing', '✅ Terminado'];
    board.innerHTML = columns.map(function(col, i) {
        var tasks = kanbanTasks[col] || [];
        return '<div class="kanban-column"><h3>' + titles[i] + '</h3><div class="kanban-tasks">' + tasks.map(function(t) { return '<div class="task-card" draggable="true" ondragstart="dragTask(event, ' + t.id + ')"><div class="task-title">' + t.title + '</div><div class="task-meta"><span class="task-priority ' + t.priority + '">' + t.priority + '</span><span class="task-agent">' + t.agent + '</span></div></div>'; }).join('') + '</div></div>';
    }).join('');
}
function addNewTask() {
    var modal = document.getElementById('task-modal');
    if (modal) modal.classList.add('show');
}
function closeTaskModal() {
    var m = document.getElementById('task-modal');
    if (m) m.classList.remove('show');
    var t = document.getElementById('task-title');
    if (t) t.value = '';
}
function createTaskFromModal() {
    var titleEl = document.getElementById('task-title');
    var title = titleEl ? titleEl.value : '';
    var descEl = document.getElementById('task-desc');
    var desc = descEl ? descEl.value : '';
    var projEl = document.getElementById('task-project');
    var project = projEl ? projEl.value : 'General';
    var statEl = document.getElementById('task-status');
    var status = statEl ? statEl.value : 'pendiente';
    var prioEl = document.getElementById('task-priority');
    var priority = prioEl ? prioEl.value : 'medium';
    var agEl = document.getElementById('task-agent');
    var agent = agEl ? agEl.value : 'Hanzo';
    
    if (!title) { alert('Pon un titulo!'); return; }
    
    if (!kanbanTasks[status]) kanbanTasks[status] = [];
    kanbanTasks[status].push({ id: Date.now(), title: title, description: desc, project: project, priority: priority, agent: agent });
    log('📋 Tarea: ' + title);
    closeTaskModal();
    renderKanban();
    saveData();
}
function dragTask(ev, id) {
    ev.dataTransfer.setData('taskId', id);
}
function dropTask(ev, col) {
    ev.preventDefault();
    var id = parseInt(ev.dataTransfer.getData('taskId'));
    var allCols = ['pendiente', 'asignado', 'progreso', 'revision', 'testing', 'terminado'];
    allCols.forEach(function(c) {
        var idx = -1;
        for (var i = 0; i < (kanbanTasks[c] || []).length; i++) {
            if (kanbanTasks[c][i].id === id) { idx = i; break; }
        }
        if (idx > -1) {
            var task = kanbanTasks[c].splice(idx, 1)[0];
            if (!kanbanTasks[col]) kanbanTasks[col] = [];
            kanbanTasks[col].push(task);
        }
    });
    renderKanban();
    saveData();
    log('📦 Tarea movida a ' + col);
}

// MISSIONS
function addNewMission() {
    var name = prompt('Nombre de la mision:');
    if (!name) return;
    currentMission = { name: name, progress: 0, startTime: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }), elapsed: '0m', agent: '🦞 Hanzo' };
    var el = document.getElementById('current-mission');
    if (el) el.textContent = name;
    var progress = document.getElementById('mission-progress');
    if (progress) { progress.style.width = '0%'; progress.textContent = '0%'; }
    var agent = document.getElementById('mission-agent');
    if (agent) agent.textContent = '🦞 Hanzo';
    var start = document.getElementById('mission-start');
    if (start) start.textContent = currentMission.startTime;
    saveData();
    log('🎯 Nueva mision: ' + name);
}
function updateProgress() {
    currentMission.progress = Math.min(100, currentMission.progress + 10);
    var progress = document.getElementById('mission-progress');
    if (progress) { progress.style.width = currentMission.progress + '%'; progress.textContent = currentMission.progress + '%'; }
    saveData();
    log('📈 Progreso: ' + currentMission.progress + '%');
}
function pauseMission() {
    log('⏸️ Mision pausada');
    alert('Mision pausada');
}

// POMODORO
function startPomodoro() {
    if (pomodoroInterval) return;
    pomodoroInterval = setInterval(function() {
        pomodoroTime--;
        var min = Math.floor(pomodoroTime / 60);
        var sec = pomodoroTime % 60;
        var timer = document.getElementById('pomodoro-timer');
        if (timer) timer.innerHTML = '<span class="timer-minutes">' + min + '</span>:<span class="timer-seconds">' + (sec < 10 ? '0' : '') + sec + '</span>';
        if (pomodoroTime <= 0) {
            clearInterval(pomodoroInterval);
            pomodoroInterval = null;
            pomodorosCompleted++;
            log('⏱️ Pomodoro completado!');
            alert('Pomodoro completado!');
        }
    }, 1000);
    log('⏱️ Pomodoro iniciado');
}
function pausePomodoro() {
    if (pomodoroInterval) { clearInterval(pomodoroInterval); pomodoroInterval = null; log('⏸️ Pausado'); }
}
function resetPomodoro() {
    pausePomodoro();
    pomodoroTime = 25 * 60;
    var timer = document.getElementById('pomodoro-timer');
    if (timer) timer.innerHTML = '<span class="timer-minutes">25</span>:<span class="timer-seconds">00</span>';
    log('🔄 Reset');
}

// EVENTS & FILES
function addNewEvent() {
    var title = prompt('Evento:');
    if (title) log('📅 Evento: ' + title);
}
function addNewFile() {
    var name = prompt('Archivo:');
    if (name) log('📁 Archivo: ' + name);
}

// NAV
function navTo(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// DOM READY
document.addEventListener('DOMContentLoaded', function() {
    log('🚀 Iniciando Dashboard...');
    loadData();
    initClock();
    renderDate();
    renderAgents();
    renderBusinesses();
    renderKanban();
    updateAgentCount();
    log('🎉 Dashboard LISTO!');
});

// EXPORTS
window.addNewAgent = addNewAgent;
window.addNewBusiness = addNewBusiness;
window.addNewTask = addNewTask;
window.addNewMission = addNewMission;
window.updateProgress = updateProgress;
window.pauseMission = pauseMission;
window.openAvatarEditor = openAvatarEditor;
window.closeModal = closeModal;
window.selectAvatar = selectAvatar;
window.saveAvatar = saveAvatar;
window.editAgent = editAgent;
window.allowDrop = function(ev) { ev.preventDefault(); };
window.dragTask = dragTask;
window.dropTask = dropTask;
window.navTo = navTo;
window.startPomodoro = startPomodoro;
window.pausePomodoro = pausePomodoro;
window.resetPomodoro = resetPomodoro;
window.addNewEvent = addNewEvent;
window.addNewFile = addNewFile;
window.saveData = saveData;
window.closeTaskModal = closeTaskModal;
window.createTaskFromModal = createTaskFromModal;
window.closeAgentModal = closeAgentModal;
window.createAgentFromModal = createAgentFromModal;
window.handleAgentAvatarUpload = handleAgentAvatarUpload;
window.closeEditAgentModal = closeEditAgentModal;
window.saveEditAgent = saveEditAgent;
window.selectAgentEmoji = selectAgentEmoji;
window.renderAgents = renderAgents;
window.updateAgentCount = updateAgentCount;
window.renderKanban = renderKanban;
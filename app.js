// Reload v33
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
var events = [];

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
            var previewId = type === 'edit' ? 'edit-agent-avatar-preview' : 'new-agent-avatar-preview';
            var preview = document.getElementById(previewId);
            if (preview) { 
                preview.innerHTML = '<img src="' + e.target.result + '" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">'; 
                preview.dataset.image = e.target.result; 
                preview.dataset.type = 'image';
            }
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
        var preview = document.getElementById('edit-agent-avatar-preview');
        if (preview) {
            if (agent.avatar && agent.avatar.startsWith('data:')) {
                preview.innerHTML = '<img src="' + agent.avatar + '" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">';
                preview.dataset.image = agent.avatar;
                preview.dataset.type = 'image';
            } else {
                preview.innerHTML = agent.avatar || '🦞';
            }
        }
        document.getElementById('edit-agent-avatar-upload').value = '';
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
        var preview = document.getElementById('edit-agent-avatar-preview');
        if (preview && preview.dataset.type === 'image' && preview.dataset.image) {
            agent.avatar = preview.dataset.image;
        }
        log('Guardado: ' + agent.name);
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
    initCalendarUI();
    renderMonthCalendar();
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
        return '<div class="kanban-column" ondragover="allowDrop(event)" ondrop="dropTask(event, \'' + col + '\')"><h3>' + titles[i] + ' (' + tasks.length + ')</h3><div class="kanban-tasks">' + tasks.map(function(t) { return '<div class="kanban-task" draggable="true" ondragstart="dragTask(event, ' + t.id + ')"><div class="kanban-task-header"><div class="kanban-task-title">' + t.title + '</div><div class="kanban-task-actions"><button class="btn-icon" onclick="editTask(' + t.id + ')" title="Editar">✏️</button><button class="btn-icon" onclick="deleteTask(' + t.id + ')" title="Eliminar">🗑️</button></div></div>' + (t.description ? '<div class="kanban-task-desc">' + t.description + '</div>' : '') + '<div class="kanban-task-meta"><span class="task-project">📁 ' + (t.project || 'General') + '</span><span class="task-priority ' + t.priority + '">' + (t.priority === 'high' ? '🔴' : t.priority === 'medium' ? '🟡' : '🟢') + '</span><span class="task-agent">👤 ' + t.agent + '</span></div></div>'; }).join('') + '</div></div>';
    }).join('');
}

function editTask(id) {
    var allCols = ['pendiente', 'asignado', 'progreso', 'revision', 'testing', 'terminado'];
    var task = null;
    var currentCol = '';
    allCols.forEach(function(c) {
        var found = (kanbanTasks[c] || []).find(function(t) { return t.id === id; });
        if (found) { task = found; currentCol = c; }
    });
    if (!task) return;
    
    document.getElementById('edit-task-id').value = id;
    document.getElementById('edit-task-col').value = currentCol;
    document.getElementById('edit-task-title').value = task.title || '';
    document.getElementById('edit-task-desc').value = task.description || '';
    document.getElementById('edit-task-project').value = task.project || 'General';
    document.getElementById('edit-task-status').value = currentCol;
    document.getElementById('edit-task-priority').value = task.priority || 'medium';
    document.getElementById('edit-task-agent').value = task.agent || 'Hanzo';
    
    document.getElementById('edit-task-modal').classList.add('show');
}

function saveEditTask() {
    var id = parseInt(document.getElementById('edit-task-id').value);
    var oldCol = document.getElementById('edit-task-col').value;
    var newCol = document.getElementById('edit-task-status').value;
    var title = document.getElementById('edit-task-title').value;
    var desc = document.getElementById('edit-task-desc').value;
    var project = document.getElementById('edit-task-project').value;
    var priority = document.getElementById('edit-task-priority').value;
    var agent = document.getElementById('edit-task-agent').value;
    
    if (!title) { alert('Pon un titulo!'); return; }
    
    var allCols = ['pendiente', 'asignado', 'progreso', 'revision', 'testing', 'terminado'];
    allCols.forEach(function(c) {
        var idx = -1;
        for (var i = 0; i < (kanbanTasks[c] || []).length; i++) {
            if (kanbanTasks[c][i].id === id) { idx = i; break; }
        }
        if (idx > -1) {
            kanbanTasks[c].splice(idx, 1);
        }
    });
    
    var newTask = { id: id, title: title, description: desc, project: project, priority: priority, agent: agent };
    if (!kanbanTasks[newCol]) kanbanTasks[newCol] = [];
    kanbanTasks[newCol].push(newTask);
    
    log('✏️ Tarea editada: ' + title);
    closeEditTaskModal();
    renderKanban();
    saveData();
}

function closeEditTaskModal() {
    document.getElementById('edit-task-modal').classList.remove('show');
}

function deleteTask(id) {
    if (!confirm('¿Eliminar esta tarea?')) return;
    var allCols = ['pendiente', 'asignado', 'progreso', 'revision', 'testing', 'terminado'];
    allCols.forEach(function(c) {
        var idx = -1;
        for (var i = 0; i < (kanbanTasks[c] || []).length; i++) {
            if (kanbanTasks[c][i].id === id) { idx = i; break; }
        }
        if (idx > -1) {
            var removed = kanbanTasks[c].splice(idx, 1)[0];
            log('🗑️ Tarea eliminada: ' + removed.title);
        }
    });
    renderKanban();
    saveData();
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
    document.getElementById('event-title').value = '';
    document.getElementById('event-desc').value = '';
    document.getElementById('event-date').value = '';
    document.getElementById('event-time').value = '';
    document.getElementById('event-assign').value = 'Jeremy';
    document.getElementById('event-modal').classList.add('show');
}
function closeEventModal() {
    var m = document.getElementById('event-modal');
    if (m) m.classList.remove('show');
}
function createEventFromModal() {
    var title = document.getElementById('event-title').value;
    var desc = document.getElementById('event-desc').value;
    var date = document.getElementById('event-date').value;
    var time = document.getElementById('event-time').value;
    var assign = document.getElementById('event-assign').value;
    
    if (!title || !date) { alert('Pon titulo y fecha!'); return; }
    
    events.push({ id: Date.now(), title: title, description: desc, date: date, time: time, assign: assign });
    log('Event creado: ' + title);
    closeEventModal();
    renderEvents();
    renderCalendarWithEvents();
    saveData();
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
    initCalendarUI();
    renderMonthCalendar();
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
window.closeEventModal = closeEventModal;
window.createEventFromModal = createEventFromModal;
window.renderEvents = renderEvents;
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
window.editTask = editTask;
window.saveEditTask = saveEditTask;
window.closeEditTaskModal = closeEditTaskModal;
window.deleteTask = deleteTask;
function renderEvents() {
    var list = document.getElementById("events-list");
    if (!list) return;
    list.innerHTML = events.map(function(e) {
        return '<div class="event-item"><div class="event-date">' + e.date + ' ' + e.time + '</div><div class="event-title">' + e.title + '</div>' + (e.description ? '<div class="event-desc">' + e.description + '</div>' : '') + '<div class="event-assign">' + e.assign + '</div></div>';
    }).join('');
}
function ADD_CALENDAR_DOTS() {
    events.forEach(function(e) {
        if (!e.date) return;
        var dayEl = document.querySelector('.cal-day[data-date="' + e.date + '"]');
        if (!dayEl) {
            var dayNum = parseInt(e.date.split('-')[2]);
            var daySelectors = document.querySelectorAll('.cal-day');
            var today = new Date();
            var firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay() || 7;
            dayEl = daySelectors[dayNum + firstDay - 1];
        }
        if (dayEl) {
            dayEl.classList.add('has-event');
            var eventDot = document.createElement('div');
            eventDot.className = 'event-dot';
            eventDot.title = e.title;
            dayEl.appendChild(eventDot);
        }
    });
}
window.renderCalendarEvents = renderCalendarEvents;
function addCalendarEventDots() {
    var dayElements = document.querySelectorAll('.cal-day');
    events.forEach(function(e) {
        if (!e.date) return;
        var dateParts = e.date.split('-');
        var day = parseInt(dateParts[2]);
        if (day >= 1 && day <= 30 && dayElements[day]) {
            dayElements[day].classList.add('has-event');
        }
    });
}
window.addCalendarEventDots = addCalendarEventDots;
function renderCalendarWithEvents() {
    var dayBlocks = document.querySelectorAll('.cal-days');
    if (!dayBlocks.length) return;
    
    var dayElements = dayBlocks[0].querySelectorAll('.cal-day');
    var today = new Date();
    var firstDayOfWeek = new Date(today.getFullYear(), today.getMonth(), 1).getDay() || 7;
    
    events.forEach(function(e) {
        if (!e.date) return;
        var parts = e.date.split('-');
        var day = parseInt(parts[2]);
        var idx = day + firstDayOfWeek - 2;
        
        if (day >= 1 && day <= 31 && dayElements[idx]) {
            var el = dayElements[idx];
            el.classList.add('has-event');
            el.style.position = 'relative';
            
            var eventBadge = document.createElement('div');
            eventBadge.className = 'calendar-event';
            eventBadge.innerHTML = '<span class="event-time">' + (e.time || '--:--') + '</span> <span class="event-title">' + e.title + '</span>';
            eventBadge.dataset.eventId = e.id;
            eventBadge.onclick = function(evt) { 
                evt.stopPropagation();
                openEventDetails(e.id); 
            };
            el.appendChild(eventBadge);
        }
    });
}

function openEventDetails(id) {
    var ev = events.find(function(e) { return e.id === id; });
    if (!ev) return;
    document.getElementById('edit-event-id').value = id;
    document.getElementById('edit-event-title').value = ev.title || '';
    document.getElementById('edit-event-desc').value = ev.description || '';
    document.getElementById('edit-event-date').value = ev.date || '';
    document.getElementById('edit-event-time').value = ev.time || '';
    document.getElementById('edit-event-assign').value = ev.assign || 'Jeremy';
    document.getElementById('edit-event-modal').classList.add('show');
}

function saveEditEvent() {
    var id = parseInt(document.getElementById('edit-event-id').value);
    var idx = events.findIndex(function(e) { return e.id === id; });
    if (idx === -1) return;
    
    events[idx].title = document.getElementById('edit-event-title').value;
    events[idx].description = document.getElementById('edit-event-desc').value;
    events[idx].date = document.getElementById('edit-event-date').value;
    events[idx].time = document.getElementById('edit-event-time').value;
    events[idx].assign = document.getElementById('edit-event-assign').value;
    
    closeEditEventModal();
    renderEvents();
    renderCalendarWithEvents();
    saveData();
}

function closeEditEventModal() {
    document.getElementById('edit-event-modal').classList.remove('show');
}

function deleteEvent(id) {
    if (!confirm('Eliminar este evento?')) return;
    events = events.filter(function(e) { return e.id !== id; });
    renderEvents();
    renderCalendarWithEvents();
    saveData();
}
window.renderCalendarWithEvents = renderCalendarWithEvents;
window.openEventDetails = openEventDetails;
window.saveEditEvent = saveEditEvent;
window.closeEditEventModal = closeEditEventModal;
window.deleteEvent = deleteEvent;
var currentYear = new Date().getFullYear();
var currentMonth = new Date().getMonth();

function renderCalendarHeader() {
    var yearSelect = document.getElementById('calendar-year');
    var monthTabs = document.querySelector('.calendar-tabs');
    
    if (yearSelect) {
        yearSelect.innerHTML = '';
        for (var y = 2024; y <= 2040; y++) {
            var opt = document.createElement('option');
            opt.value = y;
            opt.textContent = y;
            if (y === currentYear) opt.selected = true;
            yearSelect.appendChild(opt);
        }
        yearSelect.onchange = function() {
            currentYear = parseInt(this.value);
            renderMonthCalendar();
        };
    }
    
    if (monthTabs) {
        var monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        monthTabs.innerHTML = '';
        monthNames.forEach(function(m, idx) {
            var tab = document.createElement('span');
            tab.className = 'cal-tab' + (idx === currentMonth ? ' active' : '');
            tab.textContent = m;
            tab.onclick = function() {
                document.querySelectorAll('.cal-tab').forEach(function(t) { t.classList.remove('active'); });
                this.classList.add('active');
                currentMonth = idx;
                renderMonthCalendar();
            };
            monthTabs.appendChild(tab);
        });
    }
}

function renderMonthCalendar() {
    var calDays = document.querySelector('.cal-days');
    if (!calDays) return;
    
    var firstDay = new Date(currentYear, currentMonth, 1).getDay() || 7;
    var daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    calDays.innerHTML = '';
    
    // Días vacíos al inicio
    for (var i = 1; i < firstDay; i++) {
        var empty = document.createElement('span');
        empty.className = 'cal-day';
        calDays.appendChild(empty);
    }
    
    // Días del mes
    for (var d = 1; d <= daysInMonth; d++) {
        var dayEl = document.createElement('span');
        dayEl.className = 'cal-day';
        dayEl.textContent = d;
        dayEl.dataset.date = currentYear + '-' + String(currentMonth + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
        
        // Buscar eventos de este día
        var dayEvents = events.filter(function(e) {
            if (!e.date) return false;
            var parts = e.date.split('-');
            return parseInt(parts[0]) === currentYear && 
                   parseInt(parts[1]) === currentMonth + 1 && 
                   parseInt(parts[2]) === d;
        });
        
        if (dayEvents.length > 0) {
            dayEl.classList.add('has-event');
            dayEvents.forEach(function(ev) {
                var eventBadge = document.createElement('div');
                eventBadge.className = 'calendar-event';
                eventBadge.innerHTML = (ev.time || '') + ' ' + ev.title;
                eventBadge.onclick = function(e) {
                    e.stopPropagation();
                    openEventDetails(ev.id);
                };
                dayEl.appendChild(eventBadge);
            });
        }
        
        // Hoy
        var today = new Date();
        if (d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
            dayEl.classList.add('today');
        }
        
        calDays.appendChild(dayEl);
    }
}
window.renderCalendarHeader = renderCalendarHeader;
window.renderMonthCalendar = renderMonthCalendar;
setTimeout(function() {
    renderCalendarHeader();
}, 100);
function initCalendarUI() {
    var panel = document.querySelector("#calendario .panel-header");
    if (panel) {
        if (!document.getElementById('calendar-year')) {
            var yearSelect = document.createElement("select");
            yearSelect.id = "calendar-year";
            yearSelect.className = "year-select";
            yearSelect.onchange = function() {
                currentYear = parseInt(this.value);
                renderMonthCalendar();
            };
            for (var y = 2024; y <= 2040; y++) {
                var opt = document.createElement("option");
                opt.value = y;
                opt.textContent = y;
                if (y === currentYear) opt.selected = true;
                yearSelect.appendChild(opt);
            }
            panel.insertBefore(yearSelect, panel.querySelector("button"));
        }
    }
    
    var tabs = document.querySelector(".calendar-tabs");
    if (tabs && tabs.children.length === 0) {
        var months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        months.forEach(function(m, i) {
            var tab = document.createElement("span");
            tab.className = "cal-tab" + (i === currentMonth ? " active" : "");
            tab.textContent = m;
            tab.onclick = function() {
                document.querySelectorAll(".cal-tab").forEach(function(t) { t.classList.remove("active"); });
                this.classList.add("active");
                currentMonth = i;
                renderMonthCalendar();
            };
            tabs.appendChild(tab);
        });
    }
    
    renderMonthCalendar();
}
window.initCalendarUI = initCalendarUI;
function switchMonth(m) {
    currentMonth = m;
    document.querySelectorAll('.cal-tab').forEach(function(t) { t.classList.remove('active'); });
    if (document.querySelectorAll('.cal-tab')[m]) {
        document.querySelectorAll('.cal-tab')[m].classList.add('active');
    }
    renderMonthCalendar();
}

function setYear(y) { if(typeof y==="string") y=parseInt(y);
    currentYear = y;
    document.getElementById('calendar-year').value = y;
    renderMonthCalendar();
}
window.switchMonth = switchMonth;
window.setYear = setYear;
// Tab Manager for Dashboard v3.1
var openTabs = ['panel'];

function openTab(tabId) {
    // Hide all panels
    document.querySelectorAll('.panel').forEach(function(p) { 
        p.style.display = 'none'; 
    });
    
    // Show selected tab
    var tab = document.getElementById(tabId);
    if (tab) {
        tab.style.display = 'block';
    }
    
    // Update nav
    document.querySelectorAll('.nav-link').forEach(function(l) { 
        l.classList.remove('active'); 
    });
    
    // Find and activate nav link
    var navLinks = document.querySelectorAll('.nav-link');
    var tabIndex = ['panel', 'agentes', 'kanban', 'stats', 'pomodoro', 'calendario', 'archivos', 'logs'].indexOf(tabId);
    if (navLinks[tabIndex]) {
        navLinks[tabIndex].classList.add('active');
    }
    
    // Don't add to openTabs - we replace current view
}

function initTabSystem() {
    // Hide all panels initially except first one
    document.querySelectorAll('.panel').forEach(function(p, i) {
        if (p.id !== 'panel') {
            p.style.display = 'none';
        }
    });
    
    // Update nav to use tabs
    document.querySelectorAll('.nav-link').forEach(function(link, i) {
        var tabIds = ['panel', 'agentes', 'kanban', 'stats', 'pomodoro', 'calendario', 'archivos', 'logs'];
        link.onclick = function() {
            openTab(tabIds[i]);
        };
    });
}
window.openTab=openTab;
window.initTabSystem=initTabSystem;
initTabSystem();
function deleteAgent(id) {
    if (!confirm('Eliminar este agente?')) return;
    agents = agents.filter(function(a) { return a.id !== id; });
    renderAgents();
    saveData();
    log('Agente eliminado');
}
window.deleteAgent = deleteAgent;
// ════════════════════════════════════════════════════════════════════
// HANZO Dashboard v3.0 SUPREME - App.js CON LOGS
// ════════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════════
// DATA
// ════════════════════════════════════════════════════════════════════
var agents = [
    { id: 1, name: 'Hanzo', avatar: '🦞', status: 'online', task: 'Dashboard v3.0 SUPREME', specialty: 'General', progress: 85 },
    { id: 2, name: 'Claude', avatar: '🧠', status: 'offline', task: 'En espera', specialty: 'Análisis', progress: 0 },
    { id: 3, name: 'Codex', avatar: '💻', status: 'offline', task: 'En espera', specialty: 'Coding', progress: 0 },
    { id: 4, name: 'Gemini', avatar: '⭐', status: 'offline', task: 'En espera', specialty: 'Research', progress: 0 }
];

var businesses = [
    { id: 'ubicore', name: 'Ubicore', icon: '📦', sales: '4.2K€', orders: 12, status: 'active' }
];

var currentMission = {
    name: 'Dashboard v3.0 SUPREME',
    progress: 85,
    agent: '🦞 Hanzo',
    startTime: '09:00',
    elapsed: '10h 42m'
};

var kanbanTasks = {
    pendiente: [
        { id: 1, title: 'Terminar módulo Calendario', priority: 'high', type: 'mision', agent: 'Hanzo' },
        { id: 2, title: 'Subir archivos a Drive', priority: 'medium', type: 'tarea', agent: 'Hanzo' }
    ],
    asignado: [
        { id: 3, title: 'Revisar creativos Meta', priority: 'medium', type: 'tarea', agent: 'Hanzo' }
    ],
    progreso: [
        { id: 4, title: 'Dashboard v3.0', priority: 'high', type: 'mision', agent: 'Hanzo' }
    ],
    revision: [
        { id: 5, title: 'Testing avatares', priority: 'low', type: 'bug', agent: 'Hanzo' }
    ],
    testing: [],
    terminado: [
        { id: 6, title: 'Editor avatares', priority: 'high', type: 'mision', agent: 'Hanzo' },
        { id: 7, title: 'Diseño visual', priority: 'medium', type: 'tarea', agent: 'Hanzo' },
        { id: 8, title: 'Kanban 6 columnas', priority: 'high', type: 'mision', agent: 'Hanzo' }
    ]
};

var activityLog = [
    { time: '19:42', text: '⚡ Completando módulo de estadísticas' },
    { time: '19:40', text: '📋 Tarea #23 movida a "En Progreso"' },
    { time: '19:38', text: '🦞 Hanzo: Dashboard v3.0 propuesto' },
    { time: '19:35', text: '🔄 Sincronizado con Centro de Operaciones' },
    { time: '19:30', text: '✅ Módulo calendario completado' },
    { time: '19:25', text: '📋 Nueva tarea: "Mejorar visuales"' },
    { time: '19:20', text: '⚡ Iniciado sesión de trabajo' }
];

var selectedAvatar = '🦞';
var selectedAgentIndex = 0;

// Helper para logging
function log(msg) {
    console.log('[HANZO] ' + new Date().toLocaleTimeString() + ' - ' + msg);
    var logEl = document.getElementById('activity-log');
    if (logEl) {
        var entry = document.createElement('div');
        entry.className = 'activity-item';
        entry.innerHTML = '<span class="time">' + new Date().toLocaleTimeString('es-ES', {hour:'2-digit', minute:'2-digit'}) + '</span><span class="text">' + msg + '</span>';
        logEl.insertBefore(entry, logEl.firstChild);
    }
}

// ════════════════════════════════════════════════════════════════════
// PERSISTENCIA - GUARDAR/CARGAR DATOS
// ═══════════════════════════════════════════════════════════════
function saveData() {
    try {
        var data = {
            agents: agents,
            businesses: businesses,
            currentMission: currentMission,
            kanbanTasks: kanbanTasks,
            activityLog: activityLog,
            pomodorosCompleted: pomodorosCompleted
        };
        localStorage.setItem('hanzo_dashboard_v3', JSON.stringify(data));
        log('💾 Datos guardados');
    } catch(e) {
        log('❌ Error guardando: ' + e.message);
    }
}

function loadData() {
    try {
        var saved = localStorage.getItem('hanzo_dashboard_v3');
        if (saved) {
            var data = JSON.parse(saved);
            if (data.agents) agents = data.agents;
            if (data.businesses) businesses = data.businesses;
            if (data.currentMission) currentMission = data.currentMission;
            if (data.kanbanTasks) kanbanTasks = data.kanbanTasks;
            if (data.activityLog) activityLog = data.activityLog;
            if (data.pomodorosCompleted) pomodorosCompleted = data.pomodorosCompleted;
            log('📂 Datos cargados: ' + agents.length + ' agentes, ' + (kanbanTasks.pendiente.length + kanbanTasks.progreso.length + kanbanTasks.terminado.length) + ' tareas');
            return true;
        }
        log('📂 No hay datos Guardados');
        return false;
    } catch(e) {
        log('❌ Error cargando: ' + e.message);
        return false;
    }
}

// Auto-guardar cada 30 segundos
setInterval(saveData, 30000);

// ══════════════��═════════════════════════════════════════════════════
// INITIALIZATION
// ════════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', function() {
    log('🚀 Dashboard v3.0 iniciando...');
    
    // Cargar datos guardados primero
    var hadData = loadData();
    
    try {
        initClock();
        log('✅ Clock iniciado');
    } catch(e) { log('❌ Error initClock: ' + e.message); }
    
    try {
        renderDate();
        log('✅ Fecha renderizada');
    } catch(e) { log('❌ Error renderDate: ' + e.message); }
    
    try {
        renderAgents();
        log('✅ Agentes renderizados: ' + agents.length);
    } catch(e) { log('❌ Error renderAgents: ' + e.message); }
    
    try {
        renderBusinesses();
        log('✅ Negocios renderizados');
    } catch(e) { log('❌ Error renderBusinesses: ' + e.message); }
    
    try {
        renderKanban();
        log('✅ Kanban renderizado');
    } catch(e) { log('❌ Error renderKanban: ' + e.message); }
    
    try {
        renderActivityLog();
        log('✅ Activity Log iniciado');
    } catch(e) { log('❌ Error renderActivityLog: ' + e.message); }
    
    try {
        updateAgentCount();
        log('✅ Conteo de agentes actualizado');
    } catch(e) { log('❌ Error updateAgentCount: ' + e.message); }
    
    log('🎉 Dashboard LISTO!');
});

// ════════════════════════════════════════════════════════════════════
// CLOCK
// ════════════════════════════════════════════════════════════════════
function initClock() {
    setInterval(function() {
        var now = new Date();
        var clockEl = document.getElementById('clock');
        if (clockEl) {
            clockEl.textContent = now.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
            });
        }
    }, 1000);
}

function renderDate() {
    var dateEl = document.getElementById('date');
    if (dateEl) {
        var now = new Date();
        var options = { day: 'numeric', month: 'short' };
        dateEl.textContent = now.toLocaleDateString('es-ES', options);
    }
}

// ════════════════════════════════════════════════════════════════════
// AGENTS
// ════════════════════════════════════════════════════════════════════
function renderAgents() {
    var grid = document.getElementById('agents-grid');
    if (!grid) {
        log('❌ No encontre agents-grid');
        return;
    }
    
    log('📋 Renderizando ' + agents.length + ' agentes...');
    grid.innerHTML = '';
    agents.forEach(function(agent, index) {
        var card = document.createElement('div');
        card.className = 'agent-card ' + agent.status;
        card.onclick = function() { editAgent(index); };
        
        var statusText = agent.status === 'online' ? '● ONLINE' : '○ OFFLINE';
        
        card.innerHTML = 
            '<span class="agent-avatar">' + agent.avatar + '</span>' +
            '<div class="agent-name">' + agent.name + '</div>' +
            '<div class="agent-status ' + agent.status + '">' + statusText + '</div>' +
            '<div class="agent-specialty">' + agent.specialty + '</div>' +
            '<div class="agent-task">' + agent.task + '</div>' +
            '<div class="agent-progress">' + agent.progress + '%</div>';
        
        grid.appendChild(card);
    });
    log('✅ ' + agents.length + ' agentes renderizados');
}

function renderBusinesses() {
    var grid = document.getElementById('business-grid');
    if (!grid) {
        log('❌ No encontre business-grid');
        return;
    }
    
    grid.innerHTML = '';
    businesses.forEach(function(biz) {
        var card = document.createElement('div');
        card.className = 'business-card ' + (biz.status === 'active' ? 'active' : '');
        card.innerHTML = 
            '<div class="business-header">' +
                '<span class="business-icon">' + biz.icon + '</span>' +
                '<span class="business-name">' + biz.name + '</span>' +
            '</div>' +
            '<div class="business-stats">' +
                '<div class="stat"><span class="stat-value">' + biz.sales + '</span><span class="stat-label">Ventas</span></div>' +
                '<div class="stat"><span class="stat-value">' + biz.orders + '</span><span class="stat-label">Pedidos</span></div>' +
                '<div class="stat"><span class="stat-value">' + (biz.status === 'active' ? '🟢' : '⚪') + '</span><span class="stat-label">Estado</span></div>' +
            '</div>';
        grid.appendChild(card);
    });
    
    // Add business button
    var addBtn = document.createElement('div');
    addBtn.className = 'business-card';
    addBtn.onclick = function() { addNewBusiness(); };
    addBtn.innerHTML = '<div class="add-business-btn"><span class="plus-icon">+</span><span>Añadir Negocio</span></div>';
    grid.appendChild(addBtn);
    log('✅ Negocios renderizados');
}

function updateAgentCount() {
    var countEl = document.getElementById('agent-count');
    if (countEl) {
        var online = agents.filter(function(a) { return a.status === 'online'; }).length;
        countEl.textContent = online + '/' + agents.length;
    }
}

// ════════════════════════════════════════════════════════════════════
// AGENT ACTIONS
// ════════════════════════════════════════════════════════════════════
function addNewAgent() {
    log('➕ addNewAgent clicked');
    var modal = document.getElementById('agent-modal');
    if (modal) {
        modal.classList.add('show');
        document.getElementById('agent-name').value = '';
        document.getElementById('new-agent-avatar-preview').textContent = '🦞';
        log('✅ Modal agente abierto');
    } else {
        log('❌ Modal agente no encontrado');
    }
}

function closeAgentModal() {
    var m = document.getElementById('agent-modal');
    if (m) m.classList.remove('show');
}

function selectAgentEmoji(emoji, type) {
    var preview = type === 'new' ? document.getElementById('new-agent-avatar-preview') : document.getElementById('edit-agent-avatar-preview');
    if (preview) {
        preview.textContent = emoji;
        preview.dataset.emoji = emoji;
        preview.dataset.type = 'emoji';
    }
}

function handleAgentAvatarUpload(input, type) {
    var file = input.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var preview = type === 'new' ? document.getElementById('new-agent-avatar-preview') : document.getElementById('edit-agent-avatar-preview');
            if (preview) {
                preview.innerHTML = '<img src="' + e.target.result + '" style="width:50px;height:50px;border-radius:50%;">';
                preview.dataset.emoji = e.target.result;
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
    
    agents.push({
        id: agents.length + 1,
        name: name,
        avatar: avatar,
        status: 'offline',
        task: 'En espera',
        specialty: specialty,
        progress: 0
    });
    log('✅ Nuevo agente: ' + name);
    closeAgentModal();
    renderAgents();
    saveData();
}

function editAgent(id) {
    log('✏️ Editar agente: ' + id);
    var agent = agents.find(function(a) { return a.id === id; });
    if (agent) {
        document.getElementById('edit-agent-id').value = id;
        document.getElementById('edit-agent-name').value = agent.name;
        document.getElementById('edit-agent-specialty').value = agent.specialty;
        document.getElementById('edit-agent-status').value = agent.status;
        var preview = document.getElementById('edit-agent-avatar-preview');
        if (preview) {
            if (agent.avatar && agent.avatar.startsWith('data:image')) {
                preview.innerHTML = '<img src="' + agent.avatar + '" style="width:50px;height:50px;border-radius:50%;">';
                preview.dataset.type = 'image';
            } else {
                preview.textContent = agent.avatar || '🦞';
                preview.dataset.type = 'emoji';
            }
        }
        var modal = document.getElementById('edit-agent-modal');
        if (modal) modal.classList.add('show');
    }
}

function closeEditAgentModal() {
    var m = document.getElementById('edit-agent-modal');
    if (m) m.classList.remove('show');
}

function selectEditAgentEmoji(emoji) {
    var preview = document.getElementById('edit-agent-avatar-preview');
    if (preview) {
        preview.textContent = emoji;
        preview.dataset.emoji = emoji;
        preview.dataset.type = 'emoji';
    }
}

function previewEditAgentAvatar(input) {
    handleAgentAvatarUpload(input, 'edit');
}

function saveEditAgent() {
    var id = parseInt(document.getElementById('edit-agent-id').value);
    var agent = agents.find(function(a) { return a.id === id; });
    if (agent) {
        agent.name = document.getElementById('edit-agent-name').value;
        agent.specialty = document.getElementById('edit-agent-specialty').value;
        agent.status = document.getElementById('edit-agent-status').value;
        var preview = document.getElementById('edit-agent-avatar-preview');
        if (preview) {
            agent.avatar = preview.dataset.type === 'image' ? preview.dataset.emoji : preview.textContent;
        }
        log('💾 Guardado: ' + agent.name);
        closeEditAgentModal();
        renderAgents();
        saveData();
    }
}
    updateAgentCount();
    log('🛸 Nuevo agente: ' + avatar + ' ' + name);
    saveData();
}

function editAgent(index) {
    log('✏️ editAgent clicked para indice: ' + index);
    selectedAgentIndex = index;
    var agent = agents[index];
    
    var newName = prompt('Nombre:', agent.name);
    if (newName) agent.name = newName;
    
    var newTask = prompt('Tarea actual:', agent.task);
    if (newTask) agent.task = newTask;
    
    var newSpecialty = prompt('Especialidad:', agent.specialty);
    if (newSpecialty) agent.specialty = newSpecialty;
    
    var status = prompt('Estado (online/offline):', agent.status);
    if (status === 'online' || status === 'offline') agent.status = status;
    
    var progress = prompt('Progreso (%):', agent.progress);
    if (progress && !isNaN(progress)) agent.progress = parseInt(progress);
    
    renderAgents();
    updateAgentCount();
    log('✏️ Agente actualizado: ' + agent.name);
    saveData();
}

function addNewBusiness() {
    log('➕ addNewBusiness clicked');
    var name = prompt('Nombre del negocio:');
    if (!name) { log('❌ Cancelado'); return; }
    var icon = prompt('Icono (ej: 🛒, 📦, 💼):') || '📦';
    
    businesses.push({
        id: name.toLowerCase().replace(/\s/g, '-'),
        name: name,
        icon: icon,
        sales: '--',
        orders: 0,
        status: 'pending'
    });
    renderBusinesses();
    log('📦 Nuevo negocio: ' + name);
    saveData();
}

// ════════════════════════════════════════════════════════════════════
// AVATAR EDITOR
// ════════════════════════════════════════════════════════════════════
function openAvatarEditor() {
    log('🎨 openAvatarEditor clicked');
    var modal = document.getElementById('avatar-modal');
    if (!modal) {
        log('❌ No encontre avatar-modal');
        return;
    }
    modal.classList.add('show');
    log('✅ Modal abierto');
}

function closeModal() {
    log('❌ closeModal clicked');
    var modal = document.getElementById('avatar-modal');
    if (modal) {
        modal.classList.remove('show');
        log('✅ Modal cerrado');
    }
}

function selectAvatar(avatar) {
    log('👤 Avatar seleccionado: ' + avatar);
    selectedAvatar = avatar;
    var preview = document.getElementById('preview-avatar');
    var previewName = document.getElementById('preview-name');
    if (preview) preview.textContent = avatar;
    if (previewName) previewName.textContent = agents[selectedAgentIndex].name.toUpperCase();
}

function saveAvatar() {
    log('💾 Guardando avatar...');
    agents[selectedAgentIndex].avatar = selectedAvatar;
    renderAgents();
    log('🎨 Avatar guardado: ' + selectedAvatar + ' para ' + agents[selectedAgentIndex].name);
    saveData();
    closeModal();
}

// ════════════════════════════════════════════════════════════════
// KANBAN
// ════════════════════════════════════════════════════════════════════
function renderKanban() {
    var board = document.getElementById('kanban-board');
    if (!board) {
        log('❌ No encontre kanban-board');
        return;
    }
    
    log('📋 Renderizando Kanban...');
    board.innerHTML = '';
    
    var columns = [
        { id: 'pendiente', title: 'Pendiente', class: 'pendiente' },
        { id: 'asignado', title: 'Asignado', class: 'asignado' },
        { id: 'progreso', title: 'En Progreso', class: 'progreso' },
        { id: 'revision', title: 'Revisión', class: 'revision' },
        { id: 'testing', title: 'Testing', class: 'testing' },
        { id: 'terminado', title: 'Terminado', class: 'terminado' }
    ];
    
    columns.forEach(function(col) {
        var column = document.createElement('div');
        column.className = 'kanban-column';
        
        var taskCount = kanbanTasks[col.id] ? kanbanTasks[col.id].length : 0;
        
        column.innerHTML = 
            '<div class="kanban-column-header ' + col.class + '">' +
                '<span class="kanban-column-title ' + col.class + '">' + col.title + '</span>' +
                '<span class="kanban-column-count">' + taskCount + '</span>' +
            '</div>' +
            '<div class="kanban-tasks" id="kanban-' + col.id + '" ' +
                'ondrop="dropTask(event, \'' + col.id + '\')" ' +
                'ondragover="allowDrop(event)">' +
            '</div>';
        
        board.appendChild(column);
        
        var tasksContainer = column.querySelector('#kanban-' + col.id);
        if (kanbanTasks[col.id]) {
            kanbanTasks[col.id].forEach(function(task) {
                var taskEl = document.createElement('div');
                taskEl.className = 'kanban-task';
                taskEl.draggable = true;
                taskEl.ondragstart = function(e) { dragTask(e, task.id); };
                
                var typeIcon = task.type === 'mision' ? '💎' : task.type === 'tarea' ? '⚡' : task.type === 'bug' ? '🔧' : '📝';
                
                taskEl.innerHTML = 
                    '<div class="kanban-task-title">' + typeIcon + ' ' + task.title + '</div>' +
                    '<div class="kanban-task-meta">' +
                        '<span>' + task.agent + '</span>' +
                        '<span class="kanban-task-priority ' + task.priority + '">' + task.priority + '</span>' +
                    '</div>';
                
                tasksContainer.appendChild(taskEl);
            });
        }
    });
    
    log('✅ Kanban renderizado con ' + columns.length + ' columnas');
}

function addNewTask() {
    log('➕ addNewTask clicked');
    var modal = document.getElementById('task-modal');
    if (modal) {
        modal.classList.add('show');
        log('✅ Modal abierto');
    } else {
        log('❌ Modal no encontrado');
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}

function dragTask(ev, taskId) {
    log('📦 Drag started: ' + taskId);
    ev.dataTransfer.setData('taskId', taskId);
}

function dropTask(ev, targetColumn) {
    ev.preventDefault();
    var taskId = parseInt(ev.dataTransfer.getData('taskId'));
    log('📦 Drop en ' + targetColumn + ' tarea: ' + taskId);
    
    var allColumns = ['pendiente', 'asignado', 'progreso', 'revision', 'testing', 'terminado'];
    
    allColumns.forEach(function(colId) {
        if (kanbanTasks[colId]) {
            var taskIndex = -1;
            for (var i = 0; i < kanbanTasks[colId].length; i++) {
                if (kanbanTasks[colId][i].id === taskId) {
                    taskIndex = i;
                    break;
                }
            }
            if (taskIndex > -1) {
                var task = kanbanTasks[colId].splice(taskIndex, 1)[0];
                kanbanTasks[targetColumn].push(task);
            }
        }
    });
    
    renderKanban();
    log('✅ Tarea movida a: ' + targetColumn);
    saveData();
}

// ════════════════════════════════════════════════════════════════
// MISSION
// ════════════════════════════════════════════════════════════
function addNewMission() {
    log('🎯 addNewMission clicked');
    var name = prompt('Nombre de la misión:');
    if (!name) { log('❌ Cancelado'); return; }
    
    currentMission.name = name;
    currentMission.progress = 0;
    
    var progressEl = document.getElementById('mission-progress');
    if (progressEl) {
        progressEl.style.width = '0%';
        progressEl.textContent = '0%';
    }
    
    var nameEl = document.getElementById('current-mission');
    if (nameEl) nameEl.textContent = name;
    
    log('🎯 Nueva misión: ' + name);
}

function updateProgress() {
    log('📈 updateProgress clicked');
    var newProgress = prompt('Nuevo progreso (%):', currentMission.progress);
    if (!newProgress || isNaN(newProgress)) { log('❌ Cancelado o inválido'); return; }
    
    currentMission.progress = parseInt(newProgress);
    
    var progressEl = document.getElementById('mission-progress');
    if (progressEl) {
        progressEl.style.width = newProgress + '%';
        progressEl.textContent = newProgress + '%';
    }
    
    log('📈 Progreso: ' + currentMission.progress + '%');
    saveData();
}

function pauseMission() {
    log('⏸️ Misión pausada');
    alert('Misión pausada');
}

// ════════════════════════════════════════════════════════════════════
// POMODORO
// ════════════════════════════════════════════════════════════════
var pomodoroTime = 25 * 60;
var pomodoroInterval = null;
var pomodorosCompleted = 4;

function startPomodoro() {
    log('▶ startPomodoro clicked');
    if (pomodoroInterval) {
        log('⚠️ Ya está corriendo');
        return;
    }
    
    pomodoroInterval = setInterval(function() {
        pomodoroTime--;
        
        var minutes = Math.floor(pomodoroTime / 60);
        var seconds = pomodoroTime % 60;
        
        var timerEl = document.getElementById('pomodoro-timer');
        if (timerEl) {
            timerEl.innerHTML = '<span class="timer-minutes">' + String(minutes).padStart(2, '0') + '</span>:<span class="timer-seconds">' + String(seconds).padStart(2, '0') + '</span>';
        }
        
        if (pomodoroTime <= 0) {
            clearInterval(pomodoroInterval);
            pomodoroInterval = null;
            pomodorosCompleted++;
            log('⏱️ Pomodoro #' + pomodorosCompleted + ' completado!');
            alert('⏱️ Pomodoro completado!');
        }
    }, 1000);
    
    log('⏱️ Pomodoro iniciado');
}

function pausePomodoro() {
    log('⏸ pausePomodoro clicked');
    if (pomodoroInterval) {
        clearInterval(pomodoroInterval);
        pomodoroInterval = null;
        log('⏸️ Pomodoro pausado');
    } else {
        log('⚠️ No estaba corriendo');
    }
}

function resetPomodoro() {
    log('🔄 resetPomodoro clicked');
    pausePomodoro();
    pomodoroTime = 25 * 60;
    
    var timerEl = document.getElementById('pomodoro-timer');
    if (timerEl) {
        timerEl.innerHTML = '<span class="timer-minutes">25</span>:<span class="timer-seconds">00</span>';
    }
    
    log('🔄 Pomodoro reseteado');
}

// ════════════════════════════════════════════════════════════════════
// CALENDAR
// ════════════════════════════════════════════════════════════════════
function addNewEvent() {
    log('📅 addNewEvent clicked');
    var title = prompt('Título del evento:');
    if (!title) { log('❌ Cancelado'); return; }
    var fecha = prompt('Fecha (ej: 25 Abr):');
    
    log('📅 Nuevo evento: ' + title + ' (' + fecha + ')');
    alert('Evento añade!');
}

// ════════════════════════════════════════════════════════════════════
// FILES
// ════════════════════════════════════════════════════════════════
function addNewFile() {
    log('📁 addNewFile clicked');
    var nombre = prompt('Nombre del archivo:');
    if (!nombre) { log('❌ Cancelado'); return; }
    var tipo = prompt('Tipo (📄 doc, 🖼️ imagen):') || '📄';
    
    log('📁 Archivo añadido: ' + tipo + ' ' + nombre);
    alert('Archivo añadido!');
}

// ════════════════════════════════════════════════════════════════════
// ACTIVITY LOG
// ════════════════════════════════════════════════════════════════════
function renderActivityLog() {
    var logEl = document.getElementById('activity-log');
    if (!logEl) {
        console.log('❌ No encontre activity-log');
        return;
    }
    
    logEl.innerHTML = '';
    activityLog.slice(0, 15).forEach(function(item) {
        var div = document.createElement('div');
        div.className = 'activity-item';
        div.innerHTML = '<span class="time">' + item.time + '</span><span class="text">' + item.text + '</span>';
        logEl.appendChild(div);
    });
}

function addActivity(text) {
    var now = new Date();
    var time = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    activityLog.unshift({ time: time, text: text });
    if (activityLog.length > 30) activityLog = activityLog.slice(0, 30);
    renderActivityLog();
    log('📝 Activity: ' + text);
}

// ════════════════════════════════════════════════════════════════════
// NAVIGATION
// ════════════════════════════════════════════════════════════════════
function navTo(id) {
    log('🧭 Navegando a: ' + id);
    var el = document.getElementById(id);
    if (el) {
        el.scrollIntoView(true);
    } else {
        log('❌ No encontre: ' + id);
    }
}

function scrollTo(id) {
    navTo(id);
}

// ════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════
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
window.allowDrop = allowDrop;
window.dragTask = dragTask;
window.dropTask = dropTask;
window.navTo = navTo;
window.scrollTo = scrollTo;
window.startPomodoro = startPomodoro;
window.pausePomodoro = pausePomodoro;
window.resetPomodoro = resetPomodoro;
window.addNewEvent = addNewEvent;
window.addNewFile = addNewFile;
window.saveData = saveData;
// MODAL TASK FUNCTIONS
function closeTaskModal() {
    var m = document.getElementById('task-modal');
    if (m) m.classList.remove('show');
    var t = document.getElementById('task-title');
    var d = document.getElementById('task-desc');
    if (t) t.value = '';
    if (d) d.value = '';
}
function createTaskFromModal() {
    var title = document.getElementById('task-title').value;
    var desc = document.getElementById('task-desc').value;
    var project = document.getElementById('task-project').value;
    var status = document.getElementById('task-status').value;
    var priority = document.getElementById('task-priority').value;
    var agent = document.getElementById('task-agent').value;
    var type = document.getElementById('task-type').value;
    if (!title) { alert('Pon un titulo!'); return; }
    kanbanTasks[status].push({id: Date.now(), title: title, description: desc, project: project, priority: priority, type: type, agent: agent});
    log('Tarea: ' + title);
    closeTaskModal();
    renderKanban();
    saveData();
}
window.closeTaskModal = closeTaskModal;
window.createTaskFromModal = createTaskFromModal;
window.closeAgentModal = closeAgentModal;
window.createAgentFromModal = createAgentFromModal;
window.selectAgentEmoji = selectAgentEmoji;
window.handleAgentAvatarUpload = handleAgentAvatarUpload;
window.editAgent = editAgent;
window.closeEditAgentModal = closeEditAgentModal;
window.selectEditAgentEmoji = selectEditAgentEmoji;
window.previewEditAgentAvatar = previewEditAgentAvatar;
window.saveEditAgent = saveEditAgent;

/**
 * StudyFlow - Main Application Script
 */

// ==========================================================================
// STATE MANAGEMENT & LOCAL STORAGE
// ==========================================================================
const STORAGE_KEY = 'studyflow_data_v2';

const defaultState = {
    subjects: [
        { id: 'sub_daa',  name: 'Design Analysis of Algorithm', color: '#6366f1' },
        { id: 'sub_de',   name: 'Digital Electronics',          color: '#f59e0b' },
        { id: 'sub_dm',   name: 'Discrete Mathematics',         color: '#10b981' },
        { id: 'sub_ajp',  name: 'Advance Java Programming',     color: '#3b82f6' },
        { id: 'sub_oe',   name: 'Open Elective: OOPs with C++', color: '#ec4899' },
        { id: 'sub_apt',  name: 'Aptitude',                     color: '#8b5cf6' }
    ],
    tasks: [
        { id: 'task_1', title: 'Study Divide & Conquer algorithms',      subjectId: 'sub_daa', priority: 'high',   date: new Date().toISOString().split('T')[0], status: 'pending',   createdAt: new Date().toISOString() },
        { id: 'task_2', title: 'Practice Greedy algorithm problems',      subjectId: 'sub_daa', priority: 'medium', date: new Date().toISOString().split('T')[0], status: 'pending',   createdAt: new Date().toISOString() },
        { id: 'task_3', title: 'Revise Logic Gates & Boolean Algebra',   subjectId: 'sub_de',  priority: 'high',   date: new Date().toISOString().split('T')[0], status: 'pending',   createdAt: new Date().toISOString() },
        { id: 'task_4', title: 'Complete Combinational Circuits notes',   subjectId: 'sub_de',  priority: 'medium', date: new Date().toISOString().split('T')[0], status: 'completed', createdAt: new Date().toISOString() },
        { id: 'task_5', title: 'Solve 20 Graph Theory problems',          subjectId: 'sub_dm',  priority: 'high',   date: new Date().toISOString().split('T')[0], status: 'pending',   createdAt: new Date().toISOString() },
        { id: 'task_6', title: 'Build a JDBC mini project',              subjectId: 'sub_ajp', priority: 'medium', date: new Date().toISOString().split('T')[0], status: 'pending',   createdAt: new Date().toISOString() },
        { id: 'task_7', title: 'Practice Inheritance & Polymorphism',     subjectId: 'sub_oe',  priority: 'low',    date: new Date().toISOString().split('T')[0], status: 'completed', createdAt: new Date().toISOString() },
        { id: 'task_8', title: 'Solve 30 Quantitative Aptitude questions',subjectId: 'sub_apt', priority: 'medium', date: new Date().toISOString().split('T')[0], status: 'pending',   createdAt: new Date().toISOString() }
    ],
    schedule: [
        { id: 'sch_1', subjectId: 'sub_daa', day: 'Monday',    startTime: '09:00', endTime: '10:00', topic: 'Divide & Conquer' },
        { id: 'sch_2', subjectId: 'sub_de',  day: 'Monday',    startTime: '10:30', endTime: '11:30', topic: 'Combinational Circuits' },
        { id: 'sch_3', subjectId: 'sub_dm',  day: 'Monday',    startTime: '14:00', endTime: '15:00', topic: 'Graph Theory' },
        { id: 'sch_4', subjectId: 'sub_ajp', day: 'Tuesday',   startTime: '09:00', endTime: '10:30', topic: 'Collections Framework' },
        { id: 'sch_5', subjectId: 'sub_oe',  day: 'Tuesday',   startTime: '11:00', endTime: '12:00', topic: 'Inheritance & Polymorphism' },
        { id: 'sch_6', subjectId: 'sub_apt', day: 'Tuesday',   startTime: '15:00', endTime: '16:00', topic: 'Speed Maths Practice' },
        { id: 'sch_7', subjectId: 'sub_daa', day: 'Wednesday', startTime: '09:00', endTime: '10:00', topic: 'Dynamic Programming' },
        { id: 'sch_8', subjectId: 'sub_de',  day: 'Wednesday', startTime: '10:30', endTime: '11:30', topic: 'Sequential Circuits' },
        { id: 'sch_9', subjectId: 'sub_dm',  day: 'Thursday',  startTime: '09:00', endTime: '10:00', topic: 'Sets & Relations' },
        { id: 'sch_10',subjectId: 'sub_ajp', day: 'Thursday',  startTime: '11:00', endTime: '12:30', topic: 'Multithreading in Java' },
        { id: 'sch_11',subjectId: 'sub_oe',  day: 'Friday',    startTime: '09:00', endTime: '10:00', topic: 'Templates & STL' },
        { id: 'sch_12',subjectId: 'sub_apt', day: 'Friday',    startTime: '15:00', endTime: '16:30', topic: 'Logical Reasoning' },
        { id: 'sch_13',subjectId: 'sub_daa', day: 'Saturday',  startTime: '10:00', endTime: '12:00', topic: 'Previous Year Questions' },
        { id: 'sch_14',subjectId: 'sub_apt', day: 'Sunday',    startTime: '10:00', endTime: '11:30', topic: 'Mock Test' }
    ],
    pomodoroSessions: 0,
    settings: {
        theme: 'light',
        notifications: true
    }
};

let appState = { ...defaultState };

function loadData() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        try {
            appState = { ...defaultState, ...JSON.parse(data) };
            // Ensure nested objects are merged correctly if new settings are added
            appState.settings = { ...defaultState.settings, ...JSON.parse(data).settings };
        } catch (e) {
            console.error('Error parsing localStorage data', e);
        }
    }
    applyTheme(appState.settings.theme);
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function clearAllData() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        appState = { ...defaultState };
        appState.tasks = [];
        appState.subjects = [];
        appState.schedule = [];
        appState.pomodoroSessions = 0;
        saveData();
        renderAll();
        showToast('All data cleared successfully', 'success');
    }
}

// ==========================================================================
// UTILS
// ==========================================================================
function generateId(prefix = 'id') {
    return prefix + '_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

function getSubjectById(id) {
    return appState.subjects.find(s => s.id === id);
}

function formatDate(dateString) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = '';
    if (type === 'success') icon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
    else if (type === 'error') icon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
    
    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ==========================================================================
// UI NAVIGATION & LAYOUT
// ==========================================================================
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const pages = document.querySelectorAll('.page');
    const headerTitle = document.getElementById('headerTitle');
    const sidebar = document.getElementById('sidebar');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            navigateTo(targetId);
            
            // Close mobile sidebar if open
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });

    // Mobile menu toggle
    document.getElementById('mobileMenuBtn').addEventListener('click', () => {
        sidebar.classList.add('open');
    });

    document.getElementById('mobileCloseBtn').addEventListener('click', () => {
        sidebar.classList.remove('open');
    });
}

function navigateTo(pageId) {
    const navLinks = document.querySelectorAll('.nav-links a');
    const pages = document.querySelectorAll('.page');
    const headerTitle = document.getElementById('headerTitle');

    // Update active link
    navLinks.forEach(l => l.classList.remove('active'));
    const activeLink = document.querySelector(`.nav-links a[data-target="${pageId}"]`);
    if(activeLink) activeLink.classList.add('active');

    // Update title
    headerTitle.textContent = activeLink ? activeLink.textContent.trim() : 'Dashboard';

    // Show active page
    pages.forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    // Re-render specific page if needed
    if (pageId === 'dashboard') renderDashboard();
    if (pageId === 'progress') renderProgress();
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        document.getElementById('themeToggle').checked = true;
    } else {
        document.body.removeAttribute('data-theme');
        document.getElementById('themeToggle').checked = false;
    }
}

// ==========================================================================
// MODALS
// ==========================================================================
function initModals() {
    const modals = document.querySelectorAll('.modal-overlay');
    const closeBtns = document.querySelectorAll('.close-modal, .cancel-modal');

    closeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modals.forEach(m => m.classList.remove('active'));
        });
    });

    // Close on click outside
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Open Modals
    document.getElementById('headerAddBtn').addEventListener('click', openTaskModal);
    document.getElementById('openTaskModalBtn').addEventListener('click', openTaskModal);
    document.getElementById('openSubjectModalBtn').addEventListener('click', openSubjectModal);
    document.getElementById('openScheduleModalBtn').addEventListener('click', openScheduleModal);
}

function openTaskModal(task = null) {
    updateSubjectSelects();
    const modal = document.getElementById('taskModal');
    const form = document.getElementById('taskForm');
    
    if (task && task.id) {
        document.getElementById('taskModalTitle').textContent = 'Edit Task';
        document.getElementById('taskId').value = task.id;
        document.getElementById('taskTitle').value = task.title;
        const subject = getSubjectById(task.subjectId);
        document.getElementById('taskSubject').value = subject ? subject.name : '';
        document.getElementById('taskPriority').value = task.priority;
        document.getElementById('taskDate').value = task.date;
    } else {
        document.getElementById('taskModalTitle').textContent = 'Add New Task';
        form.reset();
        document.getElementById('taskId').value = '';
        document.getElementById('taskDate').value = new Date().toISOString().split('T')[0];
    }
    
    modal.classList.add('active');
}

function openSubjectModal(subject = null) {
    const modal = document.getElementById('subjectModal');
    const form = document.getElementById('subjectForm');
    
    if (subject && subject.id) {
        document.getElementById('subjectModalTitle').textContent = 'Edit Subject';
        document.getElementById('subjectId').value = subject.id;
        document.getElementById('subjectName').value = subject.name;
        document.getElementById('subjectColor').value = subject.color;
        
        // Update color picker UI
        document.querySelectorAll('#subjectColorPicker .color-option').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.color === subject.color);
        });
    } else {
        document.getElementById('subjectModalTitle').textContent = 'Add Subject';
        form.reset();
        document.getElementById('subjectId').value = '';
        
        // Default color
        const firstColor = document.querySelector('#subjectColorPicker .color-option');
        if (firstColor) {
            document.querySelectorAll('#subjectColorPicker .color-option').forEach(o => o.classList.remove('active'));
            firstColor.classList.add('active');
            document.getElementById('subjectColor').value = firstColor.dataset.color;
        }
    }
    
    modal.classList.add('active');
}

function setCustomTime(prefix, time24) {
    // time24 is "HH:MM" in 24h format
    if (!time24) return;
    let [h, m] = time24.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    const hStr = String(h).padStart(2, '0');
    // round minutes to nearest 15
    const mins = [0, 15, 30, 45];
    const mRounded = mins.reduce((prev, cur) => Math.abs(cur - m) < Math.abs(prev - m) ? cur : prev);
    const mStr = String(mRounded).padStart(2, '0');
    document.getElementById(prefix + 'Hour').value = hStr;
    document.getElementById(prefix + 'Min').value = mStr;
    document.getElementById(prefix + 'Period').value = period;
}

function getCustomTime(prefix) {
    const h = document.getElementById(prefix + 'Hour').value;
    const m = document.getElementById(prefix + 'Min').value;
    const period = document.getElementById(prefix + 'Period').value;
    if (!h || !m) return '';
    let hour24 = parseInt(h);
    if (period === 'PM' && hour24 !== 12) hour24 += 12;
    if (period === 'AM' && hour24 === 12) hour24 = 0;
    return String(hour24).padStart(2, '0') + ':' + m;
}

function openScheduleModal(scheduleItem = null) {
    updateSubjectSelects();
    const modal = document.getElementById('scheduleModal');
    const form = document.getElementById('scheduleForm');
    
    if (scheduleItem && scheduleItem.id) {
        document.getElementById('scheduleModalTitle').textContent = 'Edit Schedule';
        document.getElementById('scheduleId').value = scheduleItem.id;
        const subject = getSubjectById(scheduleItem.subjectId);
        document.getElementById('scheduleSubject').value = subject ? subject.name : '';
        document.getElementById('scheduleDay').value = scheduleItem.day;
        setCustomTime('scheduleStart', scheduleItem.startTime);
        setCustomTime('scheduleEnd', scheduleItem.endTime);
        document.getElementById('scheduleTopic').value = scheduleItem.topic || '';
    } else {
        document.getElementById('scheduleModalTitle').textContent = 'Add Schedule Item';
        form.reset();
        document.getElementById('scheduleId').value = '';
        // Reset custom time pickers
        ['scheduleStartHour','scheduleStartMin','scheduleEndHour','scheduleEndMin'].forEach(id => {
            document.getElementById(id).value = '';
        });
        // Use active day tab as default
        const activeDayBtn = document.querySelector('#scheduleDaysNav .active');
        if (activeDayBtn) {
            document.getElementById('scheduleDay').value = activeDayBtn.dataset.day;
        }
    }
    
    modal.classList.add('active');
}

// ==========================================================================
// TASKS LOGIC
// ==========================================================================
function initTasks() {
    const taskForm = document.getElementById('taskForm');
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const id = document.getElementById('taskId').value;
        const title = document.getElementById('taskTitle').value.trim();
        const subjectName = document.getElementById('taskSubject').value.trim();
        const priority = document.getElementById('taskPriority').value;
        const date = document.getElementById('taskDate').value;
        
        if (!title || !subjectName || !date) return;
        
        let subject = appState.subjects.find(s => s.name.toLowerCase() === subjectName.toLowerCase());
        if (!subject) {
            const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'];
            subject = {
                id: generateId('sub'),
                name: subjectName,
                color: colors[Math.floor(Math.random() * colors.length)]
            };
            appState.subjects.push(subject);
            renderSubjects();
            updateSubjectSelects();
        }
        const subjectId = subject.id;
        
        if (id) {
            // Edit
            const taskIndex = appState.tasks.findIndex(t => t.id === id);
            if (taskIndex !== -1) {
                appState.tasks[taskIndex] = { ...appState.tasks[taskIndex], title, subjectId, priority, date };
                showToast('Task updated successfully', 'success');
            }
        } else {
            // Add
            appState.tasks.push({
                id: generateId('task'),
                title,
                subjectId,
                priority,
                date,
                status: 'pending',
                createdAt: new Date().toISOString()
            });
            showToast('Task added successfully', 'success');
        }
        
        saveData();
        renderTasks();
        renderDashboard();
        document.getElementById('taskModal').classList.remove('active');
    });

    document.getElementById('taskSearchInput').addEventListener('input', renderTasks);
    document.getElementById('taskFilterStatus').addEventListener('change', renderTasks);
    document.getElementById('taskFilterSubject').addEventListener('change', renderTasks);
}

function toggleTaskStatus(id) {
    const task = appState.tasks.find(t => t.id === id);
    if (task) {
        task.status = task.status === 'pending' ? 'completed' : 'pending';
        saveData();
        renderTasks();
        renderDashboard();
        
        if (task.status === 'completed') {
            showToast('Task marked as completed! 🎉', 'success');
        }
    }
}

function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        appState.tasks = appState.tasks.filter(t => t.id !== id);
        saveData();
        renderTasks();
        renderDashboard();
        showToast('Task deleted', 'success');
    }
}

function editTaskBtnClick(id) {
    const task = appState.tasks.find(t => t.id === id);
    if (task) openTaskModal(task);
}

function createTaskHTML(task) {
    const subject = getSubjectById(task.subjectId) || { name: 'Unknown', color: '#ccc' };
    const isCompleted = task.status === 'completed';
    const dateFormatted = formatDate(task.date);
    
    return `
        <div class="task-item ${isCompleted ? 'completed' : ''}">
            <input type="checkbox" class="task-checkbox" onchange="toggleTaskStatus('${task.id}')" ${isCompleted ? 'checked' : ''}>
            <div class="task-content">
                <div class="task-title">${task.title}</div>
                <div class="task-meta">
                    <span class="subject-badge">
                        <span class="subject-dot" style="background-color: ${subject.color}"></span>
                        ${subject.name}
                    </span>
                    <span class="task-badge badge-${task.priority}">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
                    <span style="color: var(--text-secondary)">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 2px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        ${dateFormatted}
                    </span>
                </div>
            </div>
            <div class="task-actions">
                <button class="btn-icon" onclick="editTaskBtnClick('${task.id}')" title="Edit">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                </button>
                <button class="btn-icon danger" onclick="deleteTask('${task.id}')" title="Delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
            </div>
        </div>
    `;
}

function renderTasks() {
    const pendingList = document.getElementById('pendingTaskList');
    const completedList = document.getElementById('completedTaskList');
    const searchInput = document.getElementById('taskSearchInput').value.toLowerCase();
    const statusFilter = document.getElementById('taskFilterStatus').value;
    const subjectFilter = document.getElementById('taskFilterSubject').value;
    
    let filteredTasks = appState.tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchInput);
        const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
        const matchesSubject = subjectFilter === 'all' || task.subjectId === subjectFilter;
        return matchesSearch && matchesStatus && matchesSubject;
    });

    // Sort by date then priority
    filteredTasks.sort((a, b) => {
        if (a.date !== b.date) return new Date(a.date) - new Date(b.date);
        const prioMap = { high: 3, medium: 2, low: 1 };
        return prioMap[b.priority] - prioMap[a.priority];
    });

    const pendingTasks = filteredTasks.filter(t => t.status === 'pending');
    const completedTasks = filteredTasks.filter(t => t.status === 'completed');

    if (pendingTasks.length === 0) {
        pendingList.innerHTML = `<div class="empty-state"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><p>No pending tasks found.</p></div>`;
    } else {
        pendingList.innerHTML = pendingTasks.map(createTaskHTML).join('');
    }

    if (completedTasks.length === 0) {
        completedList.innerHTML = `<div class="empty-state"><p>No completed tasks.</p></div>`;
    } else {
        completedList.innerHTML = completedTasks.map(createTaskHTML).join('');
    }
}

// ==========================================================================
// SUBJECTS LOGIC
// ==========================================================================
function initSubjects() {
    // Color picker
    document.querySelectorAll('.color-option').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            document.getElementById('subjectColor').value = opt.dataset.color;
        });
    });

    // Form submit
    document.getElementById('subjectForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const id = document.getElementById('subjectId').value;
        const name = document.getElementById('subjectName').value.trim();
        const color = document.getElementById('subjectColor').value;
        
        if (!name) return;
        
        if (id) {
            const index = appState.subjects.findIndex(s => s.id === id);
            if (index !== -1) {
                appState.subjects[index] = { id, name, color };
                showToast('Subject updated successfully', 'success');
            }
        } else {
            appState.subjects.push({ id: generateId('sub'), name, color });
            showToast('Subject added successfully', 'success');
        }
        
        saveData();
        renderSubjects();
        updateSubjectSelects();
        renderTasks(); // To update colors in existing tasks
        renderSchedule();
        document.getElementById('subjectModal').classList.remove('active');
    });
}

function deleteSubject(id) {
    // Check if used in tasks or schedule
    const usedInTasks = appState.tasks.some(t => t.subjectId === id);
    const usedInSchedule = appState.schedule.some(s => s.subjectId === id);
    
    if (usedInTasks || usedInSchedule) {
        alert('Cannot delete this subject because it is used in tasks or your schedule. Please delete or reassign them first.');
        return;
    }
    
    if (confirm('Are you sure you want to delete this subject?')) {
        appState.subjects = appState.subjects.filter(s => s.id !== id);
        saveData();
        renderSubjects();
        updateSubjectSelects();
        showToast('Subject deleted', 'success');
    }
}

function editSubjectBtnClick(id) {
    const subject = getSubjectById(id);
    if (subject) openSubjectModal(subject);
}

function updateSubjectSelects() {
    const filterSelect = document.getElementById('taskFilterSubject');
    if (filterSelect) {
        const currentValue = filterSelect.value;
        let html = '<option value="all">All Subjects</option>';
        html += appState.subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
        filterSelect.innerHTML = html;
        if (currentValue && (appState.subjects.find(s => s.id === currentValue) || currentValue === 'all')) {
            filterSelect.value = currentValue;
        }
    }
    
    const datalists = [
        document.getElementById('taskSubjectList'),
        document.getElementById('scheduleSubjectList')
    ];
    const optionsHtml = appState.subjects.map(s => `<option value="${s.name}"></option>`).join('');
    datalists.forEach(dl => {
        if (dl) dl.innerHTML = optionsHtml;
    });
}

function renderSubjects() {
    const grid = document.getElementById('subjectsGrid');
    
    if (appState.subjects.length === 0) {
        grid.innerHTML = `<div class="empty-state" style="grid-column: 1/-1"><p>No subjects added yet. Create one to get started!</p></div>`;
        return;
    }
    
    grid.innerHTML = appState.subjects.map(subject => {
        const taskCount = appState.tasks.filter(t => t.subjectId === subject.id && t.status === 'pending').length;
        
        return `
            <div class="subject-card" style="--subject-color: ${subject.color}">
                <div class="subject-header">
                    <h3 class="subject-title">${subject.name}</h3>
                    <div style="display: flex; gap: 0.25rem;">
                        <button class="btn-icon" onclick="editSubjectBtnClick('${subject.id}')" title="Edit">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                        </button>
                        <button class="btn-icon danger" onclick="deleteSubject('${subject.id}')" title="Delete">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                    </div>
                </div>
                <div style="margin-top: auto;">
                    <p style="color: var(--text-secondary); font-size: 0.875rem;">
                        ${taskCount} pending task${taskCount !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>
        `;
    }).join('');
}

// ==========================================================================
// SCHEDULE LOGIC
// ==========================================================================
let currentScheduleDay = 'Monday';

function initSchedule() {
    // Day navigation
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentScheduleDay = btn.dataset.day;
            renderSchedule();
        });
    });

    // Form submit
    document.getElementById('scheduleForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const id = document.getElementById('scheduleId').value;
        const subjectName = document.getElementById('scheduleSubject').value.trim();
        const day = document.getElementById('scheduleDay').value;
        const startTime = getCustomTime('scheduleStart');
        const endTime = getCustomTime('scheduleEnd');
        const topic = document.getElementById('scheduleTopic').value.trim();
        
        if (!subjectName) { showToast('Please enter a subject', 'error'); return; }
        if (!startTime) { showToast('Please set a Start Time', 'error'); return; }
        if (!endTime) { showToast('Please set an End Time', 'error'); return; }
        
        let subject = appState.subjects.find(s => s.name.toLowerCase() === subjectName.toLowerCase());
        if (!subject) {
            const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'];
            subject = {
                id: generateId('sub'),
                name: subjectName,
                color: colors[Math.floor(Math.random() * colors.length)]
            };
            appState.subjects.push(subject);
            renderSubjects();
            updateSubjectSelects();
        }
        const subjectId = subject.id;
        
        if (startTime >= endTime) {
            showToast('End time must be after start time', 'error');
            return;
        }
        
        if (id) {
            const index = appState.schedule.findIndex(s => s.id === id);
            if (index !== -1) {
                appState.schedule[index] = { id, subjectId, day, startTime, endTime, topic };
                showToast('Schedule updated successfully', 'success');
            }
        } else {
            appState.schedule.push({ id: generateId('sch'), subjectId, day, startTime, endTime, topic });
            showToast('Added to schedule', 'success');
        }
        
        saveData();
        
        // Switch to the day that was just edited/added
        document.querySelectorAll('.day-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.day === day);
        });
        currentScheduleDay = day;
        
        renderSchedule();
        renderDashboard();
        document.getElementById('scheduleModal').classList.remove('active');
    });
}

function deleteScheduleItem(id) {
    if (confirm('Remove this item from schedule?')) {
        appState.schedule = appState.schedule.filter(s => s.id !== id);
        saveData();
        renderSchedule();
        renderDashboard();
        showToast('Schedule item removed', 'success');
    }
}

function editScheduleBtnClick(id) {
    const item = appState.schedule.find(s => s.id === id);
    if (item) openScheduleModal(item);
}

function renderSchedule() {
    const timeline = document.getElementById('scheduleTimeline');
    
    const daySchedule = appState.schedule
        .filter(s => s.day === currentScheduleDay)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
        
    if (daySchedule.length === 0) {
        timeline.innerHTML = `<div class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <p>No classes or study sessions scheduled for ${currentScheduleDay}.</p>
        </div>`;
        return;
    }
    
    timeline.innerHTML = daySchedule.map(item => {
        const subject = getSubjectById(item.subjectId) || { name: 'Unknown', color: '#ccc' };
        
        // Format time nicely
        const formatTimeStr = (timeStr) => {
            let [h, m] = timeStr.split(':');
            const ampm = h >= 12 ? 'PM' : 'AM';
            h = h % 12;
            h = h ? h : 12;
            return `${h}:${m} ${ampm}`;
        };
        
        return `
            <div class="schedule-item">
                <div class="schedule-time">
                    <span>${formatTimeStr(item.startTime)}</span>
                    <span style="font-size: 0.75rem; color: var(--border-color)">to</span>
                    <span>${formatTimeStr(item.endTime)}</span>
                </div>
                <div class="schedule-card" style="--subject-color: ${subject.color}">
                    <div class="schedule-info">
                        <h4>${subject.name}</h4>
                        ${item.topic ? `<p>${item.topic}</p>` : ''}
                    </div>
                    <div class="task-actions" style="opacity: 1;">
                        <button class="btn-icon" onclick="editScheduleBtnClick('${item.id}')">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                        </button>
                        <button class="btn-icon danger" onclick="deleteScheduleItem('${item.id}')">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ==========================================================================
// POMODORO LOGIC
// ==========================================================================
let pomodoroTimer = null;
let pomodoroTimeLeft = 25 * 60; // default 25 min in seconds
let pomodoroMode = 'study'; // 'study', 'shortBreak', 'longBreak'
let isPomodoroRunning = false;
let totalTimeForMode = 25 * 60;

const modes = {
    study: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
};

function initPomodoro() {
    const tabs = document.querySelectorAll('.pomo-tab');
    const startBtn = document.getElementById('startTimerBtn');
    const resetBtn = document.getElementById('resetTimerBtn');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (isPomodoroRunning) {
                if(!confirm('Timer is running. Are you sure you want to switch?')) return;
            }
            
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            pomodoroMode = tab.dataset.mode;
            totalTimeForMode = modes[pomodoroMode];
            resetPomodoro();
        });
    });
    
    startBtn.addEventListener('click', () => {
        if (isPomodoroRunning) {
            pausePomodoro();
        } else {
            startPomodoro();
        }
    });
    
    resetBtn.addEventListener('click', resetPomodoro);
    
    updatePomodoroDisplay();
    document.getElementById('pomoSessionCount').textContent = appState.pomodoroSessions;
}

function startPomodoro() {
    isPomodoroRunning = true;
    document.getElementById('startTimerBtn').textContent = 'Pause';
    document.getElementById('startTimerBtn').classList.replace('btn-primary', 'btn-outline');
    
    pomodoroTimer = setInterval(() => {
        pomodoroTimeLeft--;
        updatePomodoroDisplay();
        
        if (pomodoroTimeLeft <= 0) {
            pomodoroFinished();
        }
    }, 1000);
}

function pausePomodoro() {
    isPomodoroRunning = false;
    clearInterval(pomodoroTimer);
    document.getElementById('startTimerBtn').textContent = 'Resume';
    document.getElementById('startTimerBtn').classList.replace('btn-outline', 'btn-primary');
}

function resetPomodoro() {
    pausePomodoro();
    pomodoroTimeLeft = totalTimeForMode;
    document.getElementById('startTimerBtn').textContent = 'Start';
    updatePomodoroDisplay();
}

function pomodoroFinished() {
    pausePomodoro();
    
    if (appState.settings.notifications && Notification.permission === "granted") {
        new Notification("StudyFlow Timer", {
            body: pomodoroMode === 'study' ? "Study session complete! Take a break." : "Break is over. Back to studying!"
        });
    } else {
        alert(pomodoroMode === 'study' ? "Study session complete! Take a break." : "Break is over. Back to studying!");
    }
    
    if (pomodoroMode === 'study') {
        appState.pomodoroSessions++;
        saveData();
        document.getElementById('pomoSessionCount').textContent = appState.pomodoroSessions;
        renderDashboard(); // Update stats
    }
    
    resetPomodoro();
}

function updatePomodoroDisplay() {
    const minutes = Math.floor(pomodoroTimeLeft / 60);
    const seconds = pomodoroTimeLeft % 60;
    
    const displayStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('timerDisplay').textContent = displayStr;
    
    // Update circle progress
    const circle = document.getElementById('timerProgress');
    const circumference = 2 * Math.PI * 140; // r=140
    
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    
    const percent = pomodoroTimeLeft / totalTimeForMode;
    const offset = circumference - percent * circumference;
    circle.style.strokeDashoffset = offset;
    
    // Change color based on mode
    let color = 'var(--primary-color)';
    if (pomodoroMode === 'shortBreak') color = 'var(--success-color)';
    if (pomodoroMode === 'longBreak') color = 'var(--purple-color)';
    circle.style.stroke = color;
}

// ==========================================================================
// DASHBOARD LOGIC
// ==========================================================================
function renderDashboard() {
    // Current Date
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDateDisplay').textContent = new Date().toLocaleDateString(undefined, dateOptions);
    
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Stats
    const todayTasks = appState.tasks.filter(t => t.date === todayStr);
    const completedToday = todayTasks.filter(t => t.status === 'completed').length;
    
    document.getElementById('statTodayTasks').textContent = todayTasks.length;
    document.getElementById('statCompletedTasks').textContent = completedToday;
    document.getElementById('statPomodoroSessions').textContent = appState.pomodoroSessions;
    
    const progressPercent = todayTasks.length > 0 ? Math.round((completedToday / todayTasks.length) * 100) : 0;
    document.getElementById('statProgressPercent').textContent = `${progressPercent}%`;
    
    // Recent Tasks
    const dashboardTaskList = document.getElementById('dashboardTaskList');
    const pendingRecent = appState.tasks
        .filter(t => t.status === 'pending')
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 4);
        
    if (pendingRecent.length === 0) {
        dashboardTaskList.innerHTML = `<div class="empty-state" style="padding: 1rem;"><p>All caught up!</p></div>`;
    } else {
        dashboardTaskList.innerHTML = pendingRecent.map(createTaskHTML).join('');
    }
    
    // Today's Schedule
    const dashboardScheduleList = document.getElementById('dashboardScheduleList');
    const todayDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    
    const todaySchedule = appState.schedule
        .filter(s => s.day === todayDayName)
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
        .slice(0, 4);
        
    if (todaySchedule.length === 0) {
        dashboardScheduleList.innerHTML = `<div class="empty-state" style="padding: 1rem;"><p>No schedule for today.</p></div>`;
    } else {
        dashboardScheduleList.innerHTML = todaySchedule.map(item => {
            const subject = getSubjectById(item.subjectId) || { name: 'Unknown', color: '#ccc' };
            const formatTimeStr = (timeStr) => {
                let [h, m] = timeStr.split(':');
                const ampm = h >= 12 ? 'PM' : 'AM';
                h = h % 12 || 12;
                return `${h}:${m} ${ampm}`;
            };
            
            return `
                <div class="schedule-card" style="--subject-color: ${subject.color}; margin-bottom: 0;">
                    <div class="schedule-info">
                        <h4>${subject.name}</h4>
                        <p>${formatTimeStr(item.startTime)} - ${formatTimeStr(item.endTime)}</p>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// ==========================================================================
// PROGRESS LOGIC
// ==========================================================================
function renderProgress() {
    const totalTasks = appState.tasks.length;
    const completedTasks = appState.tasks.filter(t => t.status === 'completed').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    document.getElementById('progTotalCompleted').textContent = completedTasks;
    document.getElementById('progCompletionRate').textContent = `${completionRate}%`;
    document.getElementById('progCompletionBar').style.width = `${completionRate}%`;
    
    // Focus time (approximate based on pomodoro sessions)
    const totalMinutes = appState.pomodoroSessions * 25;
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    
    document.getElementById('progFocusTime').innerHTML = `${hours}<span class="unit">h</span> ${mins}<span class="unit">m</span>`;
    
    // Subject Progress
    const subjectProgressList = document.getElementById('subjectProgressList');
    
    if (appState.subjects.length === 0) {
        subjectProgressList.innerHTML = `<div class="empty-state"><p>No subjects to track yet.</p></div>`;
        return;
    }
    
    const subjectStats = appState.subjects.map(subject => {
        const subTasks = appState.tasks.filter(t => t.subjectId === subject.id);
        const subCompleted = subTasks.filter(t => t.status === 'completed').length;
        const subPercent = subTasks.length > 0 ? Math.round((subCompleted / subTasks.length) * 100) : 0;
        
        return `
            <div class="subject-progress-item">
                <div class="subject-progress-header">
                    <span>${subject.name}</span>
                    <span>${subCompleted}/${subTasks.length} (${subPercent}%)</span>
                </div>
                <div class="subject-progress-bar">
                    <div class="subject-progress-fill" style="width: ${subPercent}%; background-color: ${subject.color}"></div>
                </div>
            </div>
        `;
    }).join('');
    
    subjectProgressList.innerHTML = subjectStats;
}

// ==========================================================================
// SETTINGS LOGIC
// ==========================================================================
function initSettings() {
    const themeToggle = document.getElementById('themeToggle');
    const notifToggle = document.getElementById('notificationToggle');
    const clearBtn = document.getElementById('clearDataBtn');
    
    themeToggle.checked = appState.settings.theme === 'dark';
    notifToggle.checked = appState.settings.notifications;
    
    themeToggle.addEventListener('change', (e) => {
        const theme = e.target.checked ? 'dark' : 'light';
        appState.settings.theme = theme;
        applyTheme(theme);
        saveData();
    });
    
    notifToggle.addEventListener('change', (e) => {
        appState.settings.notifications = e.target.checked;
        saveData();
        
        if (e.target.checked && "Notification" in window) {
            Notification.requestPermission();
        }
    });
    
    clearBtn.addEventListener('click', clearAllData);
    
    // Request notification permission on first load if enabled
    if (appState.settings.notifications && "Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission();
    }
}

// ==========================================================================
// INITIALIZATION
// ==========================================================================
function renderAll() {
    updateSubjectSelects();
    renderDashboard();
    renderTasks();
    renderSubjects();
    renderSchedule();
    renderProgress();
}

function initApp() {
    loadData();
    initNavigation();
    initModals();
    initTasks();
    initSubjects();
    initSchedule();
    initPomodoro();
    initSettings();
    
    renderAll();
    
    // Auto-update dashboard time/date if left open
    setInterval(() => {
        if (document.getElementById('dashboard').classList.contains('active')) {
            renderDashboard();
        }
    }, 60000); // every minute
}

// Start App
document.addEventListener('DOMContentLoaded', initApp);

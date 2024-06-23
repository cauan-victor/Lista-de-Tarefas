document.addEventListener('DOMContentLoaded', loadTasks);

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const completedTaskList = document.getElementById('completed-task-list');
const clearAllBtn = document.getElementById('clear-all-btn');

taskForm.addEventListener('submit', addTask);
clearAllBtn.addEventListener('click', clearAllTasks);

function addTask(e) {
    e.preventDefault();

    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const taskItem = createTaskItem(taskText);
    taskList.appendChild(taskItem);
    saveTask(taskText, false);

    taskInput.value = '';
}

function createTaskItem(taskText, isCompleted = false) {
    const li = document.createElement('li');
    li.textContent = taskText;

    const taskActions = document.createElement('div');
    taskActions.classList.add('task-actions');

    if (!isCompleted) {
        const completeButton = document.createElement('button');
        completeButton.classList.add('complete');
        completeButton.textContent = 'Concluir';
        completeButton.onclick = () => completeTask(li);

        const editButton = document.createElement('button');
        editButton.classList.add('edit');
        editButton.textContent = 'Editar';
        editButton.onclick = () => editTask(li);

        taskActions.appendChild(completeButton);
        taskActions.appendChild(editButton);
    }

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete');
    deleteButton.textContent = 'Excluir';
    deleteButton.onclick = () => deleteTask(li);

    taskActions.appendChild(deleteButton);

    li.appendChild(taskActions);

    if (isCompleted) {
        li.classList.add('completed');
        completedTaskList.appendChild(li);
    }

    return li;
}

function completeTask(taskItem) {
    taskItem.classList.add('completed');
    completedTaskList.appendChild(taskItem);
    taskItem.querySelector('.complete').remove();
    taskItem.querySelector('.edit').remove();
    updateTasks();
}

function editTask(taskItem) {
    const newTaskText = prompt('Editar tarefa:', taskItem.firstChild.textContent);
    if (newTaskText !== null && newTaskText.trim() !== '') {
        taskItem.firstChild.textContent = newTaskText;
        updateTasks();
    }
}

function deleteTask(taskItem) {
    taskItem.parentElement.removeChild(taskItem);
    updateTasks();
}

function clearAllTasks() {
    while (taskList.firstChild) {
        taskList.removeChild(taskList.firstChild);
    }
    while (completedTaskList.firstChild) {
        completedTaskList.removeChild(completedTaskList.firstChild);
    }
    localStorage.removeItem('tasks');
}

function saveTask(taskText, isCompleted) {
    let tasks = getTasksFromStorage();
    tasks.push({ text: taskText, completed: isCompleted });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasksFromStorage() {
    return localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
}

function loadTasks() {
    let tasks = getTasksFromStorage();
    tasks.forEach(task => {
        const taskItem = createTaskItem(task.text, task.completed);
        if (task.completed) {
            completedTaskList.appendChild(taskItem);
        } else {
            taskList.appendChild(taskItem);
        }
    });
}

function updateTasks() {
    let tasks = [];
    taskList.querySelectorAll('li').forEach(taskItem => {
        tasks.push({
            text: taskItem.firstChild.textContent,
            completed: false
        });
    });
    completedTaskList.querySelectorAll('li').forEach(taskItem => {
        tasks.push({
            text: taskItem.firstChild.textContent,
            completed: true
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

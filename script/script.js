// Sorry if there are some unnecessary coments, i just put them there to remember
import { createTagDropdown, TAGS } from "./tags.js";

// Initial variables
const inputField = document.querySelector('.js-text-input');
const addButton = document.querySelector('.js-add-button');
const taskHolder = document.querySelector('.js-task-holder');

addButton.addEventListener('click', addTask);
inputField.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

// Adding task button
function addTask() {
  const taskText = inputField.value.trim();

  // Check for empty input
  if (taskText === '') {
    alert('Please enter a task!');
    return;
  }

  // Check for same name tasks, regardless of capital letters
  const existingTasks = Array.from(document.querySelectorAll('.js-task-text'));
  if (existingTasks.some(task => task.textContent.toLowerCase() === taskText.toLowerCase())) {
    alert("Task already exists!");
    return;
  }

  // Check for task length 
  if (taskText.length > 100) {
    alert("Task too long (max 100 characters)");
    return;
  }

  // Create task element 
  const taskElement = document.createElement('div');
  taskElement.className = 'task js-task';

  // HTML structure
  taskElement.innerHTML = `
    <input type="checkbox" class="task-checkbox js-task-checkbox">
    <span class="task-tag js-task-tag"></span>
    <span class="task-text js-task-text">${taskText}</span>
    <input type="text" class="task-edit-input js-task-edit-input" style="display: none;">
    <button class="edit-btn js-edit-btn">Edit</button>
    <button class="save-btn js-save-btn" style="display: none;">Save</button>
    <button class="cancel-btn js-cancel-btn" style="display: none;">Cancel</button>
    <button class="delete-btn js-delete-btn">Delete</button>
  `;

  taskHolder.appendChild(taskElement);
  inputField.value = '';

  setupTaskEventListeners(taskElement);
  saveTasks();
}

function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem('todoTasks'));
  if (!savedTasks) return;

  savedTasks.forEach((task) => {
    const taskElement = document.createElement('div');
    taskElement.className = 'task js-task';
    
    taskElement.innerHTML = `
      <input type="checkbox" class="task-checkbox js-task-checkbox" ${task.completed ? 'checked' : ''}>
      <span class="task-tag js-task-tag" style="background: ${task.tag ? TAGS[task.tag].color : 'transparent'}"></span>
      <span class="task-text js-task-text">${task.text}</span>
      <input type="text" class="task-edit-input js-task-edit-input" style="display: none;">
      <button class="edit-btn js-edit-btn">Edit</button>
      <button class="save-btn js-save-btn" style="display: none;">Save</button>
      <button class="cancel-btn js-cancel-btn" style="display: none;">Cancel</button>
      <button class="delete-btn js-delete-btn">Delete</button>
    `;

    if (task.tag) {
      taskElement.dataset.tag = task.tag;
    }

    const textElement = taskElement.querySelector('.js-task-text');
    if (task.completed) {
      textElement.classList.add('completed');
    }

    setupTaskEventListeners(taskElement);
    taskHolder.appendChild(taskElement);
  });
}

function setupTaskEventListeners(taskElement) {
  const editBtn = taskElement.querySelector('.js-edit-btn');
  const saveBtn = taskElement.querySelector('.js-save-btn');
  const taskTextElement = taskElement.querySelector('.js-task-text');
  const editInput = taskElement.querySelector('.js-task-edit-input');
  const checkbox = taskElement.querySelector('.js-task-checkbox');
  const deleteBtn = taskElement.querySelector('.js-delete-btn');
  const cancelBtn = taskElement.querySelector('.js-cancel-btn');
  const tagElement = taskElement.querySelector('.js-task-tag');

  // Edit button click handler
  editBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    taskElement.classList.add('edit-mode');
    editInput.value = taskTextElement.textContent;
    
    // Replace tag with dropdown
    const currentTag = taskElement.dataset.tag || '';
    const tagDropdown = createTagDropdown(currentTag);
    taskElement.querySelector('.js-task-tag').replaceWith(tagDropdown);
    
    editInput.value = taskTextElement.textContent;
    editInput.focus();

    // Modified blur handler
  const handleBlur = (e) => {
    // Don't save if clicking on dropdown or its options
    if (!e.relatedTarget || !e.relatedTarget.closest('.tag-dropdown')) {
      saveBtn.click();
    }
  };
  
  editInput.addEventListener('blur', handleBlur);
});

  // Save button click handler
  saveBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const newText = editInput.value.trim();
    if (newText) {
      taskTextElement.textContent = newText;
      taskElement.classList.remove('edit-mode');
      
      // Save selected tag
      const tagDropdown = taskElement.querySelector('.tag-dropdown');
      if (tagDropdown) {
        const selectedTag = tagDropdown.value;
        taskElement.dataset.tag = selectedTag;
        
        // Update tag display
        tagElement.style.background = selectedTag ? TAGS[selectedTag].color : 'transparent';
        tagDropdown.replaceWith(tagElement);
      }
      
      saveTasks();
    }
  });

  // Enter key handler for edit input
  editInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      saveBtn.click();
    }
  });

  cancelBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    taskElement.classList.remove('edit-mode');
    
    // Restore original tag display
    const tagDropdown = taskElement.querySelector('.tag-dropdown');
    if (tagDropdown) {
      tagDropdown.replaceWith(tagElement);
    }
  });

  // Checkbox change handler
  checkbox.addEventListener('change', function() {
    taskTextElement.classList.toggle('completed', this.checked);
    saveTasks();
  });

  // Delete button click handler
  deleteBtn.addEventListener('click', () => {
    taskElement.remove();
    saveTasks();
  });
}

function saveTasks() {
  const getTasks = document.querySelectorAll('.js-task');
  const tasksArray = [];

  getTasks.forEach((taskElement) => {
    tasksArray.push({
      text: taskElement.querySelector('.js-task-text').textContent,
      completed: taskElement.querySelector('.js-task-checkbox').checked,
      tag: taskElement.dataset.tag || null
    });
  });

  localStorage.setItem('todoTasks', JSON.stringify(tasksArray));
}

document.addEventListener('DOMContentLoaded', loadTasks);
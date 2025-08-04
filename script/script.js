// Sorry if there are some unnecessary coments, i just put them there to remember
import { createTagDropdown, TAGS } from "./tags.js";

// Initial variables
const inputField = document.querySelector('.js-text-input');
const addButton = document.querySelector('.js-add-button');
const taskHolder = document.querySelector('.js-task-holder');

addButton.addEventListener('click', addTask);
inputField.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') addTask();
});

// Task creation
function addTask() {
  const taskText = inputField.value.trim();

  // Validation checks
  if (!taskText) {
    alert('Please enter a task!');
    return;
  }
  if (Array.from(document.querySelectorAll('.js-task-text'))
    .some(task => task.textContent.toLowerCase() === taskText.toLowerCase())) {
    alert("Task already exists!");
    return;
  }
  if (taskText.length > 100) {
    alert("Task too long (max 100 characters)");
    return;
  }

  // Create task element
  const taskElement = document.createElement('div');
  taskElement.className = 'task js-task';
  taskElement.innerHTML = `
    <div class="task-content">
      <input type="checkbox" class="task-checkbox js-task-checkbox">
      <span class="task-tag js-task-tag"></span>
      <span class="task-text js-task-text">${taskText}</span>
      <input type="text" class="task-edit-input js-task-edit-input" style="display: none;">
    </div>
    <div class="task-actions">
      <button class="edit-btn js-edit-btn">Edit</button>
      <button class="save-btn js-save-btn" style="display: none;">Save</button>
      <button class="cancel-btn js-cancel-btn" style="display: none;">Cancel</button>
      <button class="delete-btn js-delete-btn">Delete</button>
    </div>
  `;

  taskHolder.appendChild(taskElement);
  inputField.value = '';
  setupTaskEventListeners(taskElement);
  saveTasks();

    // Trigger grow animation
  const container = document.querySelector('.container');
  container.classList.add('grow-effect');
  
  // Remove after animation completes
  setTimeout(() => {
    container.classList.remove('grow-effect');
  }, 400); // Matches CSS transition duration
}

// Load tasks from storage
function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
  
  savedTasks.forEach(task => {
    const taskElement = document.createElement('div');
    taskElement.className = 'task js-task';
    taskElement.innerHTML = `
      <div class="task-content">
        <input type="checkbox" class="task-checkbox js-task-checkbox" ${task.completed ? 'checked' : ''}>
        <span class="task-tag js-task-tag"></span>
        <span class="task-text js-task-text">${task.text}</span>
        <input type="text" class="task-edit-input js-task-edit-input" style="display: none;">
      </div>
      <div class="task-actions">
        <button class="edit-btn js-edit-btn">Edit</button>
        <button class="save-btn js-save-btn" style="display: none;">Save</button>
        <button class="cancel-btn js-cancel-btn" style="display: none;">Cancel</button>
        <button class="delete-btn js-delete-btn">Delete</button>
      </div>
    `;

    // Set tag if exists
    if (task.tag && TAGS[task.tag]) {
      const tagElement = taskElement.querySelector('.js-task-tag');
      tagElement.textContent = TAGS[task.tag].name;
      tagElement.style.background = TAGS[task.tag].color;
      taskElement.dataset.tag = task.tag;
    }

    // Set completed state
    if (task.completed) {
      taskElement.querySelector('.js-task-text').classList.add('completed');
    }

    setupTaskEventListeners(taskElement);
    taskHolder.appendChild(taskElement);
  });
}

// Setup all task event listeners
function setupTaskEventListeners(taskElement) {
  const editBtn = taskElement.querySelector('.js-edit-btn');
  const saveBtn = taskElement.querySelector('.js-save-btn');
  const taskTextElement = taskElement.querySelector('.js-task-text');
  const editInput = taskElement.querySelector('.js-task-edit-input');
  const checkbox = taskElement.querySelector('.js-task-checkbox');
  const deleteBtn = taskElement.querySelector('.js-delete-btn');
  const cancelBtn = taskElement.querySelector('.js-cancel-btn');

    // Edit button
    editBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    taskElement.classList.add('edit-mode');
    
   // Find the CURRENT tag element (not storing original reference)
  const currentTagElement = taskElement.querySelector('.js-task-tag');
  const currentTag = taskElement.dataset.tag || '';
  const tagDropdown = createTagDropdown(currentTag);
  tagDropdown.addEventListener('mousedown', (e) => e.stopPropagation());
  
  currentTagElement.replaceWith(tagDropdown);
  
  editInput.value = taskTextElement.textContent;
  editInput.focus();

  // Handle blur
  const handleBlur = (e) => {
    if (!e.relatedTarget?.closest('.tag-dropdown')) {
      saveBtn.click();
    }
  };
  editInput.addEventListener('blur', handleBlur, { once: true });
});

  // Save button
  saveBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const newText = editInput.value.trim();
  const tagDropdown = taskElement.querySelector('.tag-dropdown');
  const selectedTag = tagDropdown?.value;

  if (newText) {
    taskTextElement.textContent = newText;
    
    const newTagElement = document.createElement('span');
    newTagElement.className = 'task-tag js-task-tag';
    
    if (selectedTag && TAGS[selectedTag]) {
      taskElement.dataset.tag = selectedTag;
      newTagElement.textContent = TAGS[selectedTag].name;
      newTagElement.style.background = TAGS[selectedTag].color;
    } else {
      taskElement.removeAttribute('data-tag');
      newTagElement.textContent = ''; // Ensure its empty
      newTagElement.style.background = ''; // remove any background
    }
    
    // Replace dropdown with new tag
    if (tagDropdown) {
      tagDropdown.replaceWith(newTagElement);
    }
    taskElement.classList.remove('edit-mode');
    saveTasks();
  }
});

 cancelBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  taskElement.classList.remove('edit-mode');
  
  const tagDropdown = taskElement.querySelector('.tag-dropdown');
  if (tagDropdown) {
    // Create a fresh tag element based on current data
    const currentTag = taskElement.dataset.tag;
    const tagElement = document.createElement('span');
    tagElement.className = 'task-tag js-task-tag';
    
    if (currentTag && TAGS[currentTag]) {
      tagElement.textContent = TAGS[currentTag].name;
      tagElement.style.background = TAGS[currentTag].color;
    }
    
    tagDropdown.replaceWith(tagElement);
  }
});

  // Other event listeners
  editInput.addEventListener('keyup', (e) => e.key === 'Enter' && saveBtn.click());
  checkbox.addEventListener('change', () => {
    taskTextElement.classList.toggle('completed', checkbox.checked);
    saveTasks();
  });
  deleteBtn.addEventListener('click', () => {
    taskElement.remove();
    saveTasks();

    // Subtle shrink effect
   const container = document.querySelector('.container');
   container.classList.add('shrink-effect');
   setTimeout(() => container.classList.remove('shrink-effect'), 300);
 });
}

// Save tasks to storage
function saveTasks() {
  const tasks = Array.from(document.querySelectorAll('.js-task')).map(task => ({
    text: task.querySelector('.js-task-text').textContent,
    completed: task.querySelector('.js-task-checkbox').checked,
    tag: task.dataset.tag || null
  }));
  localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

// Initialize
document.addEventListener('DOMContentLoaded', loadTasks);
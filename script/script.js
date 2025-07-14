const inputField = document.querySelector('.js-text-input');
const addButton = document.querySelector('.js-add-button');
const taskHolder = document.querySelectorAll('.js-task-holder')

addButton.addEventListener('click', addTask());
inputField.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

function addTask () {
  const inputField = document.querySelector('.js-text-input');
  const taskText = inputField.ariaValueMax.trim();

  if (taskText === '') {
    alert('Please enter a task!');
    return;
  }

  const taskElement = document.createElement('div');
  taskElement.className = 'task'; // For styling

  taskElement.innerHTML = `
  <input type="checkbox" class="task-checkbox">
  <span class="task-text">Task text here</span>
  <button class="delete-btn">Delete</button>
  `
  
  const taskHolder = document.querySelector('.js-task-holder');
  taskHolder.append(taskElement);
}

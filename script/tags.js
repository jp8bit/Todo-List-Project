// tags.js
export const TAGS = {
  WORK: { name: "Work", color: "#ff5252" },
  CHORES: { name: "Chores", color: "#4caf50" },
  EVENTS: { name: "Events", color: "#2196f3" },
  PERSONAL: { name: "Personal", color: "#ff9800" }
};

export function createTagDropdown(currentTag = null) {
  const dropdown = document.createElement('select');
  dropdown.className = 'tag-dropdown';
  
  // Add default option
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Select tag';
  dropdown.appendChild(defaultOption);

  // CORRECTED: Proper parameter destructuring
  Object.entries(TAGS).forEach(([tagKey, tag]) => {
    const option = document.createElement('option');
    option.value = tagKey;  // Use tagKey instead of key
    option.textContent = tag.name;
    option.style.color = tag.color;
    if (currentTag === tagKey) option.selected = true;
    dropdown.appendChild(option);
  });

  return dropdown;
}
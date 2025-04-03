// Global variables
let isEditing = false;
let currentEditId = null;
let allItems = []; // Store all items

// Load items when page loads
window.onload = function() {
    fetchAllItems();
};

// Display notification
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.remove('hidden', 'bg-green-100', 'border-green-500', 'text-green-700', 'bg-red-100', 'border-red-500', 'text-red-700');
    
    if (type === 'success') {
        notification.classList.add('bg-green-100', 'border-green-500', 'text-green-700');
    } else {
        notification.classList.add('bg-red-100', 'border-red-500', 'text-red-700');
    }
    
    notification.classList.remove('hidden');
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

// Fetch all items from API
async function fetchAllItems() {
    try {
        const response = await fetch('/items/');
        if (!response.ok) {
            throw new Error('Failed to fetch items');
        }
        
        const items = await response.json();
        allItems = items;
        
        // Display the most recent 2 todos
        displayRecentTodos(items);
    } catch (error) {
        showNotification('Error loading items: ' + error.message, 'error');
    }
}

// Display recent todos
function displayRecentTodos(items) {
    const container = document.getElementById('recent-todos');
    
    if (items.length === 0) {
        container.innerHTML = `
            <div class="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No todos</h3>
                <p class="mt-1 text-sm text-gray-500">Get started by creating a new todo.</p>
            </div>
        `;
        return;
    }
    
    // Sort by ID (most recent first) and take the first 2
    const recentItems = [...items].sort((a, b) => b.id - a.id).slice(0, 2);
    
    container.innerHTML = '';
    
    recentItems.forEach(item => {
        const isCompleted = item.completed ? true : false;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'py-4 first:pt-0 last:pb-0';
        
        itemElement.innerHTML = `
            <div class="flex items-start">
                <div class="min-w-0 flex-1">
                    <div class="flex items-center">
                        <label class="inline-flex items-center mr-3">
                            <input type="checkbox" onchange="toggleCompleted(${item.id}, this.checked)" ${isCompleted ? 'checked' : ''}
                                class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded">
                        </label>
                        <h3 class="text-base font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}">
                            ${item.title}
                        </h3>
                    </div>
                    <p class="mt-1 text-sm text-gray-600">${item.description}</p>
                </div>
                <div class="ml-4 flex-shrink-0 flex space-x-2">
                    <button onclick="loadItemForEdit(${item.id})" class="bg-white rounded-md font-medium text-primary hover:text-primary-dark focus:outline-none text-sm">
                        Edit
                    </button>
                    <button onclick="deleteItem(${item.id})" class="bg-white rounded-md font-medium text-red-600 hover:text-red-800 focus:outline-none text-sm">
                        Delete
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(itemElement);
    });
}

// Toggle item completion status
function toggleCompleted(id, isCompleted) {
    // Find the item in our local array and update it
    const itemIndex = allItems.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
        allItems[itemIndex].completed = isCompleted;
        
        // Refresh the display to update the UI
        displayRecentTodos(allItems);
    }
}

// Add a new item
async function addItem() {
    const itemId = document.getElementById('itemId').value;
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    
    if (!itemId || !title || !description) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    try {
        const response = await fetch(`/items/${itemId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                description: description
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Error adding item');
        }
        
        showNotification('Todo added successfully', 'success');
        clearForm();
        fetchAllItems();
    } catch (error) {
        showNotification('Error adding Todo: ' + error.message, 'error');
    }
}

// Load item data for editing
async function loadItemForEdit(id) {
    try {
        const response = await fetch(`/items/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch item');
        }
        
        const item = await response.json();
        
        // Fill the form with item data
        document.getElementById('itemId').value = id;
        document.getElementById('title').value = item.title;
        document.getElementById('description').value = item.description;
        
        // Disable item ID field during edit
        document.getElementById('itemId').disabled = true;
        
        // Show update and cancel buttons, hide add button
        document.getElementById('addBtn').style.display = 'none';
        document.getElementById('updateBtn').style.display = 'block';
        document.getElementById('cancelBtn').style.display = 'block';
        
        isEditing = true;
        currentEditId = id;
        
    } catch (error) {
        showNotification('Error loading item: ' + error.message, 'error');
    }
}

// Update an existing item
async function updateItem() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    
    if (!title || !description) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    try {
        const response = await fetch(`/items/${currentEditId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                description: description
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Error updating item');
        }
        
        showNotification('Todo updated successfully', 'success');
        cancelEdit();
        fetchAllItems();
    } catch (error) {
        showNotification('Error updating Todo: ' + error.message, 'error');
    }
}

// Delete an item
async function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this todo?')) {
        return;
    }
    
    try {
        const response = await fetch(`/items/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Error deleting item');
        }
        
        showNotification('Todo deleted successfully', 'success');
        fetchAllItems();
        
        // If we were editing this item, reset the form
        if (isEditing && currentEditId == id) {
            cancelEdit();
        }
    } catch (error) {
        showNotification('Error deleting Todo: ' + error.message, 'error');
    }
}

// Cancel editing mode
function cancelEdit() {
    isEditing = false;
    currentEditId = null;
    
    // Reset form
    clearForm();
    
    // Enable item ID field
    document.getElementById('itemId').disabled = false;
    
    // Show add button, hide update and cancel buttons
    document.getElementById('addBtn').style.display = 'block';
    document.getElementById('updateBtn').style.display = 'none';
    document.getElementById('cancelBtn').style.display = 'none';
}

// Clear form fields
function clearForm() {
    document.getElementById('itemId').value = '';
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
}
// Global variables
let isEditing = false;
let currentEditId = null;

// Load all items when page loads
window.onload = function() {
    fetchAllItems();
};

// Display notification
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = 'notification ' + type;
    notification.style.display = 'block';
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.style.display = 'none';
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
        displayItems(items);
    } catch (error) {
        showNotification('Error loading items: ' + error.message, 'error');
    }
}

// Display items in the UI
function displayItems(items) {
    const container = document.getElementById('items-container');
    container.innerHTML = '';
    
    if (items.length === 0) {
        container.innerHTML = '<p>No items found. Add your first item!</p>';
        return;
    }
    
    items.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        itemCard.innerHTML = `
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <div class="item-actions">
                <button onclick="loadItemForEdit(${item.id})" class="btn-warning">Edit</button>
                <button onclick="deleteItem(${item.id})" class="btn-danger">Delete</button>
            </div>
        `;
        container.appendChild(itemCard);
    });
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
        
        showNotification('Item added successfully', 'success');
        clearForm();
        fetchAllItems();
    } catch (error) {
        showNotification('Error adding item: ' + error.message, 'error');
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
        document.querySelector('button').style.display = 'none';
        document.getElementById('updateBtn').style.display = 'inline-block';
        document.getElementById('cancelBtn').style.display = 'inline-block';
        
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
        
        showNotification('Item updated successfully', 'success');
        cancelEdit();
        fetchAllItems();
    } catch (error) {
        showNotification('Error updating item: ' + error.message, 'error');
    }
}

// Delete an item
async function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) {
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
        
        showNotification('Item deleted successfully', 'success');
        fetchAllItems();
        
        // If we were editing this item, reset the form
        if (isEditing && currentEditId == id) {
            cancelEdit();
        }
    } catch (error) {
        showNotification('Error deleting item: ' + error.message, 'error');
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
    document.querySelector('button').style.display = 'inline-block';
    document.getElementById('updateBtn').style.display = 'none';
    document.getElementById('cancelBtn').style.display = 'none';
}

// Clear form fields
function clearForm() {
    document.getElementById('itemId').value = '';
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
}
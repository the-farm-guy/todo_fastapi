// Global variables
let allItems = []; // Store all items for filtering

// Load all items when page loads
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
        allItems = items; // Store all items for filtering
        displayItems(items);
        
        // Update the todos count
        document.getElementById('todos-count').textContent = `${items.length} total todos`;
    } catch (error) {
        showNotification('Error loading items: ' + error.message, 'error');
    }
}

// Display items in the UI
function displayItems(items) {
    const container = document.getElementById('items-container');
    
    if (items.length === 0) {
        container.innerHTML = `
            <div class="py-10 px-6 text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No todos found</h3>
                <p class="mt-1 text-sm text-gray-500">
                    ${document.getElementById('searchInput').value ? 
                      'Try searching with different keywords.' : 
                      'Get started by creating a new todo.'}
                </p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    items.forEach(item => {
        const isCompleted = item.completed ? true : false;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'px-6 py-4 hover:bg-gray-50 flex items-start';
        
        itemElement.innerHTML = `
            <div class="flex-shrink-0 pt-0.5">
                <input type="checkbox" onchange="toggleCompleted(${item.id}, this.checked)" ${isCompleted ? 'checked' : ''}
                    class="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded">
            </div>
            <div class="ml-3 flex-1">
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}">
                        ${item.title}
                    </h3>
                    <p class="text-sm text-gray-500">ID: ${item.id}</p>
                </div>
                <p class="mt-1 text-sm text-gray-600">${item.description}</p>
            </div>
            <div class="ml-4 flex-shrink-0 flex space-x-2">
                <button onclick="deleteItem(${item.id})" class="bg-white rounded font-medium text-red-600 hover:text-red-800 focus:outline-none text-sm flex items-center">
                    <svg class="mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    Delete
                </button>
                <button onclick="window.location.href='index.html?edit=${item.id}'" class="bg-white rounded font-medium text-primary hover:text-primary-dark focus:outline-none text-sm flex items-center">
                    <svg class="mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit
                </button>
            </div>
        `;
        
        container.appendChild(itemElement);
    });
}

// Search/filter items
function searchItems() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (!searchTerm) {
        displayItems(allItems);
        return;
    }
    
    const filteredItems = allItems.filter(item => 
        item.title.toLowerCase().includes(searchTerm) || 
        item.description.toLowerCase().includes(searchTerm)
    );
    
    displayItems(filteredItems);
    
    // Update the count
    document.getElementById('todos-count').textContent = 
        `${filteredItems.length} of ${allItems.length} todos matching "${searchTerm}"`;
}

// Filter by completion status
function filterByStatus(status) {
    let filteredItems;
    
    // Update active button styling
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.classList.remove('bg-primary', 'text-white');
        btn.classList.add('bg-white', 'text-gray-700');
    });
    
    document.querySelector(`.filter-btn[onclick="filterByStatus('${status}')"]`).classList.remove('bg-white', 'text-gray-700');
    document.querySelector(`.filter-btn[onclick="filterByStatus('${status}')"]`).classList.add('bg-primary', 'text-white');
    
    if (status === 'all') {
        filteredItems = allItems;
    } else if (status === 'active') {
        filteredItems = allItems.filter(item => !item.completed);
    } else if (status === 'completed') {
        filteredItems = allItems.filter(item => item.completed);
    }
    
    displayItems(filteredItems);
    
    // Update the count
    let statusText = status === 'all' ? 'total' : status;
    document.getElementById('todos-count').textContent = `${filteredItems.length} ${statusText} todos`;
}

// Toggle item completion status
function toggleCompleted(id, isCompleted) {
    // Find the item in our local array and update it
    const itemIndex = allItems.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
        allItems[itemIndex].completed = isCompleted;
        
        // Refresh the display to update the UI
        // Get the current filter from active button
        const currentFilter = document.querySelector('.filter-btn.bg-primary').textContent.trim().toLowerCase();
        filterByStatus(currentFilter);
    }
}

// Clear search input
function clearSearch() {
    document.getElementById('searchInput').value = '';
    searchItems();
}

// Sort items
function sortItems(sortBy) {
    let sortedItems = [...allItems];
    
    if (sortBy === 'title') {
        sortedItems.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'id') {
        sortedItems.sort((a, b) => a.id - b.id);
    }
    
    // Get the current filter from active button
    const currentFilter = document.querySelector('.filter-btn.bg-primary').textContent.trim().toLowerCase();
    if (currentFilter !== 'all') {
        sortedItems = sortedItems.filter(item => 
            currentFilter === 'completed' ? item.completed : !item.completed
        );
    }
    
    displayItems(sortedItems);
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
    } catch (error) {
        showNotification('Error deleting Todo: ' + error.message, 'error');
    }
}
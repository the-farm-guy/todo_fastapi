import requests
import json

# Base URL of your FastAPI endpoint
base_url = "http://127.0.0.1:8000"

# Test the update_item endpoint with complete data
def test_update_item_complete():
    item_id = 42
    url = f"{base_url}/items/{item_id}"
    
    # JSON data to send in the POST request
    data = {
        "name": "Updated Item",
        "description": "This is an updated item",
        "price": 39.99,
        "tax": 7.5
    }
    
    # Headers
    headers = {
        "Content-Type": "application/json"
    }
    
    # Make the POST request
    response = requests.post(url, data=json.dumps(data), headers=headers)
    
    # Print the status code and response
    print(f"Test 1: Update item with complete data (item_id={item_id})")
    print(f"Status Code: {response.status_code}")
    print("Response Content:")
    print(json.dumps(response.json(), indent=4))
    print("\n")

# Test with query parameter
def test_update_item_with_query():
    item_id = 43
    query_param = "99.99"  
    url = f"{base_url}/items/{item_id}?q={query_param}"
    
    data = {
        "name": "Query Item",
        "description": "This item tests query parameters",
        "price": 59.99,
        "tax": 8.5
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, data=json.dumps(data), headers=headers)
    
    print(f"Test 2: Update item with query parameter (item_id={item_id}, q={query_param})")
    print(f"Status Code: {response.status_code}")
    print("Response Content:")
    print(json.dumps(response.json(), indent=4))
    print("\n")

# Test with minimal data
def test_update_item_minimal():
    item_id = 44
    url = f"{base_url}/items/{item_id}"
    
    # Only providing required fields
    data = {
        "name": "Minimal Update",
        "price": 19.99
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, data=json.dumps(data), headers=headers)
    
    print(f"Test 3: Update item with minimal data (item_id={item_id})")
    print(f"Status Code: {response.status_code}")
    print("Response Content:")
    print(json.dumps(response.json(), indent=4))
    print("\n")

# Test with invalid item_id format
def test_invalid_item_id():
    item_id = "not-a-number" 
    url = f"{base_url}/items/{item_id}"
    
    data = {
        "name": "Invalid ID Test",
        "price": 29.99
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, data=json.dumps(data), headers=headers)
    
    print(f"Test 4: Update with invalid item_id format (item_id={item_id})")
    print(f"Status Code: {response.status_code}")
    print("Response Content:")
    print(response.text)
    print("\n")

# Run all tests
if __name__ == "__main__":
    test_update_item_complete()
    test_update_item_with_query()
    test_update_item_minimal()
    test_invalid_item_id()
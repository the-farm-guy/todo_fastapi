import requests
import json

# URL of your FastAPI endpoint
url = "http://127.0.0.1:8000/items"

# JSON data to send in the POST request
data = {
    "name": "Test Item",
    "description": "This is a test item",
    "price": 29.99,
    "tax": 5.0
}

# Headers
headers = {
    "Content-Type": "application/json"
}

# Make the POST request
response = requests.post(url, data=json.dumps(data), headers=headers)

# Print the status code and response
print(f"Status Code: {response.status_code}")
print("Response Content:")
print(json.dumps(response.json(), indent=4))

# Test with missing optional fields
data_minimal = {
    "name": "Minimal Item",
    "price": 19.99
}

response_minimal = requests.post(url, data=json.dumps(data_minimal), headers=headers)
print("\nMinimal Data Test:")
print(f"Status Code: {response_minimal.status_code}")
print("Response Content:")
print(json.dumps(response_minimal.json(), indent=4))

# Test with invalid data (missing required field)
data_invalid = {
    "description": "Invalid item without name",
    "price": 9.99
}

response_invalid = requests.post(url, data=json.dumps(data_invalid), headers=headers)
print("\nInvalid Data Test:")
print(f"Status Code: {response_invalid.status_code}")
print("Response Content:")
print(response_invalid.text)
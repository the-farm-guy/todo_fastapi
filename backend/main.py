from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

class Item(BaseModel):
    title: str
    description: str

items = {}

@app.get('/')
async def home_page():
    return 'website up and running'

@app.post('/items/{item_id}')
async def post_items(item_id : int, todo : Item):
    if item_id in items:
        raise ValueError('already exists')
    
    items[item_id] = todo
    return 'updated successfully'

@app.get('/items')
async def get_items():
    return items

@app.get('/items/{item_id}')
async def get_specific_item(item_id : int):
    if item_id not in items:
        raise ValueError('item does not exists')
    
    return items[item_id]

@app.put('/items/{item_id}')
async def update_item(item_id : int, todo : Item):
    if item_id not in items:
        raise ValueError('item does not exists')
    
    items[item_id] = todo
    return 'updated successfully'

@app.delete('/items/{item_id}')
async def delete_item(item_id : int):
    if item_id not in items:
        raise ValueError('item does not exists')
    
    del items[item_id]
    return 'deleted successfully'
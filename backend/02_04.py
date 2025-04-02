from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from typing import List

from . import crud, schema
from .database import engine, Base, get_db

Base.metadata.create_all(bind=engine)
app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="template")

@app.get('/', response_class=HTMLResponse)
async def home_page(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post('/items/{todo_id}', response_model=schema.TodoResponse)
async def post_items(todo_id: int, todo: schema.TodoCreate, db: Session = Depends(get_db)):
    existing_todo = crud.list_todo(db=db, todo_id=todo_id)
    if existing_todo:
        raise HTTPException(status_code=400, detail="Todo with this ID already exists")
    
    return crud.create_todo(db=db, todo=todo, todo_id=todo_id)

@app.get('/items/', response_model=List[schema.TodoResponse])
async def get_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    items = crud.get_todos(db=db, skip=skip, limit=limit)
    return items

@app.get('/items/{todo_id}', response_model=schema.TodoResponse)
async def get_specific_item(todo_id: int, db: Session = Depends(get_db)):
    items = crud.list_todo(db=db, todo_id=todo_id)
    if not items:
        raise HTTPException(status_code=404, detail="Todo not found")
    return items

@app.put('/items/{todo_id}', response_model=schema.TodoResponse)
async def update_item(todo_id: int, todo: schema.TodoUpdate, db: Session = Depends(get_db)):
    items = crud.update_todo(todo_id=todo_id, todo=todo, db=db)
    if items is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return items

@app.delete('/items/{todo_id}', response_model=schema.TodoResponse)
async def delete_item(todo_id: int, db: Session = Depends(get_db)):
    items = crud.delet_todo(db=db, todo_id=todo_id)
    if items is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return items
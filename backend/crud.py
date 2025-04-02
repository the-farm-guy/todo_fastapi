from . import schema, model
from sqlalchemy.orm import Session

def create_todo(db: Session, todo: schema.TodoCreate, todo_id: int):
    todo_data = todo.model_dump()
    db_todo = model.Todo(id=todo_id, **todo_data)
    
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

def list_todo(db: Session, todo_id: int):
    return db.query(model.Todo).filter(model.Todo.id == todo_id).first()

def get_todos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(model.Todo).offset(skip).limit(limit).all()

def update_todo(db: Session, todo_id: int, todo: schema.TodoUpdate):
    db_todo = db.query(model.Todo).filter(model.Todo.id == todo_id).first()
    if not db_todo:
        return None
    
    update_data = todo.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_todo, key, value)

    db.commit()
    db.refresh(db_todo)
    return db_todo

def delet_todo(db: Session, todo_id: int):
    db_todo = db.query(model.Todo).filter(model.Todo.id == todo_id).first()
    if not db_todo:
        return None
    
    db.delete(db_todo)
    db.commit()
    return db_todo
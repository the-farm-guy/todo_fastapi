from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class TodoBase(BaseModel):
    """
    Base schema for Todo with common attributes
    Used as a base for other schemas
    """
    title: str = Field(
        ...,  
        min_length=1,  
        max_length=255, 
        description="Title of the todo item"
    )
    description: Optional[str] = Field(
        None, 
        max_length=1000,  
        description="Optional description of the todo item"
    )

class TodoCreate(TodoBase):
    """
    Schema for creating a new todo item
    Inherits from TodoBase
    Used in POST requests
    """
    pass  

class TodoUpdate(BaseModel):
    """
    Schema for updating an existing todo item
    All fields are optional to allow partial updates
    """
    title: Optional[str] = Field(
        None,
        min_length=1,
        max_length=255,
        description="Updated title of the todo item"
    )
    description: Optional[str] = Field(
        None,
        max_length=1000,
        description="Updated description of the todo item"
    )

class TodoResponse(TodoBase):
    """
    Schema for returning a todo item from the API
    Includes the database-generated ID and created_at timestamp
    """
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class TodoListResponse(BaseModel):
    """
    Schema for returning a list of todos
    Useful for GET requests that return multiple items
    """
    todos: list[TodoResponse]
    total_count: int
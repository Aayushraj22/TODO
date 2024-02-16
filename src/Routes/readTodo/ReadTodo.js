import React from 'react'
import './readTodo.css'

function ReadTodo() {
  return (
    <div className='read-todo'>
        <div className="read-todo-container">
            <div className="read-header-todo">
              <div className="read-todo-status">
                <span>Status: </span>
                <select name="selete" >
                  <option value="done">Done</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div className="meta-data-style">
                <span>Posted On: </span>
                <span>12/04/2001</span>
              </div>
            </div>
            <div className="read-content-todo">
                <div className="read-title">
                    Title
                </div>
                <div className="read-content">
                    reading content goes here....
                </div>
            </div>
        </div>
    </div>
  )
}

export default ReadTodo
import React, { useState } from 'react'
import './readTodo.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

function ReadTodo() {
  const navigate = useNavigate()
  const location = useLocation();
  const {title, description, postedOn, readingStatus} = location.state.todoData;
  const docRef = location.state.docRef;
  const [todoReadingStatus, setTodoReadingStatus] = useState(readingStatus)


  async function handleReadingStatusChanged(e) {
    const status = e.target.value;
    setTodoReadingStatus(status);

    try {
      await updateDoc(doc(db,'todoDocs',docRef), {readingStatus: status});
    } catch (error) {
      console.log('not updated the status of reading this todo')
    }
  }

  function handleGoBack() {
    navigate(-1, { replace: 'true' });
  }


  return (
    <div className='read-todo'>
        <div className="read-todo-container">
        <div className="form-icons">
            <span className='go-back' onClick={handleGoBack}>
                <i className="fa-solid fa-angle-left"></i>
                Back
            </span>
        </div>
            <div className="read-header-todo">
              <div className="read-todo-status">
                <label htmlFor="readingStatus" >Status: </label>
                <select name='readingStatus' id='readingStatus' className='select-style' value={todoReadingStatus} onChange={handleReadingStatusChanged}>
                  <option value="pending">Pending</option>
                  <option value="read">Read</option>
                </select>
              </div>
              <div className="meta-data-style">
                <span>Posted On: </span>
                <span>{postedOn}</span>
              </div>
            </div>
            <div className="read-content-todo">
                <p className="read-title">
                    {title.slice(0,1).toUpperCase() + title.slice(1)}
                </p>
                <p className="read-content">
                    {description}
                </p>
            </div>
        </div>
    </div>
  )
}

export default ReadTodo
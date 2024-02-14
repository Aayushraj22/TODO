import React, {useState, useEffect} from 'react'
import './todoListContainer.css'
import Button from '../button/Button'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import TodoCard from '../todoCard/TodoCard'
import { useDispatch } from 'react-redux'
import { setTodoTaskList } from '../../Redux/slice/TodoSlice'

function TodoListContainer() {
    const navigate = useNavigate()
    const [todolist, setTodolist] = useState([])
    const dispatch = useDispatch();

    useEffect(() => {
        const uid = localStorage.getItem('uid');    // here uid is the docRefId of current user
        getAllTodoCreatedByUser(uid);



        async function getAllTodoCreatedByUser(uid){ 
            try {
                let userData = await getDoc(doc(db, 'todoUsers', uid));
                userData = userData.data();

                if(userData?.myTodos) {
                    dispatch(setTodoTaskList(userData?.myTodos))
                    setTodolist(userData?.myTodos);
                }
            } catch (error) {
                console.log('error from todolist-container')
            } 
        }

    }, [])
    
    const handleDisplayCreateModal = () => {
        navigate('/createTodo')
    }

  return (
    <div className='todo-container'>
        <div className="header">
            <h1 className='text-center'>Click below Button to create new TODO tasks. 👇</h1>
            <Button classname='create-task' onClick={handleDisplayCreateModal}>Create Todo </Button>
        </div>
        <div className="task-container">
            {todolist.length ? todolist.map(refId => <TodoCard key={refId} docRef={refId} />) : <h3 className='text-center'>Now Start by creating your todo</h3>}
        </div>
    </div>
  )
}

export default TodoListContainer
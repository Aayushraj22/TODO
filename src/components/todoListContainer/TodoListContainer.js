import React, { useEffect} from 'react'
import './todoListContainer.css'
import Button from '../button/Button'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import TodoCard from '../todoCard/TodoCard'
import { useDispatch, useSelector } from 'react-redux'
import { setTodoTaskList } from '../../Redux/slice/TodoSlice'
import { toggleLoading } from '../../Redux/slice/loaderSlice'
import { compactView, listView } from '../../Redux/slice/viewSlice'

function TodoListContainer() {
    const navigate = useNavigate()
    const todolist = useSelector(state => state.todos)
    const dispatch = useDispatch();
    const {containerListView} = useSelector(state => state.persistedReducer.listView)

    useEffect(() => {
        // set the loader as data is fetching
        dispatch(toggleLoading(true));

        const uid = localStorage.getItem('uid');    // here uid is the docRefId of current user
        getAllTodoCreatedByUser(uid);

        // remove the loader as data is fetching
        dispatch(toggleLoading(false));

        
        async function getAllTodoCreatedByUser(uid){ 
            try {
                let userData = await getDoc(doc(db, 'todoUsers', uid));
                userData = userData.data();

                if(userData?.myTodos) {
                    dispatch(setTodoTaskList(userData?.myTodos))
                }
            } catch (error) {
                console.log('error from todolist-container')
            }  
        }

        

   }, [])

    const handleDisplayCreateModal = () => {
        navigate('/createTodo')
    }


    // .... function to toggle the view of todo task ..... // 
    function handleToggleListView(view){
        if(view === 'compact'){
            dispatch(compactView());
        }else {
            dispatch(listView());
        }
    }

    


  return (
    <div className='todo-container'>
        <div className="header">
            <h1 className='text-center'>Click the below Button to create new TODO. 👇</h1>
            <Button classname='create-task' onClick={handleDisplayCreateModal}>Create Todo </Button>
        </div>
        <div className="task-container">
            <div className="title-task-container">
                <i className="fas fa-th" title='compact' onClick={() => handleToggleListView('compact')}></i>
                <i className="fas fa-list-alt" title='list' onClick={() => handleToggleListView('list')}></i>
            </div>
            <div className={`content-task-container ${containerListView}`}>

                {todolist?.length ? todolist.map(refId => <TodoCard key={refId} docRef={refId} />) : <h3 className='text-center'>Now Start by creating your todo</h3>}
            </div>
        </div>
    </div>
  )
}

export default TodoListContainer
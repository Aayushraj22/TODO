import React, {useState, useEffect} from 'react'
import './todoCard.css'
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setTodoTaskList } from '../../Redux/slice/TodoSlice';

function TodoCard({docRef}) {
    const dispatch = useDispatch();
    const globalTodoList = useSelector(state => state.todos)
    const navigate = useNavigate();
    const [todoData, setTodoData] = useState({})
    const {title, description} = todoData;

    useEffect(() => {

        getTodo(docRef);
      
        async function getTodo(docRef){
            try {
                const snapshot = await getDoc(doc(db,'todoDocs', docRef));
                const data = snapshot.data();
                
                if(data){
                    setTodoData({title: data?.title, description: data?.description, readingStatus: data?.readingStatus, postedOn: data?.postedOn});
                }
                
            } catch (error) {
                console.log('todo not found from todocard');
            }
        
        }
    }, [])
    

    async function handleDeleteThisTask(e){
        e.stopPropagation()
        
        const updatedTodoList = globalTodoList.filter(todoRefId => todoRefId !== docRef)
        
        dispatch(setTodoTaskList(updatedTodoList));

        try {
            // update in the myTodos property in user doc also
            const uid = localStorage.getItem('uid');
            await updateDoc(doc(db, 'todoUsers', uid ), {myTodos: updatedTodoList});

            // delete the todo doc from 'todoDocs' collection of db
            await deleteDoc(doc(db,'todoDocs', docRef))

        } catch (error) {
            console.log('from todoCard try to delete this todo and update at db and global state, but some error happens')
        } 
    }

    function handleEditTask(e) {
        e.stopPropagation() 
        navigate(`/modifyTodo/${docRef}`);
    }

    function handleReadingTodo(){
        navigate('/readTodo', {state: {todoData, docRef }});
    }


  return (
    <div className='taskCard-container' onClick={handleReadingTodo}>
        <div className="taskcard-content">
            <h4>{title?.slice(0,1).toUpperCase() + title?.slice(1)}</h4>
            <p style={{fontSize: '0.8rem', flex: 1 }}>{description?.substring(0,50) + '...'}</p>
        </div>
        <div className="taskcard-icons">
            <i className="far fa-edit" style={{color: '#FFD43B'}} onClick={handleEditTask}></i>
            <i className="fas fa-trash-alt" style={{color: '#ff0000'}} onClick={handleDeleteThisTask}></i>
        </div>
    </div>
  )
}

export default TodoCard
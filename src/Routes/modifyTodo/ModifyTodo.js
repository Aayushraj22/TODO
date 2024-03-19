import React, {useState, useEffect} from 'react'
import './modifyTodo.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../../components/button/Button';
import { useNavigate, useParams } from 'react-router-dom';
import {db} from '../../firebase/config'
import { collection, addDoc, getDoc, doc, updateDoc } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLoading } from '../../Redux/slice/loaderSlice';
import { setTodoTaskList } from '../../Redux/slice/TodoSlice';
import { TabManager } from '../../FormatInput';

function ModifyTodo({modalType}) {

    const localTodoList = useSelector(state => state.todos);
    const todoDocRef = useParams()?.id;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // getting the date of day of creation of new todo.
    const date = new Date();
    const dayOfCreation = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();  
    const [task, setTask] = useState({
        userDocRef: '',
        title: '',
        description: '',
        postedOn: String(dayOfCreation),
        readingStatus: 'pending',
    })

    const { title, description} = task;

    useEffect(() => {

        // fetching the document using the docRefId from 'todoDoc' collection 
        if(todoDocRef){
            dispatch(toggleLoading(true))
            getTodoDoc(todoDocRef);
        }

        

        async function getTodoDoc(docRef){
            try {
                const snapshot = await getDoc(doc(db,'todoDocs', docRef));

                // now update the local state with the fetched doc-value
                if(snapshot.exists()) {
                    const data = snapshot.data();

                    setTask({
                        userDocRef: data?.userDocRef,
                        title: data?.title,
                        description: data?.description,
                    })
                }

            } catch (error) {
                // something to be written here so to handle the error(like network issue , or doc is not present in db)
                console.log('as docref is dumy ')
            }

            
            dispatch(toggleLoading(false))
        }

    }, [])


    function handleCancelTodo(){
        navigate('/')
    }

    function handleOnChangeInput(e){
        setTask({
            ...task,
            [e.target.id]: e.target.value,
        })
    }

    // ....... function to unset loader and show action corrosponding message .......... //
    function toastAndDispatch(toastMsg, toastType){
        dispatch(toggleLoading(false));
        if(toastType === 'success'){
            toast.success(toastMsg);
        }else {
            toast.error(toastMsg);
        }
    }


    // ......... function to create a new todo or update the existing one ........ //
    async function handleUpdateOrCreateTodo(e) {
        e.preventDefault();

        // all fields needs to be filled
        if(title==='' | description===''){
            toast.error('all fields are required')
            return ;
        }

        //show the loader while new todoTask stored in the db
        dispatch(toggleLoading(true)); 

        try {
            const uid = localStorage.getItem('uid');

            if(modalType === 'create'){
                
                const myNewTask = {...task, userDocRef: uid};

                // add new doc to the todoDocs collection in db
                const docRef = await addDoc(collection(db,'todoDocs'), myNewTask);

                // add the ref of newly created todoTask doc in the array of myTodos(property), which present as property in user doc
                const user = await getDoc(doc(db,'todoUsers', uid));
                if(user.exists()){
                    const userData = user.data();

                    let arraylist = new Array();
                    arraylist.push(docRef.id);

                    if(userData?.myTodos){
                        arraylist = arraylist.concat(userData.myTodos);
                    }
                    
                    await updateDoc(doc(db,'todoUsers',uid), {myTodos: arraylist});
                }

                // adding the new doc ref in the localTodoList
                dispatch(setTodoTaskList([...localTodoList, docRef.id]));

                // update the global state to render the new added todo

                // ........  yeh abhi krna hai    ............. ///


                // resetting the component state
                setTask({
                    userDocRef: '',
                    title: '',
                    description: '',
                    postedOn: String(dayOfCreation),
                    readingStatus: 'pending',
                })

                
                toastAndDispatch('Todo Created Successfully','success')
            }else { // update data in db
                await updateDoc(doc(db,'todoDocs', todoDocRef), {title, description, readingStatus:'pending'});

                toastAndDispatch('Todo updated Successfully','success')
            }

            
        } catch (error) {
            toastAndDispatch('unsuccessfull attempt, Do Again !','error');
        }
        
    }

    function handleGoBack() {
        navigate(-1, { replace: 'true' });
      }



  return (
    <form className='modal-container'>
        <div className="form-icons">
            <span className='go-back' onClick={handleGoBack}>
                <i className="fa-solid fa-angle-left"></i>
                Back
            </span>
        </div>
        <div className="input-box">
            <label htmlFor="title">Title</label>
            <input type="text"  id='title' className='inputElement' autoFocus value={title} onChange={handleOnChangeInput} required/>
        </div>

        <div className="input-box">
            <label htmlFor="description">Description</label>
            <textarea type="text"  id='description' className='inputElement' rows={10} cols={40} value={description} onChange={handleOnChangeInput} onKeyDown={(e) => TabManager.enableTab(e)} required/>
        </div>

        <div className="button-container">
            <Button classname={modalType} onClick={handleUpdateOrCreateTodo}>
                {modalType}
            </Button>
            <Button classname='cancel' onClick={handleCancelTodo}>
                Cancel
            </Button>
        </div>
    </form>
  )
}

export default ModifyTodo
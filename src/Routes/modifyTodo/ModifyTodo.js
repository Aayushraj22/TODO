import React, {useState, useEffect} from 'react'
import './modifyTodo.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../../components/button/Button';
import { useNavigate, useParams } from 'react-router-dom';
import {db} from '../../firebase/config'
import { collection, addDoc, getDoc, doc, updateDoc } from 'firebase/firestore';

function ModifyTodo({modalType}) {

    const todoDocRef = useParams()?.id;
    const navigate = useNavigate();

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

    //  ............  function to check all fields are filled, to add newtodo user must provide title and description
    function checkFields(){
        if(title==='' | description===''){
            return false;
        }

        return true;
    }


    async function handleUpdateOrCreateTodo(e) {
        e.preventDefault();

        if(!checkFields()){
            toast.error('all fields are required')
            return ;
        }

        try {
            const uid = localStorage.getItem('uid');

            if(modalType === 'create'){
                
                const myNewTask = {...task, userDocRef: uid};

                // add new doc to the todoDocs collection in db
                const docRef = await addDoc(collection(db,'todoDocs'), myNewTask);

                // add the ref of document of newly created todoTask in the array of myTodos(property), which present as property in user doc
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

                // update the global state to render the new added todo

                // ........  yeh abhi krna hai    ............. ///

                // clear the data from component as data already store in db
                setTask({
                    userDocRef: '',
                    title: '',
                    description: '',
                })

                toast.success('Successfully Todo Created')
            }else { // update data in db
                await updateDoc(doc(db,'todoDocs', todoDocRef), {title, description, readingStatus:'pending'});
                toast.success('Successfully Todo Modified')
            }

            
        } catch (error) {
            console.log('error from modifytodo')
        }
        
    }

    function handleGoBack() {
        navigate(-1, { replace: 'true' });
      }



  return (
    <form className='modal-container'>
        <ToastContainer />
        <div className="form-icons">
            <span className='go-back' onClick={handleGoBack}>
                <i className="fa-solid fa-angle-left"></i>
                Back
            </span>
        </div>
        <div className="input-box">
            <label htmlFor="title">Title</label>
            <input type="text"  id='title' className='inputElement' value={title} onChange={handleOnChangeInput} required/>
        </div>

        <div className="input-box">
            <label htmlFor="description">Description</label>
            <textarea type="text"  id='description' className='inputElement' rows={10} cols={40} value={description} onChange={handleOnChangeInput} required/>
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
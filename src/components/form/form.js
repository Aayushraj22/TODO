import React,{useState} from 'react'
import './form.css'
import Button from '../button/Button'
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import { app, db } from '../../firebase/config';
import { useDispatch } from 'react-redux';
import {isAuthenticUser} from '../../Redux/authslice'
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, query, where, getDocs} from 'firebase/firestore';

function Form({formType='signup'}) {
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    })

    const {firstName, lastName, email, password} = formData;

    const handleToChangeInput = (e) => {
        const key = e.target.name;
        const value = e.target.value;
        setFormData({
            ...formData,
            [key]: value,
        })
    }

    function handleCloseAuthWindow(){
        handleGoBack();

        navigate('/')
    }

    function handleGoBack(){
        const formElement = document.querySelector('.form-container');
        formElement.classList.remove('isOpenZ4');
    }


    async function handleToSignUpWithEmailAndPassword(email, password){
        const auth = getAuth(app);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            // localStorage.setItem('uid', user?.uid);

            const newUserData = {
                email,
                password,
                photoURL: user.photoURL,
                uid: user.uid,
                firstName,
                lastName,
            }
            // store the user's data in the todoUsers collection db
            await addDoc(collection(db,'todoUsers'), newUserData);

            // move to home page after successfully signin
            return navigate('/');
        } catch (error) {
            console.log('error from signup page')
        }

        
        
    }

    async function handleToSignInWithEmailAndPassword(email, password) {
        const auth = getAuth(app);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            const uidQuery = query(collection(db, 'todoUsers'), where('uid', '==', uid));
            const querySnapshot = await getDocs(uidQuery);

            // no document present in todoUsers collection with uid === {uid}, this occurs because i'm sharing the userAuthentication with two application, so use the user which has signup using this application signup window
            if(querySnapshot.empty){
                console.log('this user had been signup through the other application signup window')
            }else{  
                querySnapshot.forEach(doc => {
                    localStorage.setItem('uid',doc.ref.id);
                    dispatch(isAuthenticUser(true))
                })

                // now move to the home page
                navigate('/')
            }
        } catch (error) {
            // show error message to the user
            if(error.code === 'auth/invalid-credential')
                console.log('error : ',error);
            else    // this will be problem other than wrong email and  password
                console.log(' and message : -> ', error.message)
        }

    }

    function customChecks(){
        // this check is only for signup as there user have to fill its firstname and lastname
        if(formType === 'signup' && !(firstName && lastName)){
            return false;
        }

        // this check is used in both condition, signin and signup
        if(email && password && password.length >= 6 ){
            return true;
        }

        return false;
    }

    function handleToGetAutherised(){

        if(!customChecks()){
            console.log('input fields are not provided properly')
            return; 
        }

        if(formType === 'signin'){
            handleToSignInWithEmailAndPassword(email, password);
        }else {
            handleToSignUpWithEmailAndPassword(email,password);
        }
    }



  return (
    <div className='form-container'>
        <div className="form">
            <div className="icons">
                <i className="fa-solid fa-xmark" onClick={handleCloseAuthWindow}></i>
            </div>
            <h1 style={{marginBottom: '1rem'}}>Fill the fields</h1>

            {formType==='signup' && <>
                <div className="input-fields">
                    <input type="text" name="firstName" placeholder='Firstname' value={firstName} onChange={handleToChangeInput} />
                </div>
                <div className="input-fields">
                    <input type="text" name="lastName" placeholder='Lastname' value={lastName} onChange={handleToChangeInput} />
                </div>
            </>}

            <div className="input-fields">
                <input type="email" name="email" placeholder='Email' value={email} onChange={handleToChangeInput}  />
            </div>
            <div className="input-fields">
                <input type="password" name="password" placeholder='Password' value={password} onChange={handleToChangeInput}  />
            </div>

            {/* {formType==='signup' && <>
                <div className="input-fields">
                    <input type="password" name="re-password"  />
                </div>
            </>} */}

            <Button onClick={handleToGetAutherised}>Submit</Button>
            <p onClick={handleGoBack} style={{cursor: 'pointer'}}>
                <i className="fa-solid fa-arrow-left fa-fade"></i> <span>Back</span>
            </p>

        </div>
    </div>
  )
}

export default Form
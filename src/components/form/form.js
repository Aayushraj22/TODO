import React, { useState } from 'react'
import './form.css'
import Button from '../button/Button'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { app, db } from '../../firebase/config';
import { useDispatch } from 'react-redux';
import { isAuthenticUser } from '../../Redux/authslice'
import { useNavigate, useLocation } from 'react-router-dom';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';

function Form() {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const location = useLocation();
    const formType = location.state.formType;


    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    })

    const { firstName, lastName, email, password } = formData;

    const handleToChangeInput = (e) => {
        const key = e.target.name;
        const value = e.target.value;
        setFormData({
            ...formData,
            [key]: value,
        })
    }

    // function handleCloseAuthWindow(){
    //     navigate('/', {replace: 'true'})
    // }

    function handleGoBack() {
        navigate(-1, { replace: 'true' });
    }


    async function handleToSignUpWithEmailAndPassword(email, password) {
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
            await addDoc(collection(db, 'todoUsers'), newUserData);

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

            // no document present in todoUsers collection with uid === {uid}, this occurs because i'm sharing the userAuthentication with two application, so use only those user which has signup using this application signup window
            if (querySnapshot.empty) {
                console.log('this user had been signup through the other application signup window')
            } else {
                querySnapshot.forEach(doc => {
                    localStorage.setItem('uid', doc.ref.id);
                    dispatch(isAuthenticUser(true))
                })

                // now move to the home page
                navigate('/')
            }
        } catch (error) {
            // show error message to the user
            if (error.code === 'auth/invalid-credential')
                console.log('error : ', error);
            else    // this will be problem other than wrong email and  password
                console.log(' and message : -> ', error.message)
        }

    }

    function customChecks() {
        // this check is only for signup as there user have to fill its firstname and lastname
        if (formType === 'signup' && !(firstName && lastName)) {
            return false;
        }

        // this check is used in both condition, signin and signup
        if (email && password && password.length >= 6) {
            return true;
        }

        return false;
    }

    function handleToGetAutherised(e) {
        e.preventDefault();

        if (!customChecks()) {
            console.log('input fields are not provided properly')
            return;
        }

        if (formType === 'signin') {
            handleToSignInWithEmailAndPassword(email, password);
        } else {
            handleToSignUpWithEmailAndPassword(email, password);
        }
    }



    return (
        <div className='form-container'>
            <div className="form-container-with-back-button">

                <div className="form-icons">
                    <span className='go-back' onClick={handleGoBack}>
                        <i className="fa-solid fa-angle-left"></i>
                        Back
                    </span>
                </div>
                <form className="form">
                    {/* <h1 style={{marginBottom: '1rem'}}>Fill the fields</h1> */}

                    {formType === 'signup' && <>
                        <div className="input-fields">
                            <input type="text" name="firstName" placeholder='Firstname' value={firstName} onChange={handleToChangeInput} title='FirstName' />
                        </div>
                        <div className="input-fields">
                            <input type="text" name="lastName" placeholder='Lastname' value={lastName} onChange={handleToChangeInput} title='LastName' />
                        </div>
                    </>}

                    <div className="input-fields">
                        <input type="email" name="email" placeholder='Email' value={email} onChange={handleToChangeInput} title='Enter your Email' />
                    </div>
                    <div className="input-fields">
                        <input type="password" name="password" placeholder='Password' value={password} onChange={handleToChangeInput} title='Enter your Password' autoComplete='current-password' />
                    </div>

                    {/* {formType==='signup' && <>
                <div className="input-fields">
                    <input type="password" name="re-password"  />
                </div>
            </>} */}

                    <div className="input-fields">
                        <Button onClick={handleToGetAutherised}>Submit</Button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default Form
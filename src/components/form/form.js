import React, { useState } from 'react'
import './form.css'
import Button from '../button/Button'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { app, db } from '../../firebase/config';
import { useDispatch, useSelector } from 'react-redux';
import { isAuthenticUser } from '../../Redux/authslice'
import { useNavigate, useLocation } from 'react-router-dom';
import { addDoc, collection, query, where, getDocs, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { toggleLoading } from '../../Redux/slice/loaderSlice';

function Form() {
    const isLoading = useSelector(state => state.loadingStatus);
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


    function handleGoBack() {
        navigate(-1, { replace: 'true' });
    }


    async function handleToSignUpWithEmailAndPassword(email, password) {
        // show the loader as user is getting signup
        dispatch(toggleLoading(true));

        const auth = getAuth(app);

        try {

            // checking that provided email is already used or not, because i want a unique email for all users
            const emailQuery = query(collection(db, 'todoUsers'), where('email','==',email));
            console.log('done 1')
            const docSnapShot = await getDocs(emailQuery);

            // if user with provided email already exits then suggests to go signin page or use other email to signup
            if(!docSnapShot.empty){
                dispatch(toggleLoading(false));
                toast.error('use other email Or SignIn using this Email');
                return;
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const newUserData = {
                email,
                password,
                photoURL: user.photoURL,
                uid: user.uid,
                firstName,
                lastName,
            }
            // add the user's data in the todoUsers collection db
            await addDoc(collection(db, 'todoUsers'), newUserData);

            // remove the loader
            dispatch(toggleLoading(false));

            //show the status message to user
            toast.success('Successfully SignUp');

            // move to signin page after successfully signin
            return navigate('/signin');
        } catch (error) {
            dispatch(toggleLoading(false));
            toast.error('SignUp failed, Try Again');
        }

    }

    async function handleToSignInWithEmailAndPassword(email, password) {
        // show the loader as user is getting signin
        dispatch(toggleLoading(true));

        const auth = getAuth(app);

        try {
            // checking whether a user is present with provided email or not
            const emailQuery = query(collection(db, 'todoUsers'), where('email','==',email));
            const docSnapShot = await getDocs(emailQuery);

            // if user with provided email does not exits then redirect to signup page
            if(docSnapShot.empty){
                dispatch(toggleLoading(false));
                toast.error('Register yourself before signin');
                setTimeout(() => {
                    navigate('/signin')
                }, 1000);

                return;
            }

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            const uidQuery = query(collection(db, 'todoUsers'), where('uid', '==', uid));
            const querySnapshot = await getDocs(uidQuery);

            // no document present in todoUsers collection with uid === {uid}, this occurs because i'm sharing the userAuthentication with two application, so use only those user which has signup using this application signup window
            if (querySnapshot.empty) {
                toast.error('use other email as email already used');
                return;
            } else {
                querySnapshot.forEach(doc => {
                    localStorage.setItem('uid', doc.ref.id);
                    dispatch(isAuthenticUser(true))
                })

                // remove the loader
                dispatch(toggleLoading(false));

                // show the success message
                toast.success('signIn Successfully')
                
                // now move to the home page
                navigate('/')
            }
        } catch (error) {
            // show error message to the user
            if (error.code === 'auth/invalid-credential'){
                toast.error('invalid Email or Password')
            }else{    // this will be problem other than wrong email and  password
                toast.error('SignIn Failed, Try Again');
            }
        }

    }

    function customChecks() {
        // this check is used in both condition, signin and signup
        if (!email | !password) {
            return 'all fields are required';
        }

        // this check is only for signup as there user have to fill its firstname and lastname
        if (formType === 'signup' && !(firstName && lastName)) {
            return 'all fields are required';
        }

        if(password.length < 6)
            return 'password should have atleast 6 char';

        return '';
    }

    function handleToGetAutherised(e) {
        e.preventDefault();

        // doing some small checks
        const message = customChecks();
        if(message){
            toast.error(message);
            return;
        }

        if (formType === 'signin') {
            handleToSignInWithEmailAndPassword(email, password);
        } else {
            handleToSignUpWithEmailAndPassword(email, password);
        }
    }



    return (
    <>
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
                        <input type="email" name="email" placeholder='Email' value={email} onChange={handleToChangeInput} title='your Email' />
                    </div>
                    <div className="input-fields">
                        <input type="password" name="password" placeholder='Password' value={password} onChange={handleToChangeInput} title='password should contains min 6 char' autoComplete='current-password' />
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
    </>
    )
}

export default Form
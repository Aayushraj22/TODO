import React from 'react'
import './signin.css'
import Button from '../../components/button/Button';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { isAuthenticUser } from '../../Redux/slice/authslice';
import { useDispatch } from 'react-redux';

function Signin() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    function handleCloseSignIn(){
        return navigate('/');
    }

    function handleGoToSignup(){
        return navigate('/signup');
    }

    function handleToOpenEmailWindow(){
        navigate('/withEmail', {state: {formType: 'signin'}})
    }

    async function handleSigninWithGoogle() {
        const provider = new GoogleAuthProvider();

        const auth = getAuth();
        signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            // const credential = GoogleAuthProvider.credentialFromResult(result);
            // const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            // ...

            // check weather user already our register user or not. if not then register it by using it some basic info like: name, email, password

            const emailQuery = query(collection(db,'todoUsers'),where('email', '==', user.email));
            const querySnapshot = getDocs(emailQuery);
            querySnapshot.then((data) => {
                // create a new user in the 'todoUser' collection
                if(data.empty){ 
                    const userName = user.displayName.split(' ');
                    const userData = {
                        email: user.email,
                        firstName:userName[0],
                        lastName: userName[1],
                        photoURL: user.photoURL,
                        uid: user.uid,
                    }
                    const userDocRef = addDoc(collection(db,'todoUsers'), userData);

                    dispatch(isAuthenticUser(true));
                    localStorage.setItem('uid',userDocRef.ref?.id);
                }else{  // user already exits in out todoUsers collection in db
                    data.forEach(doc => {
                        dispatch(isAuthenticUser(true));
                        localStorage.setItem('uid',doc.ref?.id);
                    })
                }
                navigate('/')
            })


          }).catch((error) => {
            // console.log('signin error');
            // Handle Errors here.
            const errorCode = error.code;
            console.log('errorCode : ',errorCode)
            // const errorMessage = error.message;
            // The email of the user's account used.
            // const email = error.customData.email;
            // The AuthCredential type that was used.
            // const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
            navigate('/signin')
          });
        
    }

  return (
    <div className='signin-container'>
        <div className="icons">
            <i className="fa-solid fa-xmark" onClick={handleCloseSignIn}></i>
        </div>
        <div className="text-body">
            Welcome Back.
        </div>

        <div className="several-links">
            <Button onClick={handleSigninWithGoogle}>
                <span >
                    <i className="fa-brands fa-google " style={{marginRight: '1rem'}}></i>
                    SignIn with Google
                </span>
            </Button>
            <Button onClick={handleToOpenEmailWindow}>
                <span >
                    <i className="fa-solid fa-envelope" style={{marginRight: '1rem'}}></i>
                    SignIn with Email
                </span>
            </Button>

        </div>

        <div className='msg-text'>
            No Account? &nbsp; 
            <span onClick={handleGoToSignup}>Create One</span>
        </div>
    </div>
  )
}

export default Signin
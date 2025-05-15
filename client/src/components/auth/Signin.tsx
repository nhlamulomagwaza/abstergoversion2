import toast from 'react-hot-toast';
import './auth.css';
import ScaleLoader from "react-spinners/ScaleLoader";

import { useState, useEffect } from 'react';

const Signup: React.FC = () => {

  const [toggleForms, setToggleForms] = useState<boolean>(true);
  const [username, setUsername] = useState<string>('arthurmendes');
  const [password, setPassword] = useState<string>('passkey1234');
  const [loading, setLoading] = useState(false);


  const [usernameValidateErrors, setUsernameValidateErrors] = useState<boolean>(false);
  const [passwordValidateErrors, setPasswordValidateErrors] = useState<boolean>(false);
  //const [globalValidateErrors, setGlobalValidateErrors]= useState<boolean>(false);


  useEffect(() => {
    if (username.length > 3) {
      setUsernameValidateErrors(false);

    }

    if (password.length > 6) {
      setPasswordValidateErrors(false);

    }
  }, [username, password,
    setUsernameValidateErrors,
    setPasswordValidateErrors]);


  function authenticationInputsValidation() {

    //USER VALIDATION


    if (!username.trim() && !password.trim()) {
      toast.error('Please fill in all fields');

      if (!username.trim()) {

        setUsernameValidateErrors(true)
      }

      if (!password.trim()) {

        setPasswordValidateErrors(true)
      }



    }



    if (!username.trim() || !password.trim()) {
      toast.error('Please fill in all fields');

      if (!username.trim()) {

        setUsernameValidateErrors(true)
      }

      if (!password.trim()) {

        setPasswordValidateErrors(true)
      }
      return;

    }




    if (username.length < 3) {

      toast.error('Username should be at least 3 characters');



      setUsernameValidateErrors(true);



      return;
    } else {


      setUsernameValidateErrors(false);
    }

    if (password.length < 6) {

      toast.error('Password should be at least 6 characters');
      setPasswordValidateErrors(true);
      return;
    } else {


      setPasswordValidateErrors(false);
    }

  }



  const handleRegister = async (e: React.FormEvent) => {

    e.preventDefault();

    //USER VALIDATION

    authenticationInputsValidation();

    //BACKEND COMMUNICATION LOGIC
    try {
      setLoading(true);
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (data.error) {

        throw new Error(data.error)
      }
      if (!res.ok) {

        toast.error(data.message)
      } else if (res.ok) {

        toast.success('Registered Successfully');

        setTimeout(() => {
          location.reload();
        }, 1000);

        // Store user object in local storage
        const existingUser = localStorage.getItem('abstergo-user');
        if (existingUser) {
          // Replace the existing 'abstergo-user' item
          const updatedUser = { ...JSON.parse(existingUser), };
          localStorage.setItem('abstergo-user', JSON.stringify(updatedUser));
        } else {
          // Set a new 'abstergo-user' item
          const newUser = data.user;
          localStorage.setItem('abstergo-user', JSON.stringify(newUser));
        }



        // Check if 'abstergo-accesstoken' exists in local storage
        const existingAccessToken = localStorage.getItem('abstergo-accesstoken');
        if (existingAccessToken) {
          // Replace the existing 'abstergo-accesstoken' item
          const updatedAccessToken = { ...JSON.parse(existingAccessToken), };
          localStorage.setItem('abstergo-accesstoken', JSON.stringify(updatedAccessToken));
        } else {
          // Set a new 'abstergo-accesstoken' item
          const newAccessToken = data.accessToken;
          localStorage.setItem('abstergo-accesstoken', JSON.stringify(newAccessToken));
        }

        setLoading(false)
      }


      //console.log(data)


    } catch (error: unknown) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }



  }
  const handleLogin = async (e: React.FormEvent) => {

    e.preventDefault();

    //USER VALIDATION
    authenticationInputsValidation();

    //BACKEND COMMUNICATION LOGIC
    try {
      setLoading(true);
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (data.error) {

        throw new Error(data.error)
      }
      if (!res.ok) {

        toast.error(data.message)
      } else if (res.ok) {

        toast.success('Logged In Successfully');

        setTimeout(() => {
          location.reload();
        }, 1000);

        const existingUser = localStorage.getItem('abstergo-user');
        if (existingUser) {
          // Replace the existing 'abstergo-user' item
          const updatedUser = { ...JSON.parse(existingUser), };
          localStorage.setItem('abstergo-user', JSON.stringify(updatedUser));
        } else {
          // Set a new 'abstergo-user' item
          const newUser = data.user;
          localStorage.setItem('abstergo-user', JSON.stringify(newUser));
        }

        // Check if 'abstergo-accesstoken' exists in local storage
        const existingAccessToken = localStorage.getItem('abstergo-accesstoken');
        if (existingAccessToken) {
          // Replace the existing 'abstergo-accesstoken' item
          const updatedAccessToken = { ...JSON.parse(existingAccessToken), };
          localStorage.setItem('abstergo-accesstoken', JSON.stringify(updatedAccessToken));
        } else {
          // Set a new 'abstergo-accesstoken' item
          const newAccessToken = data.accessToken;
          localStorage.setItem('abstergo-accesstoken', JSON.stringify(newAccessToken));
        }


        setLoading(false)
      }


      //console.log(data)


    } catch (error: unknown) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }



  }





  return (
    <>


      <div className="sign-in-content">



        {toggleForms ? (
          <div className="sign-in-container">

            <h2 className="sign-in-title">Sign In</h2>
            <div className="sign-in-cta">please sign with your credentials to continue to our app</div>


            <form className="sign-in-form" onSubmit={handleLogin}>

              <input type="text" placeholder="Username"
                value={username} onChange={(e) => setUsername(e.target.value)}

                style={usernameValidateErrors ? { backgroundColor: '#ffaea8', border: '1px solid #ff2626' } : { backgroundColor: 'white' }}

              />
              <input type="password" placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={passwordValidateErrors ? { backgroundColor: '#ffaea8', border: '1px solid #ff2626' } : { backgroundColor: 'white' }}

              />
              <button type="submit" className='sign-in-btn'>{loading ? <ScaleLoader className='loader' color='white' height={10} /> : 'Sign In'}</button>
            </form>

            <div className="new-user"><p>new to abstergo? <a className='sign-up-link' onClick={() => setToggleForms(!toggleForms)}> register here </a></p></div>
            <div className="demo-account-details">

              <div className="demo-header">

                <h1 className="demo-title">Demo Account</h1>
                <p className="demo-user">username: arthurmendes</p>
                <p className="demo-pin">password: passkey1234</p>
              </div>
            </div>


          </div>
        ) :

          <div className="sign-in-container">

            <h2 className="sign-in-title">Sign Up</h2>
            <div className="sign-in-cta">register with your fancy username and unique password</div>


            <form className="sign-in-form" onSubmit={handleRegister}>

              <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}
                style={usernameValidateErrors ? { backgroundColor: '#ffaea8', border: '1px solid #ff2626' } : { backgroundColor: 'white' }}


              />
              <input type="password" placeholder="Password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={passwordValidateErrors ? { backgroundColor: '#ffaea8', border: '1px solid #ff2626' } : { backgroundColor: 'white' }}

              />
              <button type="submit" className='sign-in-btn' >{loading ? <ScaleLoader className='loader' color='white' height={10} /> : 'Sign Up'}</button>
            </form>

            <div className="new-user"><p>already have an account? <a className='sign-up-link' onClick={() => setToggleForms(!toggleForms)}> sign in here </a></p></div>

          </div>


        }
      </div>


    </>
  )
}

export default Signup
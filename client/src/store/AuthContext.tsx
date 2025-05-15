//IMPORTS

import React, {Dispatch, SetStateAction, useState } from "react";
import toast from 'react-hot-toast';
export const AbstergoAuthContext= React.createContext({});


//TYPES
export interface User {
  _id: string;
  username: string;
 
}

export interface AuthContextTypes {
  authUser: User | null;
  setAuthUser: Dispatch<SetStateAction<User | null>>;
  logoutUser: ()=> void;
  authUserToken: string;
}

const AuthContext = ({children}: React.PropsWithChildren) => {
  

    //VARIABLES AND STATES
    const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem('abstergo-user') as string) || null);
    const [authUserToken, setAuthUserToken] = useState(JSON.parse(localStorage.getItem('abstergo-accesstoken') as string ) || null);

   


    //This function logouts the user
    const logoutUser = ():void => {


     const confirmLogout= confirm('Are you sure you want to logout?');


     if(confirmLogout){

    

      localStorage.removeItem("abstergo-user");
    localStorage.removeItem('abstergo-accesstoken')
      toast.success("Logged Out Successfully");
  
      setTimeout(() => {
        location.reload();
      }, 1500);  } else{

        return;
      }
    };

  return (
   <AbstergoAuthContext.Provider 
   value={{authUser, setAuthUser, authUserToken,
    setAuthUserToken, logoutUser}}>
    {children}
   </AbstergoAuthContext.Provider>
  )
}

export default AuthContext
//IMPORTS

import React, {useState, Dispatch, SetStateAction} from "react";
export const AbstergoGeneralContext=React.createContext({});

//TYPES
export interface GeneralContextTypes{


    showProfile: boolean;
    setShowProfile: Dispatch<SetStateAction<boolean>>;
}

const GeneralContext = ({children}: React.PropsWithChildren) => {

    //VARIABLES AND STATES
    const [showProfile, setShowProfile]= useState<boolean>(false);
    const [showNavbar, setShowNavbar]= useState(false);


  return (
    
    <AbstergoGeneralContext.Provider value={{showProfile, setShowProfile,
     showNavbar, setShowNavbar}}>

        {children}
    </AbstergoGeneralContext.Provider>
  )
}

export default GeneralContext
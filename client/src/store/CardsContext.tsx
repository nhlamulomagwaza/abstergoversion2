//IMPORTS

import React, {useState, Dispatch, SetStateAction, useEffect, useContext} from "react";
import { AbstergoAuthContext, AuthContextTypes } from "./AuthContext";
export const AbstergoCardContext=React.createContext({});



//TYPES

export interface SingleCardType {
    _id: string;
    cardTitle: string;
    description:string;
  
  }
  
  export interface CardsContextTypes {
    cards: SingleCardType[];
    
    setSelectedCard: Dispatch<SetStateAction<SingleCardType | null>>;
    loadingcards:boolean;
    setLoadingcards:Dispatch<SetStateAction<boolean>>;
    setCreateCardClose: Dispatch<SetStateAction<boolean>>;
    cardTitle: SingleCardType;
    
    createCardClose:boolean;
    cardDescription:string;
    setCardDescription:Dispatch<SetStateAction<string>>;
    subtasks: []
    setSubtasks: Dispatch<SetStateAction<string[]>>;
    setCardTitle: Dispatch<SetStateAction<string>>;
    
  }




const CardsContext = ({children}: React.PropsWithChildren) => {
    

    //VARIABLES AND STATES
    const [cardTitle, setCardTitle]= useState<string>('');
    const [loadingcards, setLoadingcards]= useState<boolean>(false);
    const [cards, setcards]= useState([]);
    const [selectedcard, setSelectedcard] = useState<SingleCardType | null>(cards?.[0] ?? null);    
    const [createCardClose, setCreateCardClose]= useState<boolean>(false);
   // const {authUserToken}= useContext(AbstergoAuthContext) as AuthContextTypes;
    const [subtasks, setSubtasks] = useState<string[]>([]);
    const [cardDescription, setCardDescription]= useState<string>('');


    //USE EFFECTS
     

    //This use effect fetches all cards from the api
   /*  useEffect(() => {
        const fetchAllcards= async()=>{
  
          try {
            setLoadingcards(true);
            const response = await fetch(`/cards/`, {
              
              method: "GET",
              headers:{
  
                Authorization: `Bearer ${authUserToken}`,
              }
            });
  
            if (!response.ok) {
              throw new Error("Failed to fetch cards");
            }
            const data = await response.json();
           
         
            setcards(data)
            setLoadingcards(false);
          } catch (error) {
            console.error("Error fetching jobs:", error);
          }
        
        };
    fetchAllcards()
    }, [])  
 */
    
  /* 
    This useEffect assigns the first card in the cards array to the
     selectedcards variable, the idea behind this is so that the client
     is populated with a default card instead of a blank display */
   /*  useEffect(() => {
        if (cards.length > 0) {
          setSelectedcard(cards[0]);
        }
      }, [cards]);
 */

  return (
    <AbstergoCardContext.Provider 
    value={{cardTitle, setCardTitle, loadingcards,
            cards, setcards, selectedcard,
             setSelectedcard, setLoadingcards,
             createCardClose, setCreateCardClose,
             subtasks, setSubtasks, cardDescription,
              setCardDescription
    }}>
{children}

    </AbstergoCardContext.Provider>
  )
}

export default CardsContext
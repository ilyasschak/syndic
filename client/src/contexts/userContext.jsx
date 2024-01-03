import { createContext, useState, useContext, useEffect } from "react";

export const UserContext = createContext({});

export function UserContextProvider({children}){
    const [userContext , setUserContext] = useState(()=>{
        const localStorageData = localStorage.getItem("user");
        return localStorageData ? JSON.parse(localStorageData) : {};
    });
        
    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(userContext));
    }, [userContext]);
    
    return (
        <UserContext.Provider value={{userContext, setUserContext}}>
            {children}
        </UserContext.Provider>
    )

}

export function useUser() {
    return useContext(UserContext);
}
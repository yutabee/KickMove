import { onAuthStateChanged } from "firebase/auth";
import { createContext, useCallback, useEffect, useState } from "react";
import { auth } from "../firebase";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [currentUser , setCurrentUser] = useState(null);

     useEffect(() => {
         onAuthStateChanged(auth, (currentUser) => {
            setCurrentUser({
                email: currentUser.email,
                uid: currentUser.uid,
            })
     });
     // eslint-disable-next-line
     }, []);
    
    const signout = useCallback(async () => {
        await auth.signOut()
        // auth.onAuthStateChanged(user => setCurrentUser(user))
    }, []);

    return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser , signout }}>
      {children}
    </AuthContext.Provider>   
    )
}
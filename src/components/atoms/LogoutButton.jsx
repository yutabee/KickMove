import { Button } from '@mui/material';
import React, { memo, useCallback, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../provider/AuthProvider';



export const LogoutButton = memo(() => {
  const { setCurrentUser ,signout } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = useCallback(async() => {
    signout();
    setCurrentUser(null);
    navigate('/login');
  // eslint-disable-next-line
  }, []);
  

  return (
      <Button  
          sx={{
              color: '#2C3333', backgroundColor: ' #f4fbf9', fontWeight: 'bold', }}
          onClick={() => handleLogout()}
      >
        ログアウト
      </Button>
  ); 
})
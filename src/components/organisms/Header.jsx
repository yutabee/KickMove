import React, { memo, useContext } from 'react'
import styled from 'styled-components'
import { AuthContext } from '../../provider/AuthProvider';
import { LogoutButton } from '../atoms/LogoutButton';

export const Header = memo(() => {
const { currentUser } = useContext(AuthContext);

  return (
    <SHeader>
        <SLogoBox>
            <SLogo>
            KickMove
            </SLogo>
        </SLogoBox> 
        <SRightBox>
            {currentUser ? (<LogoutButton/>) : (null)}
        </SRightBox>
    </SHeader>
  )
})

const SHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #395B64;
    height: 70px;
`

const SLogoBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    margin-left: 20px;
`

const SLogo = styled.p`
    font-weight: bold;
    font-size: 30px;
    color:  #f4fbf9;
`

const SRightBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    margin-right: 20px;
`


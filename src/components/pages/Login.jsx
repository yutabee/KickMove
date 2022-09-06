import { Button, Input } from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { auth } from '../../firebase';
import { Header } from '../organisms/Header';


export const Login = () => {
  const [email, setEmail] = useState('');
  const [ password , setPassword ] = useState('');

  const navigate = useNavigate();

  //email
  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  //password
  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //handle Login
    await signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      }).finally(() => {
        console.log('login success!')
        setPassword('');
        setEmail('');
        navigate('/');
      });  
  };


    return (
    <>
    <Header/>
    <SBox>
      <SFormBox>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <SLabel>メールアドレス</SLabel>
          <Input
            name="email"
            type="email"
            placeholder="email"
            onChange={(e) => handleChangeEmail(e)}  
          />
        </div>
        <div>
          <SLabel>パスワード</SLabel>
          <Input 
            name="password"
            type="password"
            placeholder="password"
            onChange={(e) => handleChangePassword(e)}
          />
        </div>
        <div>
          <Button
            variant='outlined'
            type='submit'              
            sx={{ marginTop:'20px' }}
          >ログイン
          </Button>
        </div>
        </form>
        <Link to='/signup'>新規登録はこちら</Link>
      </SFormBox>
    </SBox>
    </>
  );
};

const SBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 70px);
`

const SLabel = styled.p`
  margin-bottom: 5px;
  color: gray;
`

const SFormBox = styled.div`
  border: 1px solid black;
  padding: 20px;
  border-radius: 8px;
`
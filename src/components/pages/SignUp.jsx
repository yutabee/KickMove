import { Button, Input } from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { auth } from '../../firebase';


export const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
    // console.log(e.target.value);
  };
  const handleChangePassword = (e) => {
    setPassword(e.target.value);
    // console.log(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createUserWithEmailAndPassword(auth, email, password)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      }).finally(() => {
        console.log('user created success!');
        setPassword('');
        setEmail('');
        navigate('/');
      });
  };


  return (
    <SBox>
      <SFormBox>
      <h2>SignUp</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <SLabel>メールアドレス</SLabel>
          <Input
            name="email"
            type='email'
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
            >
          登録
          </Button>
        </div>
        </form>
        <Link to='/login'>ログインはこちら</Link>
      </SFormBox>
    </SBox>
  );
};

const SBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
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
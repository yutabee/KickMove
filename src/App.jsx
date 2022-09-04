import './App.css';
import { SignUp } from './components/pages/SignUp';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from './components/pages/Home';
import { Page404 } from './components/pages/Page404';
import { Login } from './components/pages/Login';
import { AuthProvider } from './provider/AuthProvider';


function App() {
  
  return (
    <Router>
       <AuthProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='signup' element={<SignUp />} />
          <Route path='login' element={<Login/>} />
          <Route path='*' element={<Page404/>} />
        </Routes>
      </AuthProvider>
    </Router>
   
  );
}

export default App;

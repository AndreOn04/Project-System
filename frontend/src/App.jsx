import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" exact element={<Root />} />
          <Route path="/dashboard" exact element={<Home />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/signup" exact element={<Signup />} />
        </Routes>
      </Router>
    </div>
  )
}

//Defina o componente raiz para manipular o redirecionamento inicial
const Root = () => {
  // Verificando se o token existe no LocalStorage
  const isAuthenticated = !!localStorage.getItem("token");

  // Redirecionar para a página se autenticado, caso contrário, para efetuar login
  return isAuthenticated ? (
    <Navigate  to='/dashboard' />
  ) : (
    <Navigate to='/login' />
  );

}

export default App
import logo from './logo.svg';
import './App.css';
import Home from './pages/Home/Home.jsx'
import {Routes,Route} from 'react-router-dom'
function App() {
  return (
    <div>
      <Routes>
        <Route path = '/' element={<Home/>}/>
      </Routes>
    </div>
  );
}

export default App;

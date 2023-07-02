import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Index from './pages/Index'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Index />
      </BrowserRouter>      
    </div>
  );
}

export default App;

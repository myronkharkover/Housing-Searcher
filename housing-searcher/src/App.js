import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from './Home';
import { Location } from './Location';
import { Navbar } from './Navbar';
import Login from './Login';
import SearchResults from './SearchResults';
import Profile from './Profile';
import Signup from './Signup';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/location" element={<Location />} />
          <Route path="/login" element={<Login />} />
          <Route path="/searchresults" element={<SearchResults />} />
          <Route path="/profile" element={<Profile />}/>
          <Route path="/signup" element={<Signup />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

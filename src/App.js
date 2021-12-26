import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";


import Navbar from './components/Navbar'
import HeroPage from './components/HeroPage';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';

import { store } from './store'
import { Provider } from 'react-redux'
import ProfilePage from './components/ProfilePage';

function App() {


  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <Routes >
            <Route path="/" element={<HeroPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
          </Routes >
        </div>
      </Router>
    </Provider>
  );
}

export default App;

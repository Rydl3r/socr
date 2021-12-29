import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";


import Navbar from './components/Navbar'
import HeroPage from './components/HeroPage';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import ProfilePage from './components/ProfilePage';
import FriendsRequestPage from './components/FriendsRequestPage';

import { store } from './store'
import { Provider } from 'react-redux'
import MyProfilePage from './components/MyProfilePage';
import MyRequestsPage from './components/MyRequestsPage';
import AddPostPage from './components/AddPostPage';


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
            <Route path="/requests" element={<FriendsRequestPage />} />
            <Route path="/myprofile" element={<MyProfilePage />} />
            <Route path="/myrequests" element={<MyRequestsPage />} />
            <Route path="/addpost" element={<AddPostPage />} />
          </Routes >
        </div>
      </Router>
    </Provider>
  );
}

export default App;

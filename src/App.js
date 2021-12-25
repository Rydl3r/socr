import {
  HashRouter as Router,
  Routes,
  Route
} from "react-router-dom";


import Navbar from './components/Navbar'
import HeroPage from './components/HeroPage';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useSelector } from 'react-redux'

function App() {
  const themeMode = useSelector((state) => state.theme.value)
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
    },
  });


  return (

    <Router>
      <ThemeProvider theme={themeMode === "light" ? lightTheme : darkTheme}>
        <div className="App">
          <Navbar />
          <Routes >
            <Route path="/" element={<HeroPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Routes >
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;

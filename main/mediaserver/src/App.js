import FileUploadSingle from './Components/FileUploadSingle';
import FileUploadMultiple from './Components/FileUploadMultiple';
import NavBar from './Components/NavBar';
import Main from './Components/Main';
import './App.css';
import APIProvider from './Contexts/APIProvider';
import { ThemeProvider, createTheme} from '@mui/material/styles';
import NavProvider from './Contexts/NavProvider';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
    palette: {
        mode: 'dark'
    }
})

const lightTheme = createTheme({
    palette: {
        mode: 'light'
    }
})

const App = () => {
    return(
        <APIProvider>
            <ThemeProvider theme={darkTheme}>
                <NavProvider>
                    <CssBaseline />
                    <NavBar/>
                    <Main/>
                </NavProvider>
            </ThemeProvider>
        </APIProvider>
    );
}

export default App;

import { createTheme } from '@mui/material'

const theme = createTheme({
    palette: {
        primary: {
            main: '#3E00FF',
            contrastText: '#F5ECEF'
        },
        secondary: {
            main: '#0E0E52',
            contrastText: '#F5ECEF'
        }
    },
    typography: {
        fontFamily: "Inter, sans-serif"
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap')`
        }
    }

});

export default theme
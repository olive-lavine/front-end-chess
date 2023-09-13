import React, {useState} from 'react';
import { Grid, Box, FormControl, InputLabel, MenuItem, Select, Card, CardContent, Typography } from '@mui/material';
import { Chessboard } from "react-chessboard";
import { useSettingsContext } from '../contexts/SettingsContext';


function Settings() {
    const { colorTheme, setColorTheme, theme, setTheme, sound, setSound, soundChoice, setSoundChoice } = useSettingsContext();

    // const [colorTheme, setColorTheme] = useState({
    //     light: { backgroundColor: "rgb(235, 234, 232)" },
    //     dark: { backgroundColor: "rgb(125, 172, 189)" },
    //     drop: { boxShadow: "inset 0 0 1px 4px rgb(218, 197, 165)" },
    //     sound: "",
    // }); 
    // const [theme, setTheme] = useState('blue');
    // const [sound, setSound] = useState('');
    // const [soundChoice, setSoundChoice] = useState('none'); 



    function handleThemeChange(event) {
        const theme = event.target.value;
        const themes = {
            blue: {
            light: { backgroundColor: "rgb(235, 234, 232)" },
            dark: { backgroundColor: "rgb(125, 172, 189)" },
            drop: { boxShadow: "inset 0 0 1px 4px rgb(218, 197, 165)" },
            },
            classic: {
            light: { backgroundColor: "rgb(240, 217, 181)" },
            dark: { backgroundColor: "rgb(181, 136, 99)" },
            drop: { boxShadow: "inset 0 0 1px 4px rgb(239,239,239)" },
            },
            green: {
            light: { backgroundColor: "rgb(238,238,210)" },
            dark: { backgroundColor: "rgb(118,150,86)"},
            drop: { boxShadow: "inset 0 0 1px 4px rgb(214, 214, 165)" },
            }
        };
    
        setColorTheme(themes[theme]);
        setTheme(theme);
    }

    function handleSoundChange(event) {
        const selectedSound = event.target.value;
        setSoundChoice(selectedSound);
        if (selectedSound === 'none'){
            setSound('')
        }else {
            const soundPaths = {
                wood: 'wood.mp3',
                glass: 'glass.mp3',
                space: 'space.mp3',
                };
        
            if (soundPaths.hasOwnProperty(selectedSound)) {
            const soundPath = `${process.env.PUBLIC_URL}/assets/sounds/${soundPaths[selectedSound]}`;
            
            const audio = new Audio(soundPath);
            audio.play();
        
            setSound(soundPath);
            }
        }
    }

    return (
    <Grid container pt={18} >
        <Card variant="outlined" sx={{ width: '300px' }}>
        <CardContent>
            <Box textAlign="center" mb={3}>
            <Typography variant="h5" gutterBottom>
                Settings
            </Typography>
            </Box>
            <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Colors</InputLabel>
            <Select onChange={handleThemeChange} value={theme} label="Colors">
                <MenuItem value="blue">Blue</MenuItem>
                <MenuItem value="classic">Classic</MenuItem>
                <MenuItem value="green">Green</MenuItem>
            </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Board Sounds</InputLabel>
            <Select onChange={handleSoundChange} value={soundChoice} label="Sounds">
                <MenuItem value="none">None</MenuItem>
                <MenuItem value="wood">Wood</MenuItem>
                <MenuItem value="glass">Glass</MenuItem>
                <MenuItem value="space">Space</MenuItem>
            </Select>
            </FormControl>
        <Chessboard
            customDarkSquareStyle={colorTheme.dark}
            customLightSquareStyle={colorTheme.light}
            customDropSquareStyle={colorTheme.drop}
            />
        </CardContent>
        </Card>
        </Grid>
    );
}

export default Settings;

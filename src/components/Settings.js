import React, {useState} from 'react';
import { Grid, Box, FormControl, InputLabel, MenuItem, Select, Card, CardContent, Typography } from '@mui/material';

function Settings() {
    const [theme, setTheme] = useState('blue'); // Initialize theme state

    function handleThemeChange(event) {
    const selectedTheme = event.target.value;
    // Update theme state and perform any other necessary actions
    setTheme(selectedTheme);
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
              {/* Add more color options here */}
            </Select>
            </FormControl>
          {/* Add other settings options here */}
        </CardContent>
        </Card>
        </Grid>
    );
}

export default Settings;

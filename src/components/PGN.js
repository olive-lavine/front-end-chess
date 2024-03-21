import React from 'react';
import { Box, Typography } from '@mui/material';

const PGN = ({ pgn }) => {
    const moves = pgn.split(/\d+\./).filter(move => move.trim() !== '');

    const formattedMoves = moves.map((move, index) => {
        const parts = move.trim().split(' ')
        return (
            <Typography key={index} sx={{ fontWeight: 'medium', m: 1 }}>
                {`${index + 1}.`} {parts.map((part, i) => <span key={i} style={{ marginLeft: '1em' }}>{part}&nbsp;</span>)}            
            </Typography>
        );
    });
    

    return (
        <Box sx={{ maxHeight: `300px`, overflowY: 'auto' }}>
            {formattedMoves}
        </Box>
    );
};

export default PGN;

import React, { useState } from "react"
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import RedoIcon from '@mui/icons-material/Redo';
import { styled } from '@mui/material/styles'; // Import the styled function

import { IconButton, Typography } from '@mui/material';

const RingButtons = ({ moves, handleClick }) => {
  const [showMoves, setShowMoves] = useState(true); // State to track if moves are shown


  const GradientIconButton = styled(IconButton)(({ theme, index }) => {
    const alpha = 1 - index * 0.1; // Calculate the alpha value dynamically
    const color = `rgba(125, 172, 189, ${alpha})`;
    return {
      position: 'absolute',
      width: '50px',
      backgroundColor: color, // Set the background color
      transform: `rotate(${(index * 360) / moves.length}deg) translateY(-90px) rotate(-${(index * 360) / moves.length}deg)`,
      borderRadius: '50%', // Make the button circular
    };
  });


  return (
    <Paper elevation={1} 
      sx={{
        position: 'relative',
        width: '180px',
        height: '180px',
        borderRadius: '50%', // Makes the paper a circle
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: "#DFDBD3"

      }}
    > 
    <Button onClick={() => setShowMoves(!showMoves)}>Top Moves</Button>
      {showMoves && moves.map((move, index) => (
        <GradientIconButton
          key={index}
          index={index}
          onClick={() => handleClick(move.uci)}
        >
          {move.san.toUpperCase()}
        </GradientIconButton>
      ))}
    </Paper>
  );
};

export default RingButtons;
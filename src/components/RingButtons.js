import React, { useState } from "react";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import RedoIcon from "@mui/icons-material/Redo";
import { styled } from "@mui/material/styles"; // Import the styled function

import { IconButton, Typography } from "@mui/material";

const RingButtons = ({ moves, handleClick, showMoves, colors }) => {
  const GradientIconButton = styled(IconButton)(({ index }) => {
    const alpha = 1 - index * 0.1; // Calculate the alpha value dynamically
    const color = `rgba(${colors}, ${alpha})`;
    return {
      position: "absolute",
      width: "78px",
      height: "78px",
      backgroundColor: color,
      transform: `rotate(${(index * 360) / moves.length}deg) translateY(-90px) rotate(-${(index * 360) / moves.length}deg)`,
      borderRadius: "50%",
      fontSize: "18px",
      color: "whitesmoke",
      fontWeight: "bold",
    };
  });

  return (
    <Box padding={6}>
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          width: "180px",
          height: "180px",
          borderRadius: "50%", // Makes the paper a circle
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // bgcolor: "#DFDBD3",
        }}
      >
        Top Moves
        {showMoves &&
          moves.map((move, index) => (
            <GradientIconButton
              key={index}
              index={index}
              variant="contained"
              onClick={() => handleClick(move.uci)}
            >
              {move.san}
            </GradientIconButton>
          ))}
      </Paper>
    </Box>
  );
};

export default RingButtons;

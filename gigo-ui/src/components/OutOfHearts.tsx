import React from 'react';
import { Box, Typography, Button, Modal, Grid } from '@mui/material';
import HeartDisabledIcon from '@/icons/HeartDisabledIcon';
import { DailyHearts } from '@/models/dailyHearts';

interface Props {
  open: boolean;
  onClose: () => void;
  onGoPro: () => void;
}

const OutOfHearts = ({ open, onClose, onGoPro }: Props) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(15px)',
        outline: 'none !important',
        border: 'none !important',
      }}
    >
      <Box sx={{
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
          Out of Hearts!
        </Typography>
        <Typography variant="caption" sx={{ mb: 2, fontWeight: 'regular' }}>
          Hearts Refill Tomorrow 12:01 AM
        </Typography>
        <Grid container spacing={1} sx={{ mb: 2, justifyContent: 'center' }}>
          {/* Display heart icons in a grid */}
          {Array.from({ length: DailyHearts }).map((_, index) => (
            <Grid item key={index}>
              <HeartDisabledIcon sx={{ fontSize: 40 }} />
            </Grid>
          ))}
        </Grid>
        <Typography variant="h6" sx={{ mb: 3, textAlign: 'center' }}>
          You`&apos;`ve used all your hearts for today.<br/>
          Go Pro to get unlimited Journeys & Bytes!
        </Typography>
        <Button variant="contained" color="primary" onClick={onGoPro} sx={{ mb: 2 }}>
          Go Pro Now!
        </Button>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default OutOfHearts;

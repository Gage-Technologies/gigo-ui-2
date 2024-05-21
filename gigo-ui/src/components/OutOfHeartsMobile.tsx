import React from 'react';
import { Box, Typography, Button, Modal, Grid, PaletteMode, createTheme } from '@mui/material';
import HeartDisabledIcon from '@/icons/HeartDisabledIcon';
import { DailyHearts } from '@/models/dailyHearts';
import { getAllTokens } from '@/theme';

interface Props {
  open: boolean;
  onClose: () => void;
  onGoPro: () => void;
}

const OutOfHeartsMobile = ({ open, onClose, onGoPro }: Props) => {
  const userPref = localStorage.getItem('theme')
  const [mode, setMode] = React.useState<PaletteMode>(userPref === 'light' ? 'light' : 'dark');
  const theme = React.useMemo(() => createTheme(getAllTokens(mode)), [mode]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        outline: 'none !important',
        border: 'none !important',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      }}
    >
      <Box sx={{
        bgcolor: theme.palette.background.default + "25",
        boxShadow: 24,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backdropFilter: "blur(2.8px)",
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
        <Typography variant="h6" sx={{ mb: 3, textAlign: 'center', fontSize: "0.7em" }}>
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

export default OutOfHeartsMobile;

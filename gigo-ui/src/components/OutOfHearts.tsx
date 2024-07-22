import React from 'react';
import { Box, Typography, Button, Modal, Grid, Tooltip } from '@mui/material';
import HeartDisabledIcon from '@/icons/HeartDisabledIcon';
import { DailyHearts } from '@/models/dailyHearts';
import { useAppSelector } from '@/reducers/hooks';
import { selectAuthState } from '@/reducers/auth/auth';
import CheckIcon from '@mui/icons-material/Check';
import { theme } from '@/theme';

interface Props {
  open: boolean;
  onClose: () => void;
  onGoPro: () => void;
}

const OutOfHearts = ({ open, onClose, onGoPro }: Props) => {
  const [referralTriggered, setReferralTriggered] = React.useState(false);
  const [openTooltip, setOpenTooltip] = React.useState(false);
  const authState = useAppSelector(selectAuthState);

  const handleReferralButtonClick = async () => {
    try {
      await navigator.clipboard.writeText(`https://gigo.dev/referral/${encodeURIComponent(authState.userName)}`);
      setOpenTooltip(true);
      setTimeout(() => {
        setOpenTooltip(false);
      }, 2000); // tooltip will hide after 2 seconds
    } catch (err) {
      console.error('failed to copy text: ', err);
    }
  };

  // prevent modal from closing when clicking outside or pressing esc
  const handleClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
      onClose();
    }
  };

  const renderOutOfHearts = () => {
    return (
      <>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
          Out of Hearts!
        </Typography>
        <Typography variant="caption" sx={{ mb: 2, fontWeight: 'regular' }}>
          Hearts Refill Tomorrow 12:01 AM
        </Typography>
        <Grid container spacing={1} sx={{ mb: 2, justifyContent: 'center' }}>
          {Array.from({ length: DailyHearts }).map((_, index) => (
            <Grid item key={index}>
              <HeartDisabledIcon sx={{ fontSize: 40 }} />
            </Grid>
          ))}
        </Grid>
        <Typography variant="h6" sx={{ mb: 3, textAlign: 'center' }}>
          You&apos;ve used all your hearts for today.<br />
          Go Pro to get unlimited Journeys & Bytes!
        </Typography>
        <Button variant="contained" color="primary" onClick={onGoPro} sx={{ mb: 2 }}>
          Go Pro Now!
        </Button>
        <Button variant="outlined" onClick={() => setReferralTriggered(true)}>
          Close
        </Button>
      </>
    )
  }

  const renderReferral = () => {
    return (
      <>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
          Get a Free Month of Pro Max
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
          For every friend you refer!<br/>
          No credit card required
        </Typography>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          mb: 2
        }}>
          <Tooltip
            open={openTooltip}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            title={
              <React.Fragment>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  Referral Link Copied
                  <CheckIcon sx={{color: theme.palette.success.main, ml: 1}}/>
                </div>
              </React.Fragment>
            }
            placement="top"
            arrow
          >
            <Button variant="contained" onClick={handleReferralButtonClick}>
              Copy Referral Link
            </Button>
          </Tooltip>
        </Box>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </>
    )
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
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
        {!referralTriggered ? renderOutOfHearts() : renderReferral()}
      </Box>
    </Modal>
  );
};

export default OutOfHearts;

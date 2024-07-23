import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Modal, Grid, TextField, Tooltip } from '@mui/material';
import HeartDisabledIcon from '@/icons/HeartDisabledIcon';
import { DailyHearts } from '@/models/dailyHearts';
import config from "@/config";
import HeartIcon from '@/icons/HeartIcon';
import swal from "sweetalert";
import { useAppSelector } from '@/reducers/hooks';
import { selectAuthState } from '@/reducers/auth/auth';
import CheckIcon from '@mui/icons-material/Check';
import { theme } from '@/theme';
import { usePathname} from 'next/navigation';



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

  const [reportPopup, setReportPopup] = React.useState(false)
  const [show, setShow] = useState(false);
  const textFieldRef = React.useRef();
  let pathname = usePathname();

  // prevent modal from closing when clicking outside or pressing esc
  const handleClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
      onClose();
    }
  };
  

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


  const reportIssueMemo = React.useMemo(() => (
    <Box
        sx={{
            width: "40vw",
            height: "40vh",
            justifyContent: "center",
            marginLeft: "30vw",
            marginTop: "30vh",
            outlineColor: "black",
            borderRadius: 2,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1);",
            backgroundColor: theme.palette.background.default,
        }}
    >
        <div
            style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                height: "100%",
            }}
        >
            <Typography variant="h5"
                component="h2"
                align="center"
                style={{
                    marginTop: "-10px",
                    marginBottom: "10px",
                    color: theme.palette.text.primary,
                }}>
                How can we improve?
            </Typography>
            <Box sx={{ 
              backgroundColor: '#3f3f3f', 
              borderRadius: '16px', 
              padding: '16px',
              mb: 2,
              width: '20vw',
              height: 'auto',
              border: '1px solid ' + theme.palette.text.primary,
            }}>
              <Grid container spacing={1} sx={{ justifyContent: 'center' }}>
                {Array.from({ length: DailyHearts }).map((_, index) => (
                  <Grid item key={index}>
                    <Box sx={{ position: 'relative', width: 40, height: 40 }}>
                      <HeartDisabledIcon
                        sx={{
                          fontSize: 40,
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          opacity: 1,
                          transition: 'opacity 0.5s',
                          animation: `fadeOut 2s infinite ${index * 0.2}s`
                        }}
                      />
                      <HeartIcon
                        sx={{
                          fontSize: 40,
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          opacity: 0,
                          transition: 'opacity 0.5s',
                          animation: `fadeIn 4s infinite ${index * 0.2}s, bounce 2s infinite ${index * 0.2}s`
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <style jsx global>{`
                @keyframes fadeIn {
                  0%, 100% { opacity: 0; }
                  50% { opacity: 1; }
                }
                @keyframes fadeOut {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0; }
                }
                @keyframes bounce {
                  0%, 50%, 100% { transform: translateY(0); }
                  25% { transform: translateY(-10px); }
                }
              `}</style>
            </Box>
          <Typography variant="subtitle2"
                component="h6"
                align="center"
                style={{
                    marginTop: "-10px",
                    marginBottom: "10px",
                    color: theme.palette.text.primary,
                }}>
                Give us some feedback and refill your hearts!
            </Typography>
            <TextField
                inputRef={textFieldRef}
                id="errorReport"
                variant="outlined"
                color="primary"
                label="Give us feedback!"
                required={true}
                margin="normal"
                multiline={true}
                minRows={3}
                maxRows={15}
                sx={{
                    width: "30vw",
                    marginBottom: "25px",
                }}
            />
            <Button
                sx={{
                    marginBottom: "-15px",
                }}
                onClick={() => reportIssue()}>Submit</Button>
        </div>
    </Box>
), [])


  const reportIssue = async () => {
    if (!textFieldRef.current) {
        swal("Error", "Please enter a description of the issue you are having!", "error")
        return
    }

    let res = await fetch(
        `${config.rootPath}/api/reportIssueHeart`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                page: pathname,
                // @ts-ignore
                issue: textFieldRef.current.value,
            }),
            credentials: 'include'
        }
    ).then(async (response) => {
        let data: any = await response.json();
        if (data["message"] !== undefined) {
            setReportPopup(false)
            swal(data["message"]).then(() => {
                window.location.reload();
            });
        } else {
            swal("Something went wrong, please try again.")
        }
    })
}

  useEffect(() => {

    const checkReportIssueHearts = async () => {
        try {
            const response = await fetch(
                `${config.rootPath}/api/checkReportIssueHeart`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: '{}',
                    credentials: 'include'
                }
            );
            

            const data = await response.json();
            console.log("show response2: ", data);
            if (data.show === "true") {
                setShow(true);
            }else{
              setShow(false);
            }
        } catch (e) {
            console.log("failed to check report issue hearts2: ", e);
        }
    };

    checkReportIssueHearts();

  }, []);

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
        {show && (
          <Button variant="outlined" onClick={() => setReportPopup(true)} sx={{ mb: 2 }}>
            Give Feedback. Get More Hearts!
          </Button>
        )}
        <Modal open={reportPopup} onClose={() => setReportPopup(false)}>
                                {reportIssueMemo}
                            </Modal>
        <Button variant="outlined" onClick={() => setReferralTriggered(true)}>
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

'use client'

import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Paper, Chip, List, ListItem, ListItemIcon, ListItemText, LinearProgress, Grid, Card, CardContent, ToggleButton, ToggleButtonGroup, SpeedDial, SpeedDialAction, Button, Popover } from '@mui/material';
import { styled } from '@mui/material/styles';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TimelineIcon from '@mui/icons-material/Timeline';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RouteIcon from '@mui/icons-material/Route';
import MapIcon from '@mui/icons-material/Map';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ArticleIcon from '@mui/icons-material/Article';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CodeIcon from '@mui/icons-material/Code';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import JourneyMap from '@/components/Journey/JourneysMap';
import MuiAwesomeButton from '@/components/MuiAwesomeButton';
import config from '@/config';
import { Unit, Task } from '@/models/journey';
import swal from "sweetalert";
import MarkdownRenderer from '@/components/Markdown/MarkdownRenderer';
import { initialAuthStateUpdate, selectAuthStateId, updateAuthState } from '@/reducers/auth/auth';
import { useAppDispatch, useAppSelector } from '@/reducers/hooks';
import { selectJourneysId } from '@/reducers/journeyDetour/journeyDetour';
import { useRouter } from "next/navigation";
import { theme } from '@/theme';
import Image from 'next/image';
import PythonOriginal from 'devicons-react/lib/icons/PythonOriginal';
import GoPlain from 'devicons-react/lib/icons/GoPlain';
import RustOriginal from 'devicons-react/lib/icons/RustOriginal';
import CplusplusPlain from 'devicons-react/lib/icons/CplusplusPlain';
import JavascriptPlain from 'devicons-react/lib/icons/JavascriptPlain';
import CsharpPlain from 'devicons-react/lib/icons/CsharpPlain';
import { AwesomeButton } from "react-awesome-button";
import Close from '@mui/icons-material/Close';

interface JourneyInfoProps {
  params: {
    id: string;
    unitData: Unit;
  };
}

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  minHeight: 64,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  fontWeight: 500,
}));

export default function JourneyInfo({ params }: JourneyInfoProps) {
  const { id } = params;
  const userId = useAppSelector(selectAuthStateId);
  const reduxIdState = useAppSelector(selectJourneysId);
  const [activeTab, setActiveTab] = useState(0);
  const [journeyUnit, setJourneyUnit] = useState<Unit | null>(params.unitData);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [journeyUnitMap, setJourneyUnitMap] = useState<Unit[]>([]);
  const [selectedUnitColor, setSelectedUnitColor] = useState<string | null>(null);

  const [taskDescription, setTaskDescription] = useState("")
  const [taskTitle, setTaskTitle] = useState("")
  const [currentTask, setCurrentTask] = useState(false)
  const [taskId, setTaskId] = useState("")
  const [anchorElDesc, setAnchorElDesc] = useState<HTMLDivElement | null>(null);

  const handleClickDesc = (description: string, title: string, taskID: string, current: boolean, event: React.MouseEvent<HTMLDivElement>) => {
    setTaskTitle(title)
    setTaskDescription(description)
    setTaskId(taskID)
    setCurrentTask(current)
    setAnchorElDesc(event.currentTarget);
  };

  const getUnitMap = async (unitId: any) => {
    let unitmap = await fetch(
      `${config.rootPath}/api/journey/getJourneyFromUnit`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ unit_id: unitId }),
        credentials: 'include'
      }
    ).then(async (response) => response.json())

    if (unitmap !== undefined && unitmap["success"] !== undefined && unitmap["success"] === true) {
      setJourneyUnitMap(unitmap["units"])
      // update the selected unit color
      let su = unitmap["units"].find((unit: Unit) => unit._id === unitId)
      setSelectedUnitColor(su.color)
    } else {
      swal("There was an issue getting the journey map")
    }
  }

  const getTasks = async (unitId: string) => {
    try {
      const response = await fetch(
        `${config.rootPath}/api/journey/getTasksInUnit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ unit_id: unitId }),
          credentials: 'include'
        }
      );

      const data = await response.json();

      if (data.success && data.data.tasks) {
        setTasks(data.data.tasks);
      } else {
        throw new Error('Failed to fetch task data');
      }
    } catch (error) {
      console.error('Error fetching task data:', error);
      swal("There was an issue getting the journey task information");
    }
  };

  React.useEffect(() => {
    getTasks(id);
    getUnitMap(id);
  }, [id]);

  function redirectToMain(newPath: string) {
    // Get the current URL's protocol, hostname, and port
    const baseUrl = `${window.location.protocol}//${window.location.host}`;

    // Construct the new URL
    const newUrl = `${baseUrl}${newPath}`;

    // Redirect to the new URL
    window.location.href = newUrl;
  }

  let navigate = useRouter();
  const dispatch = useAppDispatch();

  const TakeDetour = async () => {
    let detour = await fetch(
      `${config.rootPath}/api/journey/createDetour`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ detour_unit_id: id, user_id: userId, task_id: typeof reduxIdState === "string" ? reduxIdState : `${reduxIdState}` }),
        credentials: 'include'
      }
    ).then(async (response) => response.json())


    if (detour !== undefined && detour["success"] !== undefined && detour["success"] === true) {
      redirectToMain("/journey")
    } else if (detour["message"] === "You must be logged in to access the GIGO system.") {
      let authState = Object.assign({}, initialAuthStateUpdate)
      dispatch(updateAuthState(authState))
      navigate.push("/login?forward=" + encodeURIComponent(window.location.pathname))
    } else {
      swal(detour["message"])
    }
  }

  const [view, setView] = useState<'path' | 'map'>('path');

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: 'path' | 'map',
  ) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const handleLanguage = (lang: string, buttonSize: number) => {
    switch (lang.toLowerCase()) {
      case "python":
      case "py":
        return <PythonOriginal size={`${buttonSize * 0.8}px`} />
      case "golang":
      case "go":
        return <GoPlain size={`${buttonSize * 0.8}px`} />
      case "rust":
      case "rs":
        return <RustOriginal size={`${buttonSize * 0.8}px`} />
      case "cpp":
      case "c++":
      case "cc":
      case "cxx":
        return <CplusplusPlain size={`${buttonSize * 0.8}px`} />
      case "javascript":
      case "js":
        return <JavascriptPlain size={`${buttonSize * 0.8}px`} />
      case "c#":
      case "csharp":
      case "cs":
        return <CsharpPlain size={`${buttonSize * 0.8}px`} />
      default:
        return null
    }
  }

  const handleIcon = (item: Task, index: number, firstIncomplete: number, buttonSize: number) => {
    if (item.completed) {
      return (
        <AwesomeButton style={{
          width: `${buttonSize}px`,
          height: `${buttonSize}px`,
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          '--button-default-height': '70px',
          '--button-primary-color': "#ffef62",
          '--button-primary-color-dark': "#afa33d",
          '--button-primary-color-light': "#dfce53",
          '--button-primary-color-active': "#ffef62",
          '--button-primary-color-hover': "#FFFCAB",
          '--button-default-font-size': '14px',
          '--button-default-border-radius': '80%',
          '--button-horizontal-padding': '3px',
          '--button-raise-level': `${buttonSize * 0.12}px`,
          '--button-hover-pressure': '3',
          '--transform-speed': '0.275s',
        }} type="primary"
          // @ts-ignore
          href={item.code_source_type === 4 ? `/quiz/${item.code_source_id}?journey` : `/byte/${item.code_source_id}?journey`}>
          <CheckCircleIcon style={{ width: `${buttonSize * 0.8}px`, height: `${buttonSize * 0.8}px` }} />
        </AwesomeButton>
      );
    } else if (index === firstIncomplete) {
      return (
        <AwesomeButton style={{
          width: `${buttonSize}px`,
          height: `${buttonSize}px`,
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          '--button-default-height': '70px',
          '--button-primary-color': "#29C18C",
          '--button-primary-color-dark': "#1c8762",
          '--button-primary-color-light': "#1c8762",
          '--button-primary-color-active': "#1c8762",
          '--button-primary-color-hover': "#29C18C",
          '--button-default-font-size': '14px',
          '--button-default-border-radius': '80%',
          '--button-horizontal-padding': '3px',
          '--button-raise-level': `${buttonSize * 0.12}px`,
          '--button-hover-pressure': '3',
          '--transform-speed': '0.275s',
        }} type="primary"
          // @ts-ignore
          href={item.code_source_type === 4 ? `/quiz/${item.code_source_id}?journey` : `/byte/${item.code_source_id}?journey`}
        >
          {handleLanguage(item.lang, buttonSize)}
        </AwesomeButton>
      );
    } else {
      return (
        <AwesomeButton style={{
          width: `${buttonSize}px`,
          height: `${buttonSize}px`,
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          '--button-default-height': '70px',
          '--button-primary-color': "#b0b0b0",
          '--button-primary-color-dark': "#808080",
          '--button-primary-color-light': "#808080",
          '--button-primary-color-active': "#808080",
          '--button-primary-color-hover': "#b0b0b0",
          '--button-default-font-size': '14px',
          '--button-default-border-radius': '80%',
          '--button-horizontal-padding': '3px',
          '--button-raise-level': `${buttonSize * 0.12}px`,
          '--button-hover-pressure': '3',
          '--transform-speed': '0.275s',
        }} type="primary">
          <HelpOutlineIcon style={{ width: `${buttonSize * 0.8}px`, height: `${buttonSize * 0.8}px` }} />
        </AwesomeButton>
      );
    }
  }

  const [openSpeedDial, setOpenSpeedDial] = useState<string | null>(null);
  const handleMouseEnter = (id: string) => () => setOpenSpeedDial(id);
  const handleMouseLeave = () => setOpenSpeedDial(null);

  const TaskDescription = () => {
    return (
      <>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Typography sx={{ textTransform: "none" }} variant={"h5"}>
            {taskTitle}
          </Typography>
        </Box>
        <Box sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          flexDirection: "column",
          pt: 4,
          height: "20vh"
        }}>
          <Typography
            sx={{ textTransform: "none", textAlign: 'justify', marginLeft: '28px', marginRight: '28px' }}
            variant={"h6"}>
            {taskDescription}
          </Typography>

        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {(currentTask)
            ?
            <AwesomeButton style={{
              width: "auto",
              //@ts-ignore
              '--button-primary-color': theme.palette.primary.main,
              '--button-primary-color-dark': theme.palette.primary.dark,
              '--button-primary-color-light': theme.palette.primary.dark,
              //@ts-ignore
              '--button-primary-color-active': theme.palette.primary.dark,
              //@ts-ignore
              '--button-primary-color-hover': theme.palette.primary.main,
              '--button-default-border-radius': "24px",
              '--button-hover-pressure': "4",
              height: "10vh",
              '--button-raise-level': "10px"
            }} type="primary" href={`/byte/${taskId}?journey`}>
              <h1 style={{ fontSize: "2vw", paddingRight: "1vw", paddingLeft: "1vw" }}>
                Start
              </h1>
            </AwesomeButton>
            :
            <AwesomeButton style={{
              width: "auto",
              //@ts-ignore
              '--button-primary-color': theme.palette.secondary.main,
              '--button-primary-color-dark': theme.palette.secondary.dark,
              '--button-primary-color-light': theme.palette.secondary.dark,
              //@ts-ignore
              '--button-primary-color-active': theme.palette.secondary.dark,
              //@ts-ignore
              '--button-primary-color-hover': theme.palette.secondary.main,
              '--button-default-border-radius': "24px",
              '--button-hover-pressure': "4",
              height: "10vh",
              '--button-raise-level': "10px"
            }} type="primary" href={`/byte/${taskId}?journey`}>
              <h1 style={{ fontSize: "2vw", paddingRight: "1vw", paddingLeft: "1vw" }}>
                Review
              </h1>
            </AwesomeButton>}
        </Box>
      </>

    )
  }

  const taskPopups = () => {
    return (
      <>
        <Popover
          id={anchorElDesc !== null ? 'simple-popover' : undefined}
          open={anchorElDesc !== null}
          anchorEl={anchorElDesc}
          onClose={() => setAnchorElDesc(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'left',
          }}
          PaperProps={{
            style: {
              boxShadow: 'none',
              borderRadius: "30px",
            }
          }}
        >
          <Box sx={{ maxWidth: "30vw", maxHeight: '40vh', m: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "right", alignItems: "right" }}>
              <Button onClick={() => setAnchorElDesc(null)}>
                <Close />
              </Button>
            </Box>
            {TaskDescription()}
          </Box>
        </Popover>
      </>
    )
  }

  const Tasks = (item: Task, index: number, firstIncomplete: number, buttonSize: number) => {
    return (
      <SpeedDial
        sx={{
          '& .MuiSpeedDial-fab': {
            width: `${buttonSize}px`,
            height: `${buttonSize}px`,
            backgroundColor: 'transparent',
            boxShadow: "none",
            '&:hover': {
              backgroundColor: 'transparent',
            },
          },
        }}
        ariaLabel={`SpeedDial ${item.name}`}
        icon={handleIcon(item, index, firstIncomplete, buttonSize)}
        direction="right"
        open={openSpeedDial === item._id}
        onClose={handleMouseLeave}
        onOpen={handleMouseEnter(item._id)}
      >
        <SpeedDialAction
          icon={<ArticleIcon />}
          tooltipTitle="Info"
          // @ts-ignore
          onClick={(e) => handleClickDesc(item.description, item.name, item.code_source_id, (index === firstIncomplete), e)}
          sx={{
            backgroundColor: "#52ad94",
            color: "white"
          }}
        />
      </SpeedDial>
    )
  }

  const renderJourneyPath = (tasks: Task[]) => {
    let buttonSpacing = 30;
    let buttonSize = 100;
    let maxOffset = 150;
    const offsetBase = 4;

    if (typeof window !== 'undefined') {
      buttonSize = Math.max(Math.min(window.innerWidth * 0.045, 100), 55);
      buttonSpacing = Math.max(Math.min(buttonSize * 0.3, 30), 16);
      maxOffset = Math.max(Math.min(buttonSize * 1.3, 150), 84);
    }

    const calculateOffset = (index: number) => {
      let lastCenter = index;
      while (lastCenter > 0 && lastCenter % offsetBase !== 0) {
        lastCenter--;
      }
      const inverse = (lastCenter / offsetBase) % 2 === 0;

      let scalingFactor = (index - lastCenter) / (offsetBase / 2);
      if (index % offsetBase > Math.floor(offsetBase / 2)) {
        let stepsFromMidpoint = index % offsetBase - Math.floor(offsetBase / 2);
        scalingFactor = Math.abs(index - (stepsFromMidpoint * 2) - lastCenter) / (offsetBase / 2);
      }

      const offset = inverse ? maxOffset : -maxOffset;
      return offset * scalingFactor;
    };

    const firstIncompleteIndex = tasks.findIndex(task => !task.completed);

    return (
      <Box>
        <Box sx={{
          p: 2,
          backgroundColor: selectedUnitColor,
          borderRadius: '30px',
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "24px",
          position: "relative"
        }}>
          <Typography variant="h6" style={{ color: getTextColor(selectedUnitColor ?? "#ffffff") }}>
            {journeyUnit?.name}
          </Typography>
        </Box>
        <Box sx={{ position: 'relative', width: '100%', height: '100%', overflowY: 'auto' }}>
          <Box sx={{ minHeight: `${tasks.length * (buttonSize + buttonSpacing)}px` }}>
            {tasks.map((task, index) => (
              <Box
                key={task._id}
                sx={{
                  position: 'absolute',
                  top: `${index * (buttonSize + buttonSpacing)}px`,
                  left: `calc(50% + ${calculateOffset(index)}px)`,
                  transform: 'translateX(-50%)',
                }}
              >
                {Tasks(task, index, firstIncompleteIndex, buttonSize)}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  };

  const renderUnitMap = () => {
    return (
      <Box sx={{ flexGrow: 1, overflow: 'auto', height: '100%' }}>
        {journeyUnitMap.map((mapUnit, index) => (
          <Button
            variant="text"
            key={mapUnit._id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2,
              p: 2,
              borderRadius: 2,
              color: theme.palette.text.primary,
              backgroundColor: mapUnit._id === journeyUnit?._id ? 'rgba(41, 193, 140, 0.2)' : 'rgba(255, 255, 255, 0.1)',
              border: mapUnit._id === journeyUnit?._id ? '2px solid #29C18C' : 'none',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(41, 193, 140, 0.1)',
              },
            }}
            href={`/journey/info/${mapUnit._id}`}
          >
            <Typography variant="body1" sx={{ flexGrow: 1 }}>
              {index + 1}. {mapUnit.name}
            </Typography>
            {mapUnit._id === journeyUnit?._id && (
              <Typography variant="body2" sx={{ color: '#29C18C' }}>
                Current Unit
              </Typography>
            )}
          </Button>
        ))}
      </Box>
    );
  };

  return (
    <>
      <Box sx={{
        width: '100%',
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <Box sx={{
          p: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{journeyUnit?.name}</Typography>
          <MuiAwesomeButton
            backgroundColor={theme.palette.primary.main}
            hoverColor={theme.palette.primary.light}
            secondaryColor={theme.palette.primary.dark}
            textColor={theme.palette.primary.dark}
            onClick={TakeDetour}
          >
            <Typography variant="button">Take Detour</Typography>
          </MuiAwesomeButton>
        </Box>

        {/* Main content */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flexGrow: 1, p: 4, paddingTop: 0, paddingBottom: 0 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card elevation={3}>
                  <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, alignItems: 'flex-start' }}>
                      <img src={`${config.rootPath}/static/junit/t/${id}`} style={{borderRadius: '8px', width: '20vw', maxHeight: '1000px', height: 'auto'}} />
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>Description</Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>{journeyUnit?.description}</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6">
                            {view === 'path' ? 'Tasks' : 'Unit Map'}
                          </Typography>
                          <ToggleButtonGroup
                            value={view}
                            exclusive
                            onChange={handleViewChange}
                            aria-label="view selector"
                            size="small"
                          >
                            <ToggleButton value="path" aria-label="journey path">
                              <RouteIcon />
                            </ToggleButton>
                            <ToggleButton value="map" aria-label="unit map">
                              <MapIcon />
                            </ToggleButton>
                          </ToggleButtonGroup>
                        </Box>
                        <Box sx={{ height: '500px', overflow: 'hidden', position: 'relative' }}>
                          {view === 'path' ? renderJourneyPath(tasks) : renderUnitMap()}
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                        <CodeIcon sx={{ mr: 1, color: 'primary.main' }} />
                        {journeyUnit?.langs.map((lang, index) => (
                          <StyledChip key={index} label={lang} color="primary" size="small" variant="outlined" />
                        ))}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocalOfferIcon sx={{ mr: 1, color: 'secondary.main' }} />
                        {journeyUnit?.tags.map((tag, index) => (
                          <StyledChip key={index} label={tag} color="secondary" size="small" variant="outlined" />
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <MarkdownRenderer
                  markdown={journeyUnit?.handout}
                  style={{
                    fontSize: "1rem",
                    lineHeight: 1.8,
                    '& h1, & h2, & h3': {
                      color: 'primary.main',
                      marginTop: '1.5em',
                      marginBottom: '0.5em',
                      fontWeight: 'bold',
                    },
                    '& p': { marginBottom: '1em' },
                    '& code': {
                      backgroundColor: 'background.paper',
                      padding: '0.2em 0.4em',
                      borderRadius: '3px',
                      fontFamily: 'monospace',
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
      {taskPopups()}
    </>
  );
}

function getTextColor(backgroundColor: string): string {
  // This function assumes the background color is in hex format (e.g., #ffffff)

  // Convert hex to RGB
  const rgb = parseInt(backgroundColor.substring(1), 16); // Convert hex to decimal
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;

  // Calculate the luminance
  const luminance = 0.2126 * (r / 255) ** 2.2 + 0.7152 * (g / 255) ** 2.2 + 0.0722 * (b / 255) ** 2.2;

  // Return white for dark backgrounds and black for light backgrounds
  return luminance < 0.5 ? 'white' : 'black';
}
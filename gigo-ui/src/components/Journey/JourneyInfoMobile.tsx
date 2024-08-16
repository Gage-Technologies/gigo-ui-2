'use client'

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip, CircularProgress, Card, CardContent, ToggleButton, ToggleButtonGroup, SpeedDial, SpeedDialAction, Button, Popover } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import JourneyMap from '@/components/Journey/JourneysMap';
import MuiAwesomeButton from '@/components/MuiAwesomeButton';
import config from '@/config';
import { Unit, Task } from '@/models/journey';
import swal from "sweetalert";
import MarkdownRenderer from '@/components/Markdown/MarkdownRenderer';
import Image from "next/image";
import { initialAuthStateUpdate, selectAuthStateId, updateAuthState } from '@/reducers/auth/auth';
import { useAppDispatch, useAppSelector } from '@/reducers/hooks';
import { selectJourneysId } from '@/reducers/journeyDetour/journeyDetour';
import { useRouter } from "next/navigation";
import { PythonOriginal, GoPlain, RustOriginal, CplusplusPlain, JavascriptPlain, CsharpPlain } from 'devicons-react';
import { AwesomeButton } from "react-awesome-button";
import RouteIcon from '@mui/icons-material/Route';
import MapIcon from '@mui/icons-material/Map';
import ArticleIcon from '@mui/icons-material/Article';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CodeIcon from '@mui/icons-material/Code';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import Close from '@mui/icons-material/Close';

interface JourneyInfoProps {
  params: {
    id: string;
    unitData: Unit;
  };
}

export default function JourneyInfoMobile({ params }: JourneyInfoProps) {
  const theme = useTheme();
  const { id } = params;
  const userId = useAppSelector(selectAuthStateId);
  const reduxIdState = useAppSelector(selectJourneysId);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [journeyUnit, setJourneyUnit] = useState<Unit | null>(params.unitData);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'path' | 'map'>('path');
  const [journeyUnitMap, setJourneyUnitMap] = useState<Unit[]>([]);
  const [selectedUnitColor, setSelectedUnitColor] = useState<string | null>(null);

  const [taskDescription, setTaskDescription] = useState("")
  const [taskTitle, setTaskTitle] = useState("")
  const [currentTask, setCurrentTask] = useState(false)
  const [taskId, setTaskId] = useState("")
  const [anchorElDesc, setAnchorElDesc] = useState<HTMLDivElement | null>(null);

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
      let su = unitmap["units"].find((unit: Unit) => unit._id === unitId)
      setSelectedUnitColor(su.color)
    } else {
      swal("There was an issue getting the journey map")
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getTasks(id);
      await getUnitMap(id);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  function redirectToMain(newPath: string) {
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const newUrl = `${baseUrl}${newPath}`;
    window.location.href = newUrl;
  }

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
      router.push("/login?forward=" + encodeURIComponent(window.location.pathname))
    } else {
      swal(detour["message"])
    }
  }

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
          <Typography sx={{ textTransform: "none" }} variant="h6">
            {taskTitle}
          </Typography>
        </Box>
        <Box sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          flexDirection: "column",
          pt: 2,
          height: "15vh",
          overflowY: "auto"
        }}>
          <Typography
            sx={{ textTransform: "none", textAlign: 'justify', px: 2 }}
            variant="body2">
            {taskDescription}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <AwesomeButton style={{
            width: "auto",
            '--button-primary-color': currentTask ? theme.palette.primary.main : theme.palette.secondary.main,
            '--button-primary-color-dark': currentTask ? theme.palette.primary.dark : theme.palette.secondary.dark,
            '--button-primary-color-light': currentTask ? theme.palette.primary.dark : theme.palette.secondary.dark,
            '--button-primary-color-active': currentTask ? theme.palette.primary.dark : theme.palette.secondary.dark,
            '--button-primary-color-hover': currentTask ? theme.palette.primary.main : theme.palette.secondary.main,
            '--button-default-border-radius': "24px",
            '--button-hover-pressure': "2",
            height: "40px",
            '--button-raise-level': "6px"
          }} type="primary" href={`/byte/${taskId}?journey`}>
            <Typography variant="button">
              {currentTask ? 'Start' : 'Review'}
            </Typography>
          </AwesomeButton>
        </Box>
      </>
    )
  }

  const taskPopups = () => {
    return (
      <Popover
        id={anchorElDesc !== null ? 'simple-popover' : undefined}
        open={anchorElDesc !== null}
        anchorEl={anchorElDesc}
        onClose={() => setAnchorElDesc(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          style: {
            borderRadius: "15px",
            maxWidth: "90vw",
            maxHeight: "60vh"
          }
        }}
      >
        <Box sx={{ p: 2, maxWidth: "90vw", maxHeight: '60vh' }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={() => setAnchorElDesc(null)}>
              <Close />
            </Button>
          </Box>
          {TaskDescription()}
        </Box>
      </Popover>
    )
  }

  const Tasks = (item: Task, index: number, firstIncomplete: number, buttonSize: number) => {
    return handleIcon(item, index, firstIncomplete, buttonSize)
  }

  const renderJourneyPath = (tasks: Task[]) => {
    let buttonSpacing = 20;
    let buttonSize = 60;
    let maxOffset = 80;
    const offsetBase = 4;

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
          borderRadius: '15px',
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "16px",
          position: "relative"
        }}>
          <Typography variant="h6" style={{ color: getTextColor(selectedUnitColor ?? "#ffffff") }}>
            {journeyUnit?.name}
          </Typography>
        </Box>
        <Box sx={{ position: 'relative', width: '100%', height: '100%', overflowY: 'auto', maxHeight: '50vh' }}>
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
      <Box sx={{ flexGrow: 1, overflow: 'auto', height: '100%', maxHeight: '50vh' }}>
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
              width: "100%",
              color: theme.palette.text.primary,
              backgroundColor: mapUnit._id === journeyUnit?._id ? 'rgba(41, 193, 140, 0.2)' : 'rgba(255, 255, 255, 0.1)',
              border: mapUnit._id === journeyUnit?._id ? '2px solid #29C18C' : 'none',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(41, 193, 140, 0.1)',
              },
            }}
            onClick={() => router.push(`/journey/info/${mapUnit._id}`)}
          >
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {index + 1}. {mapUnit.name}
            </Typography>
            {mapUnit._id === journeyUnit?._id && (
              <Typography variant="caption" sx={{ color: '#29C18C' }}>
                Current Unit
              </Typography>
            )}
          </Button>
        ))}
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

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
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>{journeyUnit?.name}</Typography>
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
        <Box sx={{ flexGrow: 1, p: 2 }}>
          <Card elevation={3} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                <Image
                  src={`${config.rootPath}/static/junit/t/${id}`}
                  alt="Journey Unit Image"
                  width={250}
                  height={425}
                  style={{ borderRadius: '8px', objectFit: 'cover' }}
                />
                <Typography variant="body2" sx={{ textAlign: 'center' }}>{journeyUnit?.description}</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <CodeIcon sx={{ mr: 1, color: 'primary.main' }} />
                    {journeyUnit?.langs.map((lang, index) => (
                      <Chip key={index} label={lang} color="primary" size="small" variant="outlined" sx={{ m: 0.5 }} />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <LocalOfferIcon sx={{ mr: 1, color: 'secondary.main' }} />
                    {journeyUnit?.tags.map((tag, index) => (
                      <Chip key={index} label={tag} color="secondary" size="small" variant="outlined" sx={{ m: 0.5 }} />
                    ))}
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card elevation={3} sx={{ mb: 2 }}>
            <CardContent>
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
              <Box sx={{ height: '50vh', overflow: 'hidden', position: 'relative' }}>
                {view === 'path' ? renderJourneyPath(tasks) : renderUnitMap()}
              </Box>
            </CardContent>
          </Card>

          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Handout</Typography>
              <Box sx={{ overflow: 'auto' }}>
                <MarkdownRenderer
                  markdown={journeyUnit?.handout}
                  style={{
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                    '& h1, & h2, & h3': {
                      color: 'primary.main',
                      marginTop: '1.2em',
                      marginBottom: '0.4em',
                      fontWeight: 'bold',
                    },
                    '& p': { marginBottom: '0.8em' },
                    '& code': {
                      backgroundColor: 'background.paper',
                      padding: '0.2em 0.4em',
                      borderRadius: '3px',
                      fontFamily: 'monospace',
                    }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
      {taskPopups()}
    </>
  );
}

function getTextColor(backgroundColor: string): string {
  const rgb = parseInt(backgroundColor.substring(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luminance = 0.2126 * (r / 255) ** 2.2 + 0.7152 * (g / 255) ** 2.2 + 0.0722 * (b / 255) ** 2.2;
  return luminance < 0.5 ? 'white' : 'black';
}
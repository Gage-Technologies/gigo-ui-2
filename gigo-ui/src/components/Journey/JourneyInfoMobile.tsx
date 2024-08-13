'use client'

import React from 'react';
import { Box, Typography, Grid, Paper, Chip, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import JourneyMap from '@/components/Journey/JourneysMap';
import MuiAwesomeButton from '@/components/MuiAwesomeButton';
import config from '@/config';
import { Unit, Task } from '@/models/journey';
import swal from "sweetalert";
import MarkdownRenderer from '@/components/Markdown/MarkdownRenderer';
import Image from "next/image";
import { selectAuthStateId } from '@/reducers/auth/auth';
import { useAppSelector } from '@/reducers/hooks';
import { selectJourneysId } from '@/reducers/journeyDetour/journeyDetour';

interface JourneyInfoProps {
  params: {
    id: string;
  };
}

export default function JourneyInfoMobile({ params }: JourneyInfoProps) {
  const theme = useTheme();
  const { id } = params;
  const userId = useAppSelector(selectAuthStateId);
  const reduxIdState = useAppSelector(selectJourneysId);

  const [journeyUnit, setJourneyUnit] = React.useState<Unit | null>(null);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(true);

  const getUnitMap = async (unitId: string) => {
    try {
      const response = await fetch(
        `${config.rootPath}/api/journey/getUnitMetadata`,
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

      if (data.success && data.unit) {
        setJourneyUnit(data.unit);
      } else {
        throw new Error('Failed to fetch unit data');
      }
    } catch (error) {
      console.error('Error fetching unit data:', error);
      swal("There was an issue getting the journey unit information");
    }
  };

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
    const fetchData = async () => {
      setLoading(true);
      await getUnitMap(id);
      await getTasks(id);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  function redirectToMain(newPath: string) {
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const newUrl = `${baseUrl}${newPath}`;
    window.location.href = newUrl;
  }

  const TakeDetour = async() => {
    let detour = await fetch(
      `${config.rootPath}/api/journey/createDetour`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({detour_unit_id: id, user_id: userId, task_id: typeof reduxIdState === "string" ? reduxIdState : `${reduxIdState}`}),
        credentials: 'include'
      }
    ).then(async (response) => response.json())

    if (detour !== undefined && detour["success"] !== undefined && detour["success"] === true){
      redirectToMain("/journey")
    } else {
      swal("There was an issue adding this detour")
    }
  } 

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: 2, 
      width: '100%', 
      maxWidth: '100%', 
      margin: '0 auto', 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      justifyContent: 'space-between'
    }}>
      <Box>
        <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>Journey Information</Typography>
        
        <Paper elevation={3} sx={{ p: 2, borderRadius: '12px', mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main }}>Journey Unit</Typography>
          {journeyUnit && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Image
                  src={config.rootPath + "/static/junit/t/" + id}
                  alt="Journey Unit Image"
                  width={150}
                  height={150}
                  style={{
                    borderRadius: '15px',
                    objectFit: 'cover'
                  }}
                />
              </Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>{journeyUnit.name}</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>{journeyUnit.description}</Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Languages:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {journeyUnit.langs.map((lang, index) => (
                    <Chip key={index} label={lang} color="primary" variant="outlined" size="small" />
                  ))}
                </Box>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Tags:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {journeyUnit.tags.map((tag, index) => (
                    <Chip key={index} label={tag} color="secondary" variant="outlined" size="small" />
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </Paper>

        <Paper elevation={3} sx={{ p: 2, borderRadius: '12px', mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main }}>Tasks</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {tasks.map((task, index) => (
              <Box 
                key={index} 
                sx={{ 
                  p: 2, 
                  border: `1px solid ${theme.palette.primary.main}`,
                  borderRadius: '4px',
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>{task.name}</Typography>
                <Typography variant="body2">{task.description}</Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ p: 2, borderRadius: '12px', mb: 2, maxHeight: '400px', overflowY: 'auto' }}>
          <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main }}>Journey Progress</Typography>
          <JourneyMap unitId={id}/>
        </Paper>

        <Paper elevation={3} sx={{ p: 2, borderRadius: '12px', mb: 2, maxHeight: '500px', overflowY: 'auto' }}>
          <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main }}>Handout</Typography>
          {journeyUnit && (
            <MarkdownRenderer 
              markdown={journeyUnit.handout} 
              style={{
                fontSize: "0.9rem",
                width: "100%", 
                maxWidth: "100%",
              }} 
            />
          )}
        </Paper>
      </Box>

      <Box sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        mt: 2,
      }}>
        <MuiAwesomeButton
          backgroundColor={theme.palette.secondary.main}
          hoverColor={theme.palette.secondary.light}
          secondaryColor={theme.palette.secondary.dark}
          textColor={theme.palette.secondary.dark}
          onClick={() => redirectToMain(`/journey/detour?unitId=${id}`)}
        >
          <Typography variant="h6">
            Back
          </Typography>
        </MuiAwesomeButton>
        <MuiAwesomeButton
          backgroundColor={theme.palette.primary.main}
          hoverColor={theme.palette.primary.light}
          secondaryColor={theme.palette.primary.dark}
          textColor={theme.palette.primary.dark}
          onClick={TakeDetour}
        >
          <Typography variant="h6">
            Take Detour
          </Typography>
        </MuiAwesomeButton>
      </Box>
    </Box>
  );
}
'use client'

import React from 'react';
import { Box, Typography, Grid, Paper, Chip } from '@mui/material';
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

export default function JourneyInfo({ params }: JourneyInfoProps) {
  const theme = useTheme();
  const { id } = params;
  const userId = useAppSelector(selectAuthStateId);
  const reduxIdState = useAppSelector(selectJourneysId);


  const [journeyUnit, setJourneyUnit] = React.useState<Unit | null>(null);
  const [tasks, setTasks] = React.useState<Task[]>([]);

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
        // set the single unit returned by the api
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
    getUnitMap(id);
    getTasks(id);
  }, [id]);

  function redirectToMain(newPath: string) {
    // Get the current URL's protocol, hostname, and port
    const baseUrl = `${window.location.protocol}//${window.location.host}`;

    // Construct the new URL
    const newUrl = `${baseUrl}${newPath}`;

    // Redirect to the new URL
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

  return (
    <Box sx={{ p: 3, width: '100%', maxWidth: '1800px', margin: '0 auto' }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>Journey Information</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: '12px', height: '700px', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" sx={{ mb: 2, color: theme.palette.primary.main }}>Journey Unit</Typography>
            {journeyUnit && (
              <Box sx={{ overflowY: 'auto', flexGrow: 1, pr: 2 }}> {/* added right padding */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <Image
                    src={config.rootPath + "/static/junit/t/" + id}
                    alt="Journey Unit Image"
                    width={200}
                    height={200}
                    style={{
                        borderRadius: '15px',
                        objectFit: 'cover'
                    }}
                  />
                </Box>
                <Typography variant="h6" sx={{ mb: 2 }}>{journeyUnit.name}</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{journeyUnit.description}</Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>Languages:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {journeyUnit.langs.map((lang, index) => (
                      <Chip key={index} label={lang} color="primary" variant="outlined" size="small" />
                    ))}
                  </Box>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>Tags:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {journeyUnit.tags.map((tag, index) => (
                      <Chip key={index} label={tag} color="secondary" variant="outlined" size="small" />
                    ))}
                  </Box>
                </Box>
                
                <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Tasks</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {tasks.map((task, index) => (
                    <Box 
                      key={index} 
                      sx={{ 
                        p: 2, 
                        border: `1px solid ${theme.palette.primary.main}`,
                        borderRadius: '4px',
                        width: '95%', // slightly less wide
                        mx: 'auto' // center the box
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>{task.name}</Typography>
                      <Typography variant="body2">{task.description}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: '12px', height: '700px', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" sx={{ mb: 2, color: theme.palette.primary.main }}>Journey Progress</Typography>
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
              <JourneyMap unitId={id}/>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: '12px', height: '700px', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" sx={{ mb: 2, color: theme.palette.primary.main }}>Handout</Typography>
            {journeyUnit && (
              <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                <MarkdownRenderer 
                  markdown={journeyUnit.handout} 
                  style={{
                        margin: "10px",
                        fontSize: "1rem",
                        width: "calc(100% - 20px)", 
                        maxWidth: "fit-content",
                  }} 
                />
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
      <Box sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        paddingTop: "20px",
        gap: "20px"
      }}>
        <MuiAwesomeButton
          backgroundColor={theme.palette.secondary.main}
          hoverColor={theme.palette.secondary.light}
          secondaryColor={theme.palette.secondary.dark}
          textColor={theme.palette.secondary.dark}
          onClick={() => redirectToMain(`/journey/detour?unitId=${id}`)}
        >
          <Typography variant="h6" sx={{ fontSize: "1vw", px: "1vw" }}>
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
          <Typography variant="h6" sx={{ fontSize: "1vw", px: "1vw" }}>
            Take Detour
          </Typography>
        </MuiAwesomeButton>
      </Box>
    
    </Box>
  );
}
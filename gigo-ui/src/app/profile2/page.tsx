'use client'

import React, { useState, useEffect } from 'react'
import { Box, Typography, Container, CircularProgress, Grid } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import BytesCard from '@/components/BytesCard';
import DetourCard from '@/components/Journey/DetourCard'
import ProjectCard from '@/components/Project/ProjectCard'
import config from '@/config'
import router from 'next/router';

/**
 * recent activity page component
 * this component renders a page with recent activity in journeys, bytes, and projects
 */

const RecentActivityPage = () => {
  const theme = useTheme()
  const [loading, setLoading] = useState(true)
  const [bytesData, setBytesData] = useState([])
  const [journeysData, setJourneysData] = useState([])
  const [projectsData, setProjectsData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bytesResponse, journeysResponse, projectsResponse] = await Promise.all([
            fetch(`${config.rootPath}/api/profile/getAttemptedBytes`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': ''
                },
                body: '{}',
                credentials: 'include'
            }),
            fetch(`${config.rootPath}/api/profile/getAttemptedJourneys`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cookie': ''
                    },
                    body: '{}',
                    credentials: 'include'
                }),
            fetch(`${config.rootPath}/api/profile/getAttemptedProjects`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cookie': ''
                    },
                    body: '{}',
                    credentials: 'include'
                }),
        ])

        const bytes = await bytesResponse.json()
        const journeys = await journeysResponse.json()
        const projects = await projectsResponse.json()

        setBytesData(bytes.bytes)
        setJourneysData(journeys.units)
        setProjectsData(projects.projects)
        setLoading(false)
      } catch (error) {
        console.error('error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          recent activity
        </Typography>
        
        {/* journeys row */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            journeys
          </Typography>
          <Grid container spacing={2}>
            {Array.isArray(journeysData) ? (
              journeysData.slice(0, 3).map((journey: any) => (
                <Grid item xs={12} sm={6} md={4} key={journey._id}>
                  <DetourCard data={journey} width={"100%"} />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="body1">no journey data available</Typography>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* bytes row */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            bytes
          </Typography>
          <Grid container spacing={4}>
            {Array.isArray(bytesData) ? (
              bytesData.slice(0, 5).map((byte: any) => (
                <Grid item xs={12} sm={6} md={2.4} key={byte._id}>
                 <BytesCard
                      height={"355px"}
                      imageHeight={355}
                      width={'100%'}
                      imageWidth={'100%'}
                      bytesId={byte._id}
                      bytesDesc={"Concept Explanation"}
                      bytesThumb={config.rootPath + "/static/bytes/t/" + byte._id}
                      language={byte.langauge}
                      animate={false} 
                      onClick={() => router.push("/byte/" + byte._id)}
                  />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="body1">no byte data available</Typography>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* projects row */}
        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            projects
          </Typography>
          <Grid container spacing={2}>
            {Array.isArray(projectsData) ? (
              projectsData.slice(0, 3).map((project: any) => (
                <Grid item xs={12} sm={6} md={4} key={project._id}>
                   <ProjectCard
                      width={"100%"}
                      imageWidth={"100%"}
                      projectId={project._id}
                      projectTitle={project.title}
                      projectDesc={project.description}
                      projectThumb={config.rootPath + project.thumbnail}
                      projectDate={project.updated_at}
                      projectType={project.type}
                      renown={project.tier}
                      onClick={() => router.push("/challenge/" + project._id)}
                      userThumb={config.rootPath + "/static/user/pfp/" + project.user_id}
                      userId={project.user_id}
                      username={project.username}
                      backgroundName={project.background_name}
                      backgroundPalette={project.background_color}
                      exclusive={project["challenge_cost"] !== null}
                      hover={false}

                  />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="body1">no project data available</Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}

export default RecentActivityPage

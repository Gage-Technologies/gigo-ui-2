'use client'
import React, { useEffect, useRef, useState } from "react";
import {
    Box, CircularProgress, createTheme, CssBaseline, Grid, Tab, Tabs,
    ThemeProvider, Typography, Button
} from "@mui/material";
import SearchBar from "@/components/SearchBar";
import { theme } from "@/theme";
import DetourMobileCard from "@/components/Journey/DetourMobileCard";
import call from "@/services/api-call";
import config from "@/config";
import swal from "sweetalert";
import { debounce } from "lodash";
import DetourSign from "@/icons/Journey/DetourSign";

interface Unit {
    id: string;
    title: string;
    description: string;
}

interface JourneyGroups {
    [key: string]: Unit[];
}

function JourneyDetoursMobile() {
    const sections = useRef([]);
    const [activeTab, setActiveTab] = useState(0);
    const [searchText, setSearchText] = React.useState("")
    const [searchPending, setSearchPending] = React.useState(false)
    const [searchUnits, setSearchUnits] = useState<Unit[]>([]);
    const [isSticky, setIsSticky] = useState(false);
    const [journeyGroups, setJourneyGroups] = useState<JourneyGroups>({});
    const searchBarRef = useRef<HTMLDivElement>(null);
    const [groupStates, setGroupStates] = useState({});

    // @ts-ignore
    sections.current = Object.keys(journeyGroups);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [activeTab]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScroll = () => {
        const top = window.scrollY;
        setIsSticky(top >= 150);

        // Update the active tab based on scroll position
        const currentSection = sections.current.findIndex(section => {
            const elem = document.getElementById(section);
            return elem && top >= elem.offsetTop - 200 && top < elem.offsetTop + elem.offsetHeight;
        });
        if (currentSection !== -1 && currentSection !== activeTab) {
            setActiveTab(currentSection);
        }
    };

    const [offsetHeight, setOffsetHeight] = useState(0);

    // Function to handle changes in tabs
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
        const section = document.getElementById(sections.current[newValue]);
        if (section) {
            window.scrollTo({ top: section.offsetTop - 220, behavior: 'smooth' });
        }
    };

    // Handle search text changes
    const handleSearchText = (text: string) => {
        setSearchText(text);
    };

    // Fetch journey groups on mount
    useEffect(() => {
        async function fetchGroups() {
            try {
                const response = await call("/api/journey/getJourneyGroups", "post");
                if (response && response.success) {
                    setJourneyGroups(response.groups);
                } else {
                    throw new Error("Failed to fetch groups");
                }
            } catch (error) {
                swal("Error", "Failed to fetch journey groups. Please try again later.", "error");
            }
        }

        fetchGroups();
    }, []);

    const searchJourneyUnits = async (searchText: string) => {
        let params = {
            query: searchText,
            skip: 0,
            limit: 50
        };
        let res = await call(
            "/api/search/journeyUnits",
            "POST",
            null,
            null,
            null,
            // @ts-ignore
            params,
            null,
            config.rootPath
        );

        if (res !== undefined && res["units"] !== undefined){
            setSearchUnits(res["units"]);
        }
        setSearchPending(false);

        return null;
    };

    const fetchAdditionalUnits = async(unitId: any) => {
        let units = await call(
            "/api/journey/getUnitsFromGroup",
            "post",
            null,
            null,
            null,
            //@ts-ignore
            {group_id: unitId},
            null,
            config.rootPath
        )

        if (units !== undefined && units["success"] !== undefined && units["success"] === true) {
            return units['units']
        } else {
            swal("Server Error", "We can't get in touch with the GIGO servers right now. Sorry about that! " +
                "We'll get crackin' on that right away!")
        }
    }

    const searchJourneyUnitsDebounced = React.useCallback(debounce(searchJourneyUnits, 800), []);

    useEffect(() => {
        setSearchPending(true);
        searchJourneyUnitsDebounced(searchText);
    }, [searchText]);

    const handleShowAllToggle = async (GroupID: any) => {
        // @ts-ignore
        if (!groupStates[GroupID]?.loaded) {
            // Make the API call to load additional units for this GroupID
            const additionalUnits = await fetchAdditionalUnits(GroupID);
            if (additionalUnits === undefined) {
                return
            }
            setGroupStates((prevState) => ({
                ...prevState,
                [GroupID]: {
                    // @ts-ignore
                    ...prevState[GroupID],
                    loaded: true,
                    // @ts-ignore
                    units: [...(prevState[GroupID]?.units || []), ...additionalUnits],
                    showAll: true,
                },
            }));
        } else {
            // Toggle showAll state
            setGroupStates((prevState) => ({
                ...prevState,
                [GroupID]: {
                    // @ts-ignore
                    ...prevState[GroupID],
                    // @ts-ignore
                    showAll: !prevState[GroupID].showAll,
                },
            }));
        }
    };

    const renderJourneyGroups = () => {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                {/*@ts-ignore*/}
                {Object.entries(journeyGroups).map(([category, {Units, GroupID}]) => (
                    <div key={GroupID}>
                        <Box id={category} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
                            <Typography variant="h6" sx={{textAlign: 'center', mb: 0.2}}>
                                {category}
                            </Typography>
                            {Units.length === 4 && (
                                <Button onClick={() => handleShowAllToggle(GroupID)} sx={{fontSize: "0.6em"}}>
                                    {/*@ts-ignore*/}
                                    {groupStates[GroupID]?.showAll ? 'Show Less' : 'Show More'}
                                </Button>
                            )}
                        </Box>
                        <Grid container spacing={1}>
                            {/*@ts-ignore*/}
                            {(groupStates[GroupID]?.showAll ? groupStates[GroupID]?.units || Units : Units.slice(0, 4)).map((unit, index) => (
                                <Grid item xs={12} key={unit.id} sx={{width: "100%", display: "flex", alignItems: "center", flexDirection: "row", justifyContent: "center"}}>
                                    <DetourMobileCard data={unit} />
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                ))}
            </Box>
        )
    };

    const renderSearchContent = () => {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
                {searchPending ? (
                    <CircularProgress />
                ) : (
                    <Grid container spacing={1}>
                        {searchUnits.map((unit) => (
                            <Grid item xs={12} key={unit.id} sx={{width: "100%", display: "flex", alignItems: "center", flexDirection: "row", justifyContent: "center"}}>
                                <DetourMobileCard data={unit} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        )
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    // position: isSticky ? 'fixed' : 'static',
                    position: 'fixed',
                    top: 56,
                    width: '100%',
                    backgroundColor: theme.palette.background.default,
                    zIndex: 1100,
                    paddingTop: "10px",
                    paddingLeft: "4px",
                    paddingRight: "4px",
                }}>

                    <Box sx={{alignItems: "center", ml: "20%"}}>
                        <DetourSign width='80%' height='80%' />
                    </Box>
                    <SearchBar value={searchText} handleSearchText={(text) => handleSearchText(text)} />
                    <Tabs
                        id="tabs"
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons={false}
                        aria-label="Journey tabs"
                        sx={{
                            minHeight: "36px"
                        }}
                        TabIndicatorProps={{sx: {opacity: (searchText !== '' ? 0 : 1)}}}
                    >
                        {Object.keys(journeyGroups).map((key, index) => (
                            <Tab key={index} label={key} sx={{
                                fontSize: "0.65rem",
                                padding: "4px 4px",
                                minHeight: "36px"
                            }} />
                        ))}
                    </Tabs>
                </Box>
                <Box
                    sx={{
                        mt: '200px'
                    }}
                >
                    {searchText === ""
                        ? renderJourneyGroups()
                        : renderSearchContent()
                    }
                </Box>
            </CssBaseline>
        </ThemeProvider>
    );
}

export default JourneyDetoursMobile;

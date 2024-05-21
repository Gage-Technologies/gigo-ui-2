'use client'
import React, {useEffect, useRef, useState} from "react";
import {
    Box, Button, CircularProgress,
    CssBaseline, Grid,
    Tab,
    Tabs,
    ThemeProvider,
    Typography
} from "@mui/material";
import SearchBar from "@/components/SearchBar";
import {theme} from "@/theme";
import DetourCard from "@/components/Journey/DetourCard";
import config from "@/config";
import {useAppSelector} from "@/reducers/hooks";
import {selectJourneysId} from "@/reducers/journeyDetour/journeyDetour";
import swal from "sweetalert";
import {Unit} from "@/models/journey";
import {debounce} from "lodash";
import {useSearchParams} from "next/navigation";
import JourneyDetoursMobile from "@/components/Journey/JourneyDetoursMobile";

interface JourneyGroups {
    [key: string]: Unit[]; // Key is the title, value is an array of units
}

function JourneyDetours() {
    let query = useSearchParams();
    let isMobile = query.get("viewport") === "mobile";
    const [isSticky, setIsSticky] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const sections = useRef([]);
    const [unitsPython, setUnitsPython] = React.useState([])
    const [searchUnits, setSearchUnits] = React.useState([])
    const [searchText, setSearchText] = React.useState("")
    const [searchPending, setSearchPending] = React.useState(false)
    const reduxIdState = useAppSelector(selectJourneysId);

    const handleScroll = () => {
        const top = window.scrollY;
        setIsSticky(top >= 150);

        // Update the active tab based on scroll position
        const currentSection = sections.current.findIndex(section => {
            const elem = document.getElementById(section);
            return elem && top >= elem.offsetTop - 500 && top < elem.offsetTop + elem.offsetHeight - 100;
        });
        if (currentSection !== -1 && currentSection !== activeTab) {
            setActiveTab(currentSection);
        }
    };

    const [offsetHeight, setOffsetHeight] = useState(0);

    const calculateOffsetHeight = () => {
        const searchbar = document.getElementById('searchbar');
        const tabs = document.getElementById('tabs');
        const title = document.getElementById('title');
        const searchbarHeight = searchbar ? searchbar.offsetHeight : 0;
        const tabsHeight = tabs ? tabs.offsetHeight : 0;
        const titleHeight = title ? (title.offsetHeight + 300) : 0;

        return searchbarHeight + tabsHeight + titleHeight;
    };

    useEffect(() => {
        // Update the offset height when isSticky changes or window resizes
        const handleResize = () => {
            setOffsetHeight(calculateOffsetHeight());
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial calculation

        return () => window.removeEventListener('resize', handleResize);
    }, [isSticky]); // Dependency array includes isSticky

    const handleTabChange = (event: any, newValue: any) => {
        setActiveTab(newValue);
        const section = document.getElementById(sections.current[newValue]);
        if (section) {
            window.scrollTo({ top: section.offsetTop - offsetHeight, behavior: 'smooth' });
        }
    };

    const [journeyGroups, setJourneyGroups] = useState<JourneyGroups>({});

    // TODO subject to change
    // @ts-ignore
    sections.current = Object.keys(journeyGroups);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [activeTab]);

    const handleSearchText = (text: string) => {
        setSearchText(text)
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const searchJourneyUnits = async (searchText: string) => {
        let params = {
            query: searchText,
            skip: 0,
            limit: 50
        }

        let res = await fetch(
            `${config.rootPath}/api/search/journeyUnits`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params),
                credentials: 'include'
            }
        ).then(async (response) => response.json())

        if (res !== undefined && res["units"] !== undefined){
            setSearchUnits(res["units"])
        }
        setSearchPending(false)

        return null
    }

    const searchJourneyUnitsDebounced = React.useCallback(debounce(searchJourneyUnits, 800), []);

    useEffect(() => {
        setSearchPending(true)
        searchJourneyUnitsDebounced(searchText)
    }, [searchText])

    useEffect(() => {
        getGroups()
    }, [])

    const [showAllPython, setShowAllPython] = useState(false); // State to toggle visibility
    const [showAllGo, setShowAllGo] = useState(false); // State to toggle visibility


    const getGroups = async() => {

        let groups = await fetch(
            `${config.rootPath}/api/journey/getJourneyGroups`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: '{}',
                credentials: 'include'
            }
        ).then(async (response) => response.json())

        if (groups !== undefined && groups["success"] !== undefined && groups["success"] === true) {
            setJourneyGroups(groups['groups'])
        } else {
            swal("Server Error", "We can't get in touch with the GIGO servers right now. Sorry about that! " +
                "We'll get crackin' on that right away!")
            return
        }

    }

    const fetchAdditionalUnits = async(unitId: any) => {
        let units = await fetch(
            `${config.rootPath}/api/journey/getUnitsFromGroup`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    group_id: unitId
                }),
                credentials: 'include'
            }
        ).then(async (response) => response.json())

        if (units !== undefined && units["success"] !== undefined && units["success"] === true) {
            return units['units']
        } else {
            swal("Server Error", "We can't get in touch with the GIGO servers right now. Sorry about that! " +
                "We'll get crackin' on that right away!")
        }
    }

    const [groupStates, setGroupStates] = useState({});
    // @ts-ignore
    const handleShowAllToggle = async (GroupID) => {
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
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: "column"}}>
                {/*@ts-ignore*/}
                {Object.entries(journeyGroups).map(([category, {Units, GroupID}]) => (
                    <div key={category}>
                        <Box id={category} sx={{display: 'flex', justifyContent: 'left', alignItems: 'left', width: '50vw'}}>
                            <Typography variant={"h5"} sx={{textAlign: "center", p: 1}}>
                                {category}
                            </Typography>
                            {Units.length === 4 && (
                                <Button onClick={() => handleShowAllToggle(GroupID)}>
                                    {/*@ts-ignore*/}
                                    {groupStates[GroupID]?.showAll ? 'Show Less' : 'Show More'}
                                </Button>
                            )}
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            p: 2,
                            width: '50vw',
                        }}>
                            <Grid container spacing={2}>
                                {/*@ts-ignore*/}
                                {(groupStates[GroupID]?.showAll ? groupStates[GroupID]?.units || Units : Units.slice(0, 4)).map(unit => (
                                    <Grid item xs={6} key={unit}>
                                        <DetourCard data={unit} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </div>
                ))}
            </Box>
        )
    }

    const renderSearchContent = () => {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: "column"}}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 2,
                    width: '50vw',
                }}>
                    {searchPending ? (
                        <CircularProgress />
                    ) : (
                        <Grid container spacing={2}>
                            {searchUnits.map((unit) => (
                                <Grid item xs={6} key={unit}>
                                    <DetourCard data={unit} />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            </Box>
        )
    }

    const detoursDesktop = () => {
        return (
            <>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    position: isSticky ? 'fixed' : 'static',
                    top: 63,
                    width: '100%',
                    backgroundColor: theme.palette.background.default,
                    transition: 'top 0.3s',
                    zIndex: 99
                }}>
                    {isSticky ? (
                        // Content when box is sticky
                        <Box id="searchbar" sx={{justifyContent: 'center', p: 2, flexDirection: "column"}}>
                            <SearchBar value={searchText} handleSearchText={handleSearchText}/>
                            <Tabs
                                id="tabs"
                                value={activeTab}
                                onChange={handleTabChange}
                                variant="scrollable"
                                scrollButtons="auto"
                                sx={{width: '50vw'}}
                                TabIndicatorProps={{sx: {opacity: (searchText !== '' ? 0 : 1)}}}
                            >
                                {Object.entries(journeyGroups).map(([title, units]) => (
                                    <Tab key={title} label={title} disabled={searchText !== ''} wrapped/>
                                ))}
                            </Tabs>
                        </Box>
                    ) : (
                        // Full content when box is not sticky
                        <Box sx={{justifyContent: 'center', p: 2, alignItems: "center"}}>
                            <Typography id='title' variant={"h3"} sx={{textAlign: "center", p: 1}}>
                                Journey Detours
                            </Typography>
                            <SearchBar value={searchText} handleSearchText={handleSearchText}/>
                            <Tabs
                                id="tabs"
                                value={activeTab}
                                onChange={handleTabChange}
                                variant="scrollable"
                                scrollButtons="auto"
                                sx={{width: '50vw'}}
                                TabIndicatorProps={{sx: {opacity: (searchText !== '' ? 0 : 1)}}}
                            >
                                {Object.entries(journeyGroups).map(([title, units]) => (
                                    <Tab key={title} label={title} disabled={searchText !== ''} wrapped/>
                                ))}
                            </Tabs>
                        </Box>
                    )}
                </Box>
                {searchText === ""
                    ?
                    renderJourneyGroups()
                    :
                    renderSearchContent()
                }
            </>
        )
    }

    const renderJourneyDetours = () => {
        if (isMobile) {
            return <JourneyDetoursMobile />
        } else {
            return detoursDesktop()
        }
    }

    return renderJourneyDetours()
}

export default JourneyDetours;

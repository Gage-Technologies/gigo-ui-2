import React, { useState, useEffect } from 'react';
import { Button, Modal, Box, Typography, IconButton, Tabs, Tab } from '@mui/material';
import Lottie from 'react-lottie';
import LockIcon from '@mui/icons-material/Lock';
import config from '@/config';
import swal from 'sweetalert';
import { initialAuthStateUpdate, selectAuthState, selectAuthStateId, updateAuthState } from '@/reducers/auth/auth';
import { theme } from '@/theme';
import UserIcon from '@/icons/User/UserIcon';
import { useAppDispatch, useAppSelector } from '@/reducers/hooks';
import CloseIcon from "@mui/icons-material/Close";

type BackgroundArray = {
    modules: string;
    id?: string;
    name: string;
    data: null | any;
};

interface Reward {
    id: string; // Or number, depending on your data
    render_in_front: boolean; // Adjust this type if different
    full_name: string;
}

interface EditBackgroundProps {
  userBackground: string;
  userData: any; // Add this line to include userData in props
}

const EditBackground: React.FC<EditBackgroundProps> = ({ userBackground, userData }) => {
    const [showPopup, setShowPopup] = React.useState(false)
    const userId = useAppSelector(selectAuthStateId);
    const [inventory, setInventory] = React.useState<Reward[]>([])

    const [chosenBackground, setChosenBackground] = React.useState<BackgroundArray[]>([]);
    const [backgroundTab, setBackgroundTab] = React.useState(0);
    const [backgroundArray, setBackgroundArray] = useState<BackgroundArray[]>([]);
    const [profileBackgroundArray, setProfileBackgroundArray] = React.useState<BackgroundArray[]>([]);
    const dispatch = useAppDispatch();
    const authState = useAppSelector(selectAuthState);

    let profileBackgroundArrayFull: BackgroundArray[] = [{"modules": "red_paint", "name": "red_paint", "data": null}, {"modules": "white_paint", "name": "white_paint", "data": null}, {"modules": "pink_paint", "name": "pink_paint", "data": null},{"modules": "blue_geometric_lines", "name": "blue_geometric_lines", "data": null}, {"modules": "green_geometric_lines", "name": "green_geometric_lines", "data": null}, {"modules": "red_geometric_lines", "name": "red_geometric_lines", "data": null}, {"modules": "blue_helix_circle", "name": "blue_helix_circle", "data": null}, {"modules": "green_helix_circle", "name": "green_helix_circle", "data": null}, {"modules": "red_helix_circle", "name": "red_helix_circle", "data": null}, {"modules": "pink_70s_funk", "name": "pink_70s_funk", "data": null}, {"modules": "orange_70s_funk", "name": "orange_70s_funk", "data": null}, {"modules": "green_70s_funk", "name": "green_70s_funk", "data": null},{"modules": "green_coffee_stain", "name": "green_coffee_stain", "data": null}, {"modules": "orange_coffee_stain", "name": "orange_coffee_stain", "data": null}, {"modules": "purple_coffee_stain", "name": "purple_coffee_stain", "data": null}, {"modules": "green_wave", "name": "green_wave", "data": null}, {"modules": "orange_wave", "name": "orange_wave", "data": null}, {"modules":"purple_wave", "name": "purple_wave", "data": null}, {"modules": "green_pulse", "name": "green_pulse", "data": null}, {"modules": "pink_pulse", "name": "pink_pulse", "data": null}, {"modules": "purple_pulse", "name": "purple_pulse", "data": null}, {"modules": "blue_dotted_circle", "name": "blue_dotted_circle", "data": null}, {"modules": "green_dotted_circle", "name": "green_dotted_circle", "data": null}, {"modules": "orange_dotted_circle", "name": "orange_dotted_circle", "data": null}, {"modules": "blue_fast_circle", "name": "blue_fast_circle", "data": null}, {"modules": "grey_fast_circle", "name": "grey_fast_circle", "data": null}, {"modules": "red_fast_circle", "name": "red_fast_circle", "data": null}, {"modules": "blue_dotted_vortex", "name": "blue_dotted_vortex", "data": null}, {"modules": "green_dotted_vortex", "name": "green_dotted_vortex", "data": null}, {"modules": "red_dotted_vortex", "name": "red_dotted_vortex", "data": null}]

    const fetchBackgroundData = async () => {
        let promises: Promise<any>[] = [];
        for (let i = 0; i < profileBackgroundArrayFull.length; i++){
            promises.push(
                fetch(`${config.rootPath}/static/ui/lottie/user_backgrounds/${profileBackgroundArrayFull[i]["name"]}.json`, {credentials: 'include'})
                .then(data => {
                    data.json().then(json => {
                        profileBackgroundArrayFull[i]["data"] = json
                    })
                })
                .catch(error => console.error(error))
            );
        }
        await Promise.all(promises)
        setProfileBackgroundArray(profileBackgroundArrayFull)
    }

    const [dataLoaded, setDataLoaded] = React.useState(false);

    useEffect(() => {
        if (!dataLoaded) {
            const fetchData = async () => {
                await Promise.all([
                    fetchBackgroundData()
                ]);
                setDataLoaded(true);
                setBackgroundArray([]); // Set to empty array initially
                setBackgroundTab(0); // Ensure the initial tab is set to 'None'
            };
            fetchData();
        }
    }, [dataLoaded]);

        const handleChanges = (event: React.SyntheticEvent, newValue: number) => {
        switch(newValue){
            case 0 : {
                setBackgroundArray([])
                setBackgroundTab(0)
                setChosenBackground([])
                break
            }
            case 1 : {
                setBackgroundArray(profileBackgroundArray.slice(3,6))
                setBackgroundTab(1)
                break
            }
            case 2 : {
                setBackgroundArray(profileBackgroundArray.slice(6,9))
                setBackgroundTab(2)
                break
            }
            case 3 : {
                setBackgroundArray(profileBackgroundArray.slice(9,12))
                setBackgroundTab(3)
                break
            }
            case 4 : {
                setBackgroundArray(profileBackgroundArray.slice(12,15))
                setBackgroundTab(4)
                break
            }
            case 5 : {
                setBackgroundArray(profileBackgroundArray.slice(15,18))
                setBackgroundTab(5)
                break
            }
            case 6 : {
                setBackgroundArray(profileBackgroundArray.slice(18,21))
                setBackgroundTab(6)
                break
            }
            case 7 : {
                setBackgroundArray(profileBackgroundArray.slice(21,24))
                setBackgroundTab(7)
                break
            }
            case 8 : {
                setBackgroundArray(profileBackgroundArray.slice(24,27))
                setBackgroundTab(8)
                break
            }
            case 9 : {
                setBackgroundArray(profileBackgroundArray.slice(27,30))
                setBackgroundTab(9)
                break
            }
            case 10 : {
                setBackgroundArray(profileBackgroundArray.slice(0,3))
                setBackgroundTab(10)
                break
            }
        }
    };


    const submitBackgroundChange = async (background: BackgroundArray[] | null) => {
        if (background === null) {
            setShowPopup(false);
            let authState = { ...initialAuthStateUpdate };
            authState.backgroundColor = "null";
            authState.backgroundName = "null";
            dispatch(updateAuthState(authState));
        } else {
            const currentBackground = background[0];
            setShowPopup(false);
            let authState = { ...initialAuthStateUpdate };

            const nameParts = currentBackground.name.split("_");
            authState.backgroundColor = nameParts[0];

            if (nameParts.length > 2) {
                authState.backgroundName = nameParts[1] + "_" + nameParts[2];
            } else {
                authState.backgroundName = nameParts[1];
            }

            dispatch(updateAuthState(authState));
        }
    };

    const getUserBackgroundInventory = async () => {
        if (inventory.length === 0) {
            let inventoryData = await fetch(
                `${config.rootPath}/api/reward/getUserRewardInventory`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: '{}',
                    credentials: 'include'
                }
            ).then(async (response) => response.json())

            const [res] = await Promise.all([
                inventoryData
            ])

            if (res === undefined) {
                swal("There has been an issue loading data. Please try again later.")
            }

            let finalRewards = []

            if (res["rewards"]!== undefined){
                for (let i = 0; i < res["rewards"].length; i++){
                    finalRewards.push({
                        "id": res["rewards"][i]["id"],
                        "render_in_front": res["rewards"][i]["render_in_front"],
                        "full_name" : res["rewards"][i]["color_palette"] + "_" + res["rewards"][i]["name"],
                    })
                }
            }

            setInventory(finalRewards)
        }
        setChosenBackground([]) // Reset chosenBackground when opening
        setBackgroundTab(0) // Ensure we start on the 'None' tab
        setBackgroundArray([]) // Ensure backgroundArray is empty
        setShowPopup(true)
    }


    const closeBackgroundPopup = () => {
        setBackgroundArray([])
        setBackgroundTab(0)
        setChosenBackground([]) // Reset chosenBackground when closing
        setShowPopup(false)
    }

    return(
        <>
            <Button
                onClick={(e) => {
                    e.preventDefault();
                    getUserBackgroundInventory().then(() => {
                        setInventory(prevInventory => [...prevInventory]);
                    });
                }}
                variant={"outlined"}
                sx={{
                    color: theme.palette.text.primary,
                    borderRadius: 1,
                    p: 1,
                    ml: 1,
                    backgroundColor: "secondary",
                    minWidth: "120px"
                }}
            >
                Edit Background
            </Button>
            <Modal
                open={showPopup}
                onClose={() => closeBackgroundPopup()}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div style={{display: "flex", width: "60vw", height: "60vh", alignItems: "center", justifyContent: "center"}}>
                    <Box
                        sx={{
                            boxShadow: "0px 6px 3px -3px rgba(0,0,0,0.3),0px 3px 3px 0px rgba(0,0,0,0.3),0px 3px 9px 0px rgba(0,0,0,0.3)",
                            color: 'text.primary',
                            borderRadius: 1,
                            width: "60vw",
                            minHeight: "550px",
                            height: "60vh",
                            backgroundColor: theme.palette.background.default,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "start",
                            alignItems: "center",
                            transform: "translate(30%, 30%)"
                        }}
                    >
                        <IconButton
                            aria-label="close"
                            onClick={() => closeBackgroundPopup()}
                            color="primary"
                            style={{position: 'absolute', top: "1%", right: "1%", zIndex: 10}}
                        >
                            <CloseIcon/>
                        </IconButton>
                        <div style={{height: "90%", overflowY: "hidden", paddingRight: "20px"}}>
                            <Tabs
                                orientation="vertical"
                                variant="scrollable"
                                value={backgroundTab}
                                onChange={handleChanges}
                                aria-label="Vertical tabs example"
                                sx={{
                                    borderRight: 1,
                                    borderColor: 'divider',
                                    height: "100%",
                                    overflowY: "auto"
                                }}
                            >
                                <Tab label="None"/>
                                <Tab label="Geometric"/>
                                <Tab label="Helix"/>
                                <Tab label="70s Funk"/>
                                <Tab label="Coffee Stain"/>
                                <Tab label="Wave"/>
                                <Tab label="Pulse"/>
                                <Tab label="Dotted Circle"/>
                                <Tab label="Fast Circle"/>
                                <Tab label="Dotted Vortex"/>
                                <Tab label="Paint"/>
                            </Tabs>
                        </div>
                        <div style={{
                            height: "90%",
                            width: "30%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                            padding: "10px"
                        }}>
                            {backgroundArray.map((background, index) => {
                                let personalInventory = inventory.filter(e => e.full_name === background["name"])
                                return (
                                    <div key={index} style={{padding: "10px"}}>
                                        {personalInventory.length === 0 ? (
                                            <div style={{width: "100px", height: "100px", position: "relative", zIndex: 9}}>
                                                <div style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.3}}>
                                                    <Button disabled={true}>
                                                        <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                                            <Lottie options={
                                                                {loop: true,
                                                                    autoplay: true,
                                                                    animationData: background["data"],
                                                                    rendererSettings: {
                                                                        preserveAspectRatio: 'xMidYMid slice'
                                                                    }
                                                                }} width={100}
                                                                    height={100} isClickToPauseDisabled={true}/>
                                                        </div>
                                                    </Button>
                                                </div>
                                                <div style={{zIndex: 10, width: "100px", height: "100px", position: "absolute", top: 40, left: 45}}>
                                                    <LockIcon/>
                                                </div>
                                            </div>
                                        ) : (
                                            <Button onClick={() => setChosenBackground([
                                                {
                                                    modules: background["modules"],
                                                    id: personalInventory[0]["id"],
                                                    name: background["name"],
                                                    data: background["data"],
                                                }
                                            ])} disabled={false}>
                                                <div style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }}>
                                                    <Lottie options={
                                                        {
                                                            loop: true,
                                                            autoplay: true,
                                                            animationData: background["data"],
                                                            rendererSettings: {
                                                                preserveAspectRatio: 'xMidYMid slice'
                                                            }
                                                        }} width={100}
                                                            height={100}
                                                            isClickToPauseDisabled={true}
                                                    />
                                                </div>
                                            </Button>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                position: 'relative',
                            }}
                        >
                            <div
                                style={{
                                    position: 'relative',
                                    zIndex: 1,
                                                }}
                            >
                                <UserIcon
                                    userId={authState.id}
                                    userTier={authState.tier}
                                    userThumb={userData === null ? "" : config.rootPath + userData["pfp_path"]}
                                    size={300}
                                    backgroundName={null}
                                    backgroundPalette={null}
                                    backgroundRender={null}
                                    profileButton={false}
                                    pro={authState.role > 0}
                                    mouseMove={false}
                                />
                            </div>
                            {chosenBackground.length !== 0 && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        width: 575,
                                        height: 575,
                                        zIndex: 2,
                                    }}
                                >
                                    <Lottie
                                        options={{
                                            loop: true,
                                            autoplay: true,
                                            animationData: chosenBackground[0]["data"],
                                            rendererSettings: {
                                                preserveAspectRatio: 'xMidYMid slice',
                                            },
                                        }}
                                        isClickToPauseDisabled={true}
                                    />
                                </div>
                            )}
                        </div>
                        <div style={{position: 'absolute', bottom: "1%", right: "1%", zIndex: 10}}>
                            <Button 
                                onClick={() => submitBackgroundChange(backgroundTab === 0 ? null : chosenBackground)}
                                disabled={backgroundTab !== 0 && chosenBackground.length === 0}
                            >
                                Submit
                            </Button>
                        </div>
                    </Box>
                </div>
            </Modal>
        </>
            )
};

export default EditBackground;


import React, { useState } from 'react';
import { Chip, List, ListItem, IconButton } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import HorseIcon from "../../icons/ProjectCard/Horse";
import HoodieIcon from "../../icons/ProjectCard/Hoodie";
import TrophyIcon from "../../icons/ProjectCard/Trophy";
import GraduationIcon from "../../icons/ProjectCard/Graduation";
import DebugIcon from "../../icons/ProjectCard/Debug";
import {QuestionMark} from "@mui/icons-material";

function ProjectSelector({ originalLabel, onProjectSelect, theme, style = {}}) {
    const [selectedProject, setSelectedProject] = useState(originalLabel);
    const [isOpen, setIsOpen] = useState(false);

    const projects = [
        "Playground",
        "Casual",
        "Competitive",
        "Interactive",
        "Debug"
    ];

    const listStyle = {
        maxHeight: '150px',
        overflow: 'auto',
        background: theme.palette.background.default, // Make sure this color is opaque
        borderRadius: "15px",
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)', // Optional: added for better visibility
        zIndex: 2000
    };

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (project) => {
        setSelectedProject(project);
        setIsOpen(false);
        onProjectSelect(project)
    };

    const getProjectIcon = (projectType) => {
        switch (projectType) {
            case "Playground":
                return (
                    <HorseIcon sx={{width: "24px", height: "24px"}} />
                )
            case "Casual":
                return (
                    <HoodieIcon sx={{width: "20px", height: "20px"}} />
                )
            case "Competitive":
                return (
                    <TrophyIcon sx={{width: "18px", height: "18px"}} />
                )
            case "Interactive":
                return (
                    <GraduationIcon sx={{width: "20px", height: "20px"}} />
                )
            case "Debug":
                return (
                    <DebugIcon sx={{width: "20px", height: "20px"}} />
                )
            default:
                return (
                    <QuestionMark sx={{width: "20px", height: "20px"}} />
                )
        }
    }

    return (
        <div>
            <Chip
                label={selectedProject || "Select a project"}
                color="primary"
                variant="outlined"
                icon={getProjectIcon(selectedProject)}
                deleteIcon={isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                onDelete={handleToggle}
                clickable
            />
            {isOpen && (
                <List component="nav" style={{...listStyle, ...style}}>
                    {projects.map((project, index) => (
                        <ListItem button key={index} onClick={() => handleSelect(project)}>
                            <Chip
                                label={project}
                                color="primary"
                                variant="outlined"
                                icon={getProjectIcon(project)}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </div>
    );
}

export default ProjectSelector;

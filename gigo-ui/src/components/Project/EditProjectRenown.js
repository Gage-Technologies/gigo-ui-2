import React, { useState } from 'react';
import { Chip, List, ListItem, IconButton } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

function ProjectRenown({ originalLabel, onProjectSelect}) {
    const [selectedProject, setSelectedProject] = useState(originalLabel);
    const [isOpen, setIsOpen] = useState(false);

    const projects = [
        1,2,3,4,5,6,7,8,9,10
    ];

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (project) => {
        setSelectedProject(project);
        setIsOpen(false);
        onProjectSelect(project)
    };

    return (
        <div>
            <Chip
                label={selectedProject}
                color="primary"
                variant="outlined"
                deleteIcon={isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                onDelete={handleToggle}
                clickable
            />
            {isOpen && (
                <List component="nav" style={{ maxHeight: '150px', overflow: 'auto' }}>
                    {projects.map((project, index) => (
                        <ListItem button key={index} onClick={() => handleSelect(project)}>
                            <Chip
                                label={project}
                                color="primary"
                                variant="outlined"
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </div>
    );
}

export default ProjectRenown;
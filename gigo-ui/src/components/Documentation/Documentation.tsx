'use client'
import {Box, Grid, Typography,} from '@mui/material';
import MarkdownRenderer from '@/components/MarkdownServer/MarkdownRenderer';
import {SimpleTreeView} from '@mui/x-tree-view/SimpleTreeView';
import {treeItemClasses} from "@mui/x-tree-view";
import {TreeItem2} from "@mui/x-tree-view/TreeItem2";
import Link from 'next/link';
import ProIcon from "@/icons/Pro";
import {Article, Sailing} from "@mui/icons-material";
import BarChartIcon from '@mui/icons-material/BarChart';
import ExtensionIcon from '@mui/icons-material/Extension';
import KayakingIcon from '@mui/icons-material/Kayaking';
import TerminalIcon from '@mui/icons-material/Terminal';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import GitIcon from "@/icons/Git";
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import TimerIcon from '@mui/icons-material/Timer';
import CodeTeacherIcon from "@/icons/CodeTeacher";
import {theme} from '@/theme';
import {usePathname} from "next/navigation";

function StyledTreeItem(props: any) {
    const treeItemStyling: React.CSSProperties = {
        color: theme.palette.text.secondary,
        [`& .${treeItemClasses.content}`]: {
            color: theme.palette.text.secondary,
            borderRadius: "10px",
            paddingRight: "20px",
            fontWeight: theme.typography.fontWeightMedium,
            '&.Mui-expanded': {
                fontWeight: theme.typography.fontWeightRegular,
            },
            '&:hover': {
                backgroundColor: theme.palette.action.hover,
            },
            '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
                backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
                color: 'var(--tree-view-color)',
            },
            [`& .${treeItemClasses.label}`]: {
                fontWeight: 'inherit',
                color: 'inherit',
            },
        },
        [`& .${treeItemClasses.iconContainer}`]: {
            margin: 2,
            minHeight: "30px",
            minWidth: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        [`& .${treeItemClasses.label}`]: {
            minHeight: "30px",
        },
        // [`& .${treeItemClasses.group}`]: {
        //     marginLeft: 0,
        //     [`& .${treeItemClasses.content}`]: {
        //         marginLeft: 2,
        //     },
        // },
    }

    const {
        bgColor,
        color,
        labelIcon: LabelIcon,
        labelInfo,
        labelText,
        href,
        labelStyling,
        ...other
    } = props;

    let defaultedLabelStyling = labelStyling;
    if (defaultedLabelStyling === undefined) {
        defaultedLabelStyling = {fontWeight: 'inherit', flexGrow: 1};
    }

    return (
        <Link href={href} style={{textDecoration: 'none'}}>
            <TreeItem2
                icon={<LabelIcon fontSize={"large"} style={{fontSize: "25px"}}/>}
                label={
                    <Box sx={{display: 'flex', alignItems: 'center', p: 0.5, pr: 0, pl: 0, ml: 0}}>
                        <Typography variant="body2" sx={defaultedLabelStyling}>
                            {labelText}
                        </Typography>
                        <Typography variant="caption" color="inherit">
                            {labelInfo}
                        </Typography>
                    </Box>
                }
                style={{
                    ...treeItemStyling,
                    '--tree-view-color': color,
                    '--tree-view-bg-color': bgColor,
                }}
                {...other}
            />
        </Link>
    );
}

export default function DocumentationUI({markdownContent, selectedNode}: any) {
    let pathname = usePathname();

    return (
        <Box sx={{backgroundColor: "#1c1c1a"}}>
            <Grid container>
                <Grid item xs={2.5}>
                    <SimpleTreeView
                        aria-label="file system navigator"
                        expandedItems={["2", "9", "15"]}
                        selectedItems={selectedNode}
                        sx={{
                            top: '10vh',
                            height: '87vh',
                            flexGrow: 1,
                            minWidth: 50,
                            maxWidth: 450,
                            overflowY: 'hidden',
                            overflowX: 'hidden',
                            // borderRight: '1px solid grey',
                            position: 'fixed',
                            backgroundColor: "#1c1c1a"
                        }}>
                        <StyledTreeItem
                            id={"1"}
                            itemId="1"
                            labelText="Introduction"
                            labelIcon={Article}
                            // bgColor={"#265d9a"}
                            // color={"#fa0000"}
                            href={`/documentation/introduction/intro.md`}
                            bgColor={pathname.includes("introduction/intro.md") ? theme.palette.background.paper : undefined}
                        >
                        </StyledTreeItem>
                        <StyledTreeItem
                            id={"2"}
                            itemId="2"
                            labelText="DevSpace"
                            labelIcon={Article}
                            href={`/documentation/workspace/workspace_overview_1.md`}
                            bgColor={pathname.includes("workspace/workspace_overview_1.md") ? theme.palette.background.paper : undefined}
                        >
                            <StyledTreeItem
                                sx={{
                                    paddingLeft: "20px",
                                }}
                                id={"3"}
                                itemId="3"
                                labelText="Base Docker Image"
                                labelIcon={Sailing}
                                href={`/documentation/workspace/base_docker_image/base_docker_image_2.md`}
                                bgColor={pathname.includes("workspace/base_docker_image/base_docker_image_2.md") ? theme.palette.background.paper : undefined}
                            />
                            <StyledTreeItem
                                sx={{paddingLeft: "20px"}}
                                id={"4"}
                                itemId="4" labelText="Resources Specified"
                                labelIcon={BarChartIcon}
                                href={`/documentation/workspace/resources_specified/resources_specified_3.md`}
                                bgColor={pathname.includes("workspace/resources_specified/resources_specified_3.md") ? theme.palette.background.paper : undefined}
                            />
                            <StyledTreeItem
                                sx={{paddingLeft: "20px"}}
                                id={"5"}
                                itemId="5"
                                labelText="Vscode Extensions"
                                labelIcon={ExtensionIcon}
                                href={`/documentation/workspace/vscode_extensions/vscode_extensions_4.md`}
                                bgColor={pathname.includes("workspace/vscode_extensions/vscode_extensions_4.md") ? theme.palette.background.paper : undefined}
                            />
                            <StyledTreeItem
                                sx={{paddingLeft: "20px"}}
                                id={"6"}
                                itemId="6"
                                labelText="Additional Docker Services"
                                labelIcon={KayakingIcon}
                                href={`/documentation/workspace/docker_service/additional_docker_service_5.md`}
                                bgColor={pathname.includes("workspace/docker_service/additional_docker_service_5.md") ? theme.palette.background.paper : undefined}
                            />
                            <StyledTreeItem
                                sx={{paddingLeft: "20px"}}
                                id={"7"}
                                itemId="7"
                                labelText="Command Line Arguments"
                                labelIcon={TerminalIcon}
                                href={`/documentation/workspace/command_line_arguments/command_line_arguments_6.md`}
                                bgColor={pathname.includes("workspace/command_line_arguments/command_line_arguments_6.md") ? theme.palette.background.paper : undefined}
                            />
                            <StyledTreeItem
                                sx={{marginLeft: "20px"}}
                                itemId="8"
                                id={"8"}
                                labelText="Default DevSpace Config"
                                labelIcon={InsertDriveFileIcon}
                                href={`/documentation/workspace/default_workspace_config/default_workspace_config_7.md`}
                                bgColor={pathname.includes("workspace/default_workspace_config/default_workspace_config_7.md") ? theme.palette.background.paper : undefined}
                            />
                        </StyledTreeItem>
                        <StyledTreeItem
                            id={"9"}
                            itemId="9"
                            labelText="Extension"
                            labelIcon={Article}
                            sx={{

                                maxWidth: "80%",
                                left: "50",
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            href={`/documentation/extension/extension_overview_1.md`}
                            bgColor={pathname.includes("extension/extension_overview_1.md") ? theme.palette.background.paper : undefined}
                        >
                            <StyledTreeItem
                                sx={{
                                    paddingLeft: "20px",
                                }}
                                id={"10"}
                                itemId="10"
                                labelText="Code Teacher"
                                labelIcon={CodeTeacherIcon}
                                href={`/documentation/extension/code_teacher/extension_code_teacher_2.md`}
                                bgColor={pathname.includes("extension/code_teacher/extension_code_teacher_2.md") ? theme.palette.background.paper : undefined}
                            />
                            <StyledTreeItem
                                sx={{paddingLeft: "20px"}}
                                id={"11"}
                                itemId="11" labelText="Automatic Git"
                                labelIcon={GitIcon}
                                href={`/documentation/extension/automatic_git/extension_automatic_git_3.md`}
                                bgColor={pathname.includes("extension/automatic_git/extension_automatic_git_3.md") ? theme.palette.background.paper : undefined}
                            />
                            <StyledTreeItem
                                sx={{paddingLeft: "20px"}}
                                id={"12"}
                                itemId="12"
                                labelText="Tutorial Viewer"
                                labelIcon={AutoStoriesIcon}
                                href={`/documentation/extension/tutorial_viewer/extension_tutorial_viewer_4.md`}
                                bgColor={pathname.includes("extension/tutorial_viewer/extension_tutorial_viewer_4.md") ? theme.palette.background.paper : undefined}
                            />
                            <StyledTreeItem
                                sx={{paddingLeft: "20px"}}
                                id={"13"}
                                itemId="13"
                                labelText="Tutorial Creator"
                                labelIcon={NoteAltIcon}
                                href={`/documentation/extension/tutorial_creator/extension_tutorial_creator_5.md`}
                                bgColor={pathname.includes("extension/tutorial_creator/extension_tutorial_creator_5.md") ? theme.palette.background.paper : undefined}
                            />
                            <StyledTreeItem
                                sx={{paddingLeft: "20px"}}
                                id={"14"}
                                itemId="14"
                                labelText="AFK Setting"
                                labelIcon={TimerIcon}
                                href={`/documentation/extension/afk_setting/extension_afk_setting_6.md`}
                                bgColor={pathname.includes("extension/afk_setting/extension_afk_setting_6.md") ? theme.palette.background.paper : undefined}
                            />
                        </StyledTreeItem>
                        {/* <StyledTreeItem
                            id={"15"}
                            itemId="15"
                            labelText="Pro"
                            labelIcon={Article}
                            sx={{

                                maxWidth: "80%",
                                left: "50",
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            href={`/documentation/pro/pro_overview_1.md`}
                            bgColor={pathname.includes("pro/pro_overview_1.md") ? theme.palette.background.paper : undefined}
                        >
                            <StyledTreeItem
                                sx={{
                                    paddingLeft: "20px",
                                }}
                                id={"16"}
                                itemId="16"
                                labelText="Get Pro"
                                labelIcon={ProIcon}
                                href={`/documentation/pro/pro_purchase_2.md`}
                                bgColor={pathname.includes("pro/pro_purchase_2.md") ? theme.palette.background.paper : undefined}
                            />
                        </StyledTreeItem> */}
                    </SimpleTreeView>
                </Grid>
                <Grid item xs={9.5}>
                    <div style={{backgroundColor: "#1c1c1a", paddingTop: "16px", paddingLeft: "16px"}}>
                        <MarkdownRenderer markdown={markdownContent} style={{
                            overflowWrap: 'break-word',
                            borderRadius: '10px',
                            paddingBottom: '10px',
                            backgroundColor: "#1c1c1a",
                            maxWidth: "1000px"
                        }}/>
                    </div>
                </Grid>
            </Grid>
        </Box>
    );
}

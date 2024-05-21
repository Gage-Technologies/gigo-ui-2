'use client'
import * as React from "react";
import { useEffect } from "react";
import {
    Box,
    Button,
    Checkbox,
    Container,
    FormControlLabel,
    Grid,
    Typography,
    Paper,
} from "@mui/material";
import { styled } from '@mui/system';
import config from "@/config";
import swal from "sweetalert";
import { useAppSelector } from "@/reducers/hooks";
import { selectAuthStateExclusiveAgreement, selectAuthStateExclusiveContent } from "@/reducers/auth/auth";
import { useRouter } from "next/navigation";

const SectionContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(6, 0),
    textAlign: 'center',
}));

const ContentBox = styled(Paper)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(4),
    margin: theme.spacing(2, 0),
    backgroundColor: 'transparent',
    boxShadow: 'none',
    [theme.breakpoints.up('md')]: {
        flexDirection: 'row',
    },
}));

const TextContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    textAlign: 'left',
    padding: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
        width: '60%',
    },
}));

function ExclusiveContent() {
    const exclusiveContent = useAppSelector(selectAuthStateExclusiveContent) as boolean;

    const [checkedBox, setCheckedBox] = React.useState(false);
    const [agreementSent, setAgreementSet] = React.useState(false);

    let router = useRouter();

    const exclusiveAgreement = useAppSelector(selectAuthStateExclusiveAgreement);

    useEffect(() => {
        if (window.sessionStorage.getItem('exclusiveAgreement') === "true") {
            setAgreementSet(true);
        }
    }, []);

    const exclusiveContentLink = async () => {
        let name = fetch(
            `${config.rootPath}/api/stripe/createConnectedAccount`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: '{}',
                credentials: "include"
            }
        ).then((res) => res.json());

        const [res] = await Promise.all([name]);

        if (res !== undefined && res["account"] !== undefined) {
            window.location.replace(res["account"]);
        }
    };

    const createProjectRedirect = () => {
        window.sessionStorage.setItem("exclusiveProject", "true");
        router.push("/create-challenge");
    };

    const setExclusiveAgreement = async () => {
        let name = fetch(
            `${config.rootPath}/api/user/updateExclusiveAgreement`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: '{}',
                credentials: "include"
            }
        ).then((res) => res.json());

        const [res] = await Promise.all([name]);

        if (res === undefined || res["message"] === undefined || res["message"] !== "user agreement updated") {
            swal("We are unable to process your request at this time. Please try again later.");
        } else {
            window.sessionStorage.setItem("exclusiveAgreement", "true");
            setAgreementSet(true);
        }
    };

    return (
        <Container>
            <SectionContainer>
                <Typography variant="h2">What Exclusive Content Is</Typography>
                <ContentBox>
                    <TextContainer>
                        <Typography variant="body1" paragraph>
                            Exclusive coding projects are unique, premium programming challenges or assignments that users can access by paying a fee. These projects are designed to provide a stimulating and rewarding learning experience, allowing users to develop and hone their coding skills by working on real-world problems or innovative ideas.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            These exclusive coding projects often come with detailed instructions, sample code, and test cases to help users understand the problem and validate their solutions. They may also include expert guidance, mentorship, or a more detailed tutorial.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            By attempting these exclusive coding projects, users can improve their programming abilities, expand their knowledge in specific domains, and showcase their skills to potential employers or clients. The projects can also serve as an excellent addition to a user&apos;s portfolio, demonstrating their expertise and commitment to continuous learning.
                        </Typography>
                    </TextContainer>
                </ContentBox>
            </SectionContainer>
            <SectionContainer>
                <Typography variant="h2">How to Create Exclusive Content</Typography>
                <ContentBox>
                    <TextContainer>
                        <Typography variant="body1" paragraph>
                            Creating exclusive content is easy, but it is important to know that the standard for a challenge being worthy of being exclusive is higher than general content. Before being able to make any exclusive content, you must also create a connected account for you to receive money into.
                        </Typography>
                        <ul>
                            <li>Create a connected account by either going to account settings or clicking the &apos;Setup Exclusive Content Account&apos; button below.</li>
                            <li>Once you have created a connected account, can get started by clicking the &apos;Create Exclusive Content&apos; button below.</li>
                            <li>When you get serious about creating exclusive content, click the &apos;Don&apos;t Show Me This Page Again&apos; button below and submit it.</li>
                            <li>Just know, once you hit that button you will only be able to get to this page through the About page.</li>
                            <li>After you have confirmed to have read this page, clicking the &apos;Exclusive Content&apos; button in the top menu will take you straight to creating exclusive content.</li>
                        </ul>
                    </TextContainer>
                </ContentBox>
            </SectionContainer>
            <SectionContainer>
                <Grid container justifyContent="center">
                    <Grid item>
                        {exclusiveContent !== undefined && exclusiveContent ? (
                            <Button variant="contained" color="primary" onClick={createProjectRedirect}>
                                Create Exclusive Content
                            </Button>
                        ) : (
                            <Button variant="contained" color="primary" onClick={exclusiveContentLink}>
                                Setup Exclusive Content Account
                            </Button>
                        )}
                    </Grid>
                </Grid>
            </SectionContainer>
            <SectionContainer>
                {!agreementSent && (
                    <Grid container justifyContent="center">
                        <Grid item>
                            <FormControlLabel
                                control={<Checkbox checked={checkedBox} onChange={() => setCheckedBox(!checkedBox)} />}
                                label="Don't Show Me This Page Again"
                            />
                            {checkedBox && (
                                <Button variant="contained" color="secondary" onClick={setExclusiveAgreement}>
                                    Submit
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                )}
            </SectionContainer>
        </Container>
    );
}

export default ExclusiveContent;

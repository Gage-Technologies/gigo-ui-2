'use client'
import {LoadingButton} from "@mui/lab";
import * as React from "react";
import swal from "sweetalert";
import {useState} from "react";
import config from "@/config";


export default function TutorialClaimTrialButton() {
    const [isClient, setIsClient] = React.useState(false)
    React.useEffect(() => {
        setIsClient(true)
    }, [])

    const [proMonthlyLink, setProMonthlyLink] = useState("");
    const [proYearlyLink, setProYearlyLink] = useState("");
    const [loadingProLinks, setLoadingProLinks] = useState(false)

    const retrieveProUrls = async (): Promise<{ monthly: string, yearly: string } | null> => {
        return await fetch(
            `${config.rootPath}/api/stripe/premiumMembershipSession`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: '{}',
                credentials: 'include'
            }
        ).then(async (response) => {
            let data: {return_url?: string, return_year?: string, message?: string} = await response.json();
            if (data.return_url !== undefined && data.return_year !== undefined) {
                setProMonthlyLink(data.return_url)
                setProYearlyLink(data.return_year)
                return {
                    "monthly": data.return_url,
                    "yearly": data.return_year,
                }
            }
            return null
        })
    }

    const handleClaimButtonClick = React.useCallback(async () => {
        if (!isClient) {
            return
        }

        setLoadingProLinks(true)

        // first let's check if we have a cached session - we hope so cause it'll be way faster
        let mlink = proMonthlyLink
        let ylink = proYearlyLink
        if (mlink == "" || ylink != "") {
            // retrieve the urls if they aren't cached
            let links = await retrieveProUrls()
            if (links === null) {
                swal("Server Error", "This is awkward... The server is having a fit. We hope you claim your trial another time!", "error")
                return
            }
            mlink = links.monthly
        }

        // open the monthly link in a new tab
        window.open(mlink, "_blank");

        setLoadingProLinks(false)
    }, [isClient])

    return (
        <LoadingButton loading={loadingProLinks} variant="contained"
                       onClick={handleClaimButtonClick}>
            Claim Free Month
        </LoadingButton>
    )
}

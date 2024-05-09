import * as React from "react";
import {Box} from "@mui/material";
import config from "@/config";

function PrivacyPolicy() {

    return (
        <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            sx={{width: "100%", height: "100%", paddingTop: "20px"}}
        >
            <object
                data={config.rootPath + "/static/ui/PRIVACY_POLICY.pdf"}
                width={1800}
                height={1000}
            />
        </Box>
    );
}

export default PrivacyPolicy;
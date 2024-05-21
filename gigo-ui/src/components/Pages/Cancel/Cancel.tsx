'use client'
import {Button} from "@mui/material";
import config from "@/config";

export default function StripeCancel() {
    return (
        <div style={{
            backgroundColor: "black",
            backgroundImage: `url(${config.rootPath}/cloudstore/images/goodbye_gorilla.png)`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            overflowX: "hidden",
            msOverflowX: "hidden"
        }}>
            <div style={{ display: "flex", width: "98vw", justifyContent: "center", height: "98vh", alignItems: "center", overflow: "hidden", flexDirection: "column"}}>
                <div>
                    <Button href="/home" variant={"contained"}> Take Me Home </Button>
                </div>
            </div>
        </div>
    )
}

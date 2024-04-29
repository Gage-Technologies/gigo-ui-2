import React from "react";
import compass from '../../img/journey/compass.svg';

export type AboutPageStyle = {
    style: React.CSSProperties;
};

function JourneyIcon(props: AboutPageStyle) {
    return (
        <div style={{display: "flex", justifyContent: "center"}}>
            <img alt="" src={compass} style={props.style}/>
        </div>
    );
}

export default JourneyIcon;
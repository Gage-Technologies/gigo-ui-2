import {Button} from "@mui/material";
import config from "../../config";

export default function ProjectPayment(props) {
  //look into adding metadata here
  const handleClick = async e => {
    let res = await fetch(
      `${config.rootPath}/api/stripe/stripeCheckoutSession`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          priceId: props.price,
          postId: props.post
        }),
        credentials: 'include'
      }
    ).then(async (response) => response.json())

    if (res !== undefined && res["return_url"] !== undefined){
      window.location.replace(res["return_url"])
    }
  }

  return (
    <Button onClick={handleClick}  style={{width: "75%", height: "30%", fontFamily: "Poppins"}} variant={"contained"}>Purchase </Button>

  )
}
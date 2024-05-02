import {Box, CircularProgress} from "@mui/material";

const SuspenseFallback = () => (
    <Box
        position="absolute"
        top="50%"
        left="50%"
        style={{ transform: 'translate(-50%, -50%)' }}
    >
        <CircularProgress color="inherit" />
    </Box>
)

export default SuspenseFallback;
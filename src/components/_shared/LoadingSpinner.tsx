import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { FC } from "react";

const LoadingSpinner: FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="50vh">
      <CircularProgress size={100} />
    </Box>
  );
};

export default LoadingSpinner;
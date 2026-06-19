import React, { use, useEffect, useState } from "react";
import {  
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Stack,
  Divider, } from "@mui/material";
import { motion } from "framer-motion";


function DefaultScreen(){
    return(
    <Box
  component={motion.div}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.25 }}
>
        <Box>
            <Typography variant="h4">Musisz się zalogować by uzywać funkcji strony</Typography>
        </Box>
         </Box>
    )
}

export default DefaultScreen;
import React, { useState } from "react";
import { Box, createTheme, ThemeProvider } from "@mui/material";

import DrawerData from "./DrawerData";

export default function BoxData({ matrixData, rowIndex, colIndex }) {
  const theme = createTheme({
    palette: {
      primary: { main: "#007FFF" },
      secondary: { main: "#FF4081" },
      custom: {
        empty: "#EEEEEE",
        full: "#A5D6A7",
        selected: "#FFE082",
        hover: "#81C784",
      },
    },
  });

  const [parcelCoordinatesSelected, setParcelCoordinatesSelected] =
    useState("");
  const [parcelDataSelected, setParcelDataSelected] = useState([]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    if (!open) {
      setParcelCoordinatesSelected("");
      setParcelDataSelected([]);
    }
    setDrawerOpen({ ...drawerOpen, [anchor]: open });
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Box
          sx={(theme) => ({
            width: "100%",
            height: 100,
            borderRadius: 1,
            bgcolor:
              matrixData[rowIndex] && matrixData[rowIndex][colIndex]
                ? parcelCoordinatesSelected === `${rowIndex}-${colIndex}`
                  ? theme.palette.custom.selected
                  : theme.palette.custom.full
                : theme.palette.custom.empty,
            "&:hover": {
              bgcolor:
                matrixData[rowIndex] && matrixData[rowIndex][colIndex]
                  ? theme.palette.custom.hover
                  : "",
            },
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          })}
          onClick={() => {
            if (matrixData[rowIndex] && matrixData[rowIndex][colIndex]) {
              toggleDrawer("right", true)(event);
              setParcelCoordinatesSelected(`${rowIndex}-${colIndex}`);
              setParcelDataSelected(matrixData[rowIndex][colIndex]);
            }
          }}
        >
          {matrixData[rowIndex] && matrixData[rowIndex][colIndex]
            ? matrixData[rowIndex][colIndex].Plot_id
            : ""}
        </Box>

        {/* Drawer For Data */}
        <DrawerData
          dataSelected={parcelDataSelected}
          drawerOpen={drawerOpen}
          toggleDrawer={toggleDrawer}
        ></DrawerData>
      </ThemeProvider>
    </>
  );
}

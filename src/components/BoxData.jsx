import React, { useEffect, useState } from "react";
import { Box, createTheme, ThemeProvider } from "@mui/material";

import DrawerData from "./DrawerData";

export default function BoxData({ matrixData, rowIndex, colIndex, filters }) {
  const theme = createTheme({
    palette: {
      primary: { main: "#007FFF" },
      secondary: { main: "#FF4081" },
      custom: {
        empty: "#EEEEEE",
        full: "#A5D6A7",
        selected: "#388E3C",
        hover: "#388E3C",
        filtered: "#FFE082",
      },
    },
  });

  const { FiBLIdFilter } = filters;

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

  const customizeBoxDesign = () => {
    if (matrixData[rowIndex] && matrixData[rowIndex][colIndex]) {
      if (FiBLIdFilter) {
        if (FiBLIdFilter === matrixData[rowIndex][colIndex].FiBL_id) {
          return theme.palette.custom.filtered;
        } else if (parcelCoordinatesSelected === `${rowIndex}-${colIndex}`) {
          return theme.palette.custom.selected;
        } else {
          return theme.palette.custom.full;
        }
      } else {
        if (parcelCoordinatesSelected === `${rowIndex}-${colIndex}`) {
          return theme.palette.custom.selected;
        } else {
          return theme.palette.custom.full;
        }
      }
    } else return theme.palette.custom.empty;
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Box
          sx={(theme) => ({
            width: "100%",
            height: 100,
            borderRadius: 1,
            bgcolor: customizeBoxDesign,
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

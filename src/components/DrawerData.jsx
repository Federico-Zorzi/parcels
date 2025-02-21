import { Box, Drawer, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function DrawerData({ dataSelected, drawerOpen, toggleDrawer }) {
  return (
    <>
      {/* Drawer For Data */}
      <Drawer
        anchor="right"
        open={drawerOpen["right"]}
        onClose={toggleDrawer("right", false)}
      >
        <Box sx={{ width: 300, p: 2 }}>
          <IconButton
            onClick={toggleDrawer("right", false)}
            sx={{ float: "right" }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" gutterBottom>
            Plot Details
          </Typography>
          {dataSelected && (
            <Box>
              {Object.entries(dataSelected).map(([data, value]) => (
                <Typography key={data}>
                  <strong>{data}:</strong> {value}
                </Typography>
              ))}
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
}

/*  */

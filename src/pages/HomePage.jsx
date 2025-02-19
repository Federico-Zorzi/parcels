import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";

import {
  Typography,
  Button,
  Box,
  Grid2,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
} from "@mui/material";
import { UploadFile as UploadFileIcon } from "@mui/icons-material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

export default function HomePage() {
  const defaultData = {
    Parcel: "",
    images: "",
    imagesUrl: "",
    try1: "",
    try2: "",
    try3: "",
    try4: "",
    try5: "",
    try6: "",
    try7: "",
    try8: "",
    try9: "",
  };
  const [fileName, setFileName] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [originalDataWithImages, setOriginalDataWithImages] = useState([]);
  const [parcelSelected, setParcelSelected] = useState(0);

  const fileInputRef = useRef(null);

  const [images, setImages] = useState([]);

  const convertImagesFromFileExcel = (excelData, arrayImages) => {
    const imgConversion = excelData.map((data) => {
      const findImgInFolder = arrayImages.find(
        (image) =>
          image.imagePath === data.images || image.imagePath === "default.svg"
      );

      if (findImgInFolder) {
        return { ...data, imagesUrl: findImgInFolder.urlImage };
      } else {
        return {
          ...data,
          imagesUrl: "No images fouded, no URL",
        };
      }
    });
    setOriginalDataWithImages(imgConversion);
  };

  const handleFileSelection = (event) => {
    event.preventDefault();
    const files = event.target.files;

    if (!files || files.length === 0) return;

    const file = files[0];

    if (file.type.includes("spreadsheetml")) {
      handleFileExcelUpload(event, file);
    } else if (file.type.startsWith("image/")) {
      handleImagesUpload(event, files);
    } else {
      alert("Invalid file type! Please select an Excel file or image files.");
    }
  };

  const handleDropFileExcel = (event) => {
    event.preventDefault();

    const file = event.dataTransfer.files[0];

    if (file && file.type.includes("spreadsheetml")) {
      handleFileExcelUpload(event, file);
    } else {
      alert("Please upload a valid Excel file!");
    }
  };

  const handleFileExcelUpload = (event, externalFile = null) => {
    event.preventDefault();

    const file =
      externalFile || event.dataTransfer?.files?.[0] || event.target.files?.[0];

    if (!file || !file.type.includes("spreadsheetml")) {
      alert("Please upload a valid Excel file!");
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target?.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });

      // Assuming the first sheet
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert sheet to JSON
      const parsedData = XLSX.utils.sheet_to_json(sheet);

      convertImagesFromFileExcel(parsedData, images);

      // Store data in state
      setOriginalData(parsedData);
    };

    reader.readAsBinaryString(file);
  };

  const handleDropImages = async (event) => {
    event.preventDefault();
    const fileList = event.dataTransfer.files;

    if (fileList.length === 0) return;

    handleImagesUpload(event, fileList);
  };

  // Modifica: Funzione che gestisce l'upload delle immagini da cartella
  const handleImagesUpload = async (event, fileList) => {
    const imagesArray = [];

    // Itera sui file selezionati o dropati
    for (const file of fileList) {
      if (file.type.startsWith("image/")) {
        imagesArray.push(file);
      }
    }

    if (imagesArray.length > 0) {
      const imagesObj = imagesArray.map((image) => ({
        imagePath: image.name,
        urlImage: URL.createObjectURL(image), // Crea URL per l'immagine
      }));

      setImages(imagesObj);
    } else {
      alert("No images loaded!");
    }
  };

  useEffect(() => {
    if (originalData.length > 0 && images.length > 0) {
      convertImagesFromFileExcel(originalData, images);
    }
  }, [images]);

  useEffect(() => {
    console.log("fileName", fileName);
    console.log("originalDataWithImages", originalDataWithImages);
    console.log("images", images);
  }, [images, originalDataWithImages]);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawerOpen({ ...drawerOpen, [anchor]: open });
  };

  const drawerSection = (anchor, parcelData) => {
    /*    console.log("parcelData", parcelData); */
    return (
      <Box
        sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 400 }}
        role="presentation"
        onClick={toggleDrawer(anchor, false)}
        onKeyDown={toggleDrawer(anchor, false)}
      >
        <List>
          {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <span>parcelData: {parcelData.Parcel}</span>
      </Box>
    );
  };

  return (
    <main>
      <div className="container pt-3">
        <h2>Upload Excel File</h2>
        <Grid2
          container
          spacing={2}
          sx={{ justifyContent: "center", alignItems: "end" }}
        >
          {/* Upload File Excel */}
          <Grid2>
            {/* File Input */}
            <input
              type="file"
              /* directory="" */
              multiple
              onChange={handleFileSelection}
              ref={fileInputRef}
              style={{ display: "none" }}
              id="file-input"
            />

            {/* Upload Button */}
            <label htmlFor="file-input">
              <Button variant="contained" component="span">
                📂 Select File Excel / Images
              </Button>
            </label>

            {/* Show Selected File Name */}
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Selected file: {fileName || "No file selected"}
            </Typography>

            {/* Drop Zone Excel */}
            <Box
              onClick={() => fileInputRef.current.click()}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={handleDropFileExcel}
              sx={{
                width: 400,
                height: 200,
                border: 2,
                borderStyle: "dashed",
                borderColor: "primary.main",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                cursor: "pointer",
                margin: "20px auto",
              }}
            >
              Drag & Drop Excel File Here
            </Box>
          </Grid2>

          {/* Upload File Excel */}
          <Grid2>
            {/* Drop Zone Images */}
            <Box
              onClick={() => fileInputRef.current.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDropImages}
              sx={{
                width: 400,
                height: 200,
                border: 2,
                borderStyle: "dashed",
                borderColor: "primary.main",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                cursor: "pointer",
                margin: "20px auto",
              }}
            >
              Drag & Drop Images Here
            </Box>
          </Grid2>
        </Grid2>

        {/* Display uploaded data */}
        {originalData.length > 0 && (
          <table
            border="1"
            style={{ marginTop: "20px", borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                {Object.keys(originalData[0]).map((key) => (
                  <th
                    key={key}
                    style={{ padding: "5px", background: "#f0f0f0" }}
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {originalData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, idx) => (
                    <td key={idx} style={{ padding: "5px" }}>
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <hr />

        {
          <Grid2 container spacing={2} sx={{ my: 2 }}>
            {originalDataWithImages.map((data, index) => (
              <Grid2 key={index}>
                <Box
                  onClick={(event) => {
                    setParcelSelected(index);
                    toggleDrawer("right", true)(event);
                  }}
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: 1,
                    bgcolor: "primary.main",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {data.Parcel}
                </Box>
              </Grid2>
            ))}
          </Grid2>
        }

        <Drawer
          anchor={"right"}
          open={drawerOpen["right"]}
          onClose={toggleDrawer("right", false)}
        >
          {drawerSection(
            "right",
            originalDataWithImages[parcelSelected] || defaultData
          )}
        </Drawer>
      </div>
    </main>
  );
}

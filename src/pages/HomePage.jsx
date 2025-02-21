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
  ListItemText,
  Paper,
} from "@mui/material";
import { UploadFile as UploadFileIcon } from "@mui/icons-material";

export default function HomePage() {
  const [fileName, setFileName] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [originalDataWithImages, setOriginalDataWithImages] = useState([]);
  const [parcelSelected, setParcelSelected] = useState("");
  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [numRows, setNumRows] = useState(0);
  const [numCols, setNumCols] = useState(0);
  const [matrixData, setMatrixData] = useState([]);

  function createMatrix(rows, cols, defaultValue = null) {
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => defaultValue)
    );
  }

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
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      // Convert sheet to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const maxRow = Math.max(...jsonData.map((item) => item.Row));
      const maxCol = Math.max(...jsonData.map((item) => item.Column));
      /* console.log("data", jsonData); */
      console.log("Max Row:", maxRow, "Max Col:", maxCol);
      setNumRows(maxRow);
      setNumCols(maxCol);
      let newMatrixLayout = createMatrix(maxRow, maxCol, 0);

      jsonData.forEach((data) => {
        /* console.log(`Row: ${data.Row}, Column: ${data.Column}`); */
        const row = Number(data.Row);
        const col = Number(data.Column);

        newMatrixLayout[row - 1][col - 1] = data;
      });
      setMatrixData(newMatrixLayout);

      convertImagesFromFileExcel(jsonData, images);

      // Store data in state
      setOriginalData(jsonData);
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

  const convertImagesFromFileExcel = (excelData, arrayImages) => {
    /* console.log("excelData", excelData);
    console.log("arrayImages", arrayImages); */

    const imgConversion = excelData.map((data) => {
      let findImgInFolder = null;

      findImgInFolder = arrayImages.find(
        (image) => image.imagePath === data.images
      );

      if (findImgInFolder) {
        return { ...data, imagesUrl: findImgInFolder.urlImage };
      } else {
        return {
          ...data,
          imagesUrl: "/parcels/img/default.svg",
        };
      }
    });
    setOriginalDataWithImages(imgConversion);
  };

  /*   useEffect(() => {
    /* console.log("fileName", fileName); */
  /* console.log("originalData", originalData); */
  /* console.log("originalDataWithImages", originalDataWithImages); */
  /* console.log("images", images); 
  }, [images, originalData]); */

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    if (!open) setParcelSelected("");
    setDrawerOpen({ ...drawerOpen, [anchor]: open });
  };

  const drawerSection = (anchor, parcelData) => {
    /* console.log("parcelData", parcelData); */
    return (
      <Box
        sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 400 }}
        role="presentation"
        onClick={toggleDrawer(anchor, false)}
        onKeyDown={toggleDrawer(anchor, false)}
      >
        <Grid2 container sx={{ justifyContent: "center" }}>
          <img
            src={parcelData.imagesUrl}
            alt="List Item Image"
            style={{ width: 200, height: 150, borderRadius: "8px" }}
          />
        </Grid2>
        <List>
          <ListItem>
            <ListItemText primary={parcelData.Parcel} />
          </ListItem>
        </List>
      </Box>
    );
  };

  console.log("matrixData", matrixData);

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
              multiple
              onChange={handleFileSelection}
              ref={fileInputRef}
              style={{ display: "none" }}
              id="file-input"
            />

            {/* Upload Button */}
            <label htmlFor="file-input">
              <Button variant="contained" component="span">
                <UploadFileIcon />
                {/*  */}
                Select File Excel / Images
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
        {/* LAYOUT CON DRAWER CREATO TEMPORANEAMENTE */}
        {/* {
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
                    bgcolor:
                      parcelSelected === index
                        ? "secondary.main"
                        : "primary.main",
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
        </Drawer> */}

        {/* NEW LAYOUT */}
        {matrixData.length > 0 ? (
          <div>
            {/* Column Numbers */}
            <Grid2
              container
              spacing={2}
              sx={{
                my: 2,
                display: "flex",
                gridTemplateColumns: `repeat(${numCols + 1}, 1fr)`,
              }}
            >
              {/* Empty space for row numbers */}
              <Grid2 xs={1}></Grid2>
              {/* Column Headers */}
              {Array.from({ length: numCols }, (_, colIndex) => (
                <Grid2 xs={1} key={`col-${colIndex}`}>
                  <Typography align="center">{colIndex + 1}</Typography>
                </Grid2>
              ))}
            </Grid2>

            {/* Grid Layout with Row Numbers */}
            <Grid2
              container
              spacing={2}
              sx={{
                display: "grid",
                gridTemplateColumns: `repeat(${numCols + 1}, 1fr)`,
                gap: 2,
              }}
            >
              {Array.from({ length: numRows }, (_, rowIndex) => (
                <React.Fragment key={`row-${rowIndex}`}>
                  {/* Row Number */}
                  <Grid2
                    xs={1}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h6">{rowIndex + 1}</Typography>
                  </Grid2>

                  {/* Row Items */}
                  {Array.from({ length: numCols }, (_, colIndex) => (
                    <Grid2 xs={1} key={`${rowIndex}-${colIndex}`}>
                      <Box
                        sx={{
                          width: 100,
                          height: 100,
                          borderRadius: 1,
                          bgcolor:
                            parcelSelected === `${rowIndex}-${colIndex}`
                              ? "secondary.main"
                              : "primary.main",
                          "&:hover": {
                            bgcolor: "primary.dark",
                          },
                          color: "white",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onClick={() =>
                          setParcelSelected(`${rowIndex}-${colIndex}`)
                        }
                      >
                        {/* Displaying data, assuming value has Plot_id */}
                        {matrixData[rowIndex] && matrixData[rowIndex][colIndex]
                          ? matrixData[rowIndex][colIndex].Plot_id
                          : "Empty"}
                      </Box>
                    </Grid2>
                  ))}
                </React.Fragment>
              ))}
            </Grid2>
          </div>
        ) : null}
      </div>
    </main>
  );
}

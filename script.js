document.addEventListener("DOMContentLoaded", () => {
  const gridContainer = document.getElementById("grid");
  const rowsInput = document.getElementById("rows");
  const colsInput = document.getElementById("cols");
  const colorPicker = document.getElementById("color");
  const generateGridButton = document.getElementById("generateGrid");
  const saveGridButton = document.getElementById("saveGrid");
  const loadGridInput = document.getElementById("loadGrid");
  const loadImageInput = document.getElementById("loadImage");
  const backgroundImage = document.getElementById("backgroundImage");
  const imageWidthInput = document.getElementById("imageWidth");
  const imageHeightInput = document.getElementById("imageHeight");
  const countBeadsButton = document.getElementById("countBeads");
  const downloadImageButton = document.getElementById("downloadImage");
  const beadsCountContainer = document.getElementById("beadsCount");
  const rowNumbers = document.getElementById("rowNumbers");
  const columnNumbers = document.getElementById("columnNumbers");

  generateGridButton.addEventListener("click", () => {
    generateGrid(rowsInput.value, colsInput.value);
  });

  saveGridButton.addEventListener("click", saveGrid);
  loadGridInput.addEventListener("change", loadGrid);
  loadImageInput.addEventListener("change", loadImage);
  countBeadsButton.addEventListener("click", countBeads);
  downloadImageButton.addEventListener("click", downloadImage);

  imageWidthInput.addEventListener("input", updateImageSize);
  imageHeightInput.addEventListener("input", updateImageSize);

  function generateGrid(rows, cols) {
    gridContainer.innerHTML = "";
    gridContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    rowNumbers.innerHTML = "";
    columnNumbers.innerHTML = "";

    for (let i = 0; i < rows; i++) {
      const rowNumber = document.createElement("div");
      rowNumber.textContent = i + 1;
      rowNumbers.appendChild(rowNumber);
    }

    for (let j = 0; j < cols; j++) {
      const colNumber = document.createElement("div");
      colNumber.textContent = j + 1;
      columnNumbers.appendChild(colNumber);
    }

    for (let i = 0; i < rows * cols; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.addEventListener("click", () => {
        cell.style.backgroundColor = colorPicker.value;
      });
      gridContainer.appendChild(cell);
    }
  }

  function saveGrid() {
    const rows = rowsInput.value;
    const cols = colsInput.value;
    const gridData = {
      rows: rows,
      cols: cols,
      colors: [],
    };

    const cells = gridContainer.children;
    for (let cell of cells) {
      gridData.colors.push(cell.style.backgroundColor);
    }

    const blob = new Blob([JSON.stringify(gridData)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "beading_pattern.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function loadGrid(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const gridData = JSON.parse(e.target.result);
      rowsInput.value = gridData.rows;
      colsInput.value = gridData.cols;
      generateGrid(gridData.rows, gridData.cols);

      const cells = gridContainer.children;
      gridData.colors.forEach((color, index) => {
        cells[index].style.backgroundColor = color;
      });
    };
    reader.readAsText(file);
  }

  function loadImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      backgroundImage.src = e.target.result;
      updateImageSize();
    };
    reader.readAsDataURL(file);
  }

  function updateImageSize() {
    const imageWidth = imageWidthInput.value;
    const imageHeight = imageHeightInput.value;
    if (imageWidth) {
      backgroundImage.style.width = `${imageWidth}px`;
    }
    if (imageHeight) {
      backgroundImage.style.height = `${imageHeight}px`;
    }
  }

  function countBeads() {
    const cells = gridContainer.children;
    const colorCounts = {};

    for (let cell of cells) {
      const color = cell.style.backgroundColor;
      if (color) {
        const colorName = getColorName(color);
        if (colorCounts[colorName]) {
          colorCounts[colorName]++;
        } else {
          colorCounts[colorName] = 1;
        }
      }
    }

    beadsCountContainer.innerHTML = "";
    for (const [color, count] of Object.entries(colorCounts)) {
      const colorElement = document.createElement("div");
      colorElement.textContent = `${color}: ${count}`;
      beadsCountContainer.appendChild(colorElement);
    }
  }

  function getColorName(rgbColor) {
    const colors = {
      "rgb(0, 0, 0)": "Чёрный",
      "rgb(255, 255, 255)": "Белый",
      "rgb(255, 0, 0)": "Красный",
      "rgb(0, 255, 0)": "Зелёный",
      "rgb(0, 0, 255)": "Синий",
      "rgb(255, 255, 0)": "Жёлтый",
      "rgb(0, 255, 255)": "Голубой",
      "rgb(255, 0, 255)": "Фиолетовый",
      "rgb(128, 0, 0)": "Бордовый",
      "rgb(128, 128, 0)": "Оливковый",
      "rgb(0, 128, 0)": "Зелёный",
      "rgb(128, 0, 128)": "Фиолетовый",
      "rgb(0, 128, 128)": "Сине-зелёный",
      "rgb(0, 0, 128)": "Тёмно-синий",
    };
    return colors[rgbColor] || rgbColor;
  }

  function downloadImage() {
    const rows = rowsInput.value;
    const cols = colsInput.value;
    const cellSize = 20; // размер одной ячейки
    const labelSize = 20; // размер разметки

    const canvas = document.createElement("canvas");
    canvas.width = cols * cellSize + labelSize;
    canvas.height = rows * cellSize + labelSize;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "12px Arial";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = 0; i < rows; i++) {
      ctx.fillText(
        i + 1,
        labelSize / 2,
        labelSize + i * cellSize + cellSize / 2
      );
    }

    for (let j = 0; j < cols; j++) {
      ctx.fillText(
        j + 1,
        labelSize + j * cellSize + cellSize / 2,
        labelSize / 2
      );
    }

    const cells = gridContainer.children;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const index = row * cols + col;
        const color = cells[index].style.backgroundColor;
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(
            labelSize + col * cellSize,
            labelSize + row * cellSize,
            cellSize,
            cellSize
          );
        }
        ctx.strokeStyle = "#ccc";
        ctx.strokeRect(
          labelSize + col * cellSize,
          labelSize + row * cellSize,
          cellSize,
          cellSize
        );
      }
    }

    // Сохранение изображения
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "beading_pattern.png";
    link.click();
  }

  generateGrid(rowsInput.value, colsInput.value);
});

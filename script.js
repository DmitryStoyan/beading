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
  const beadsCountContainer = document.getElementById("beadsCount");
  const downloadImageButton = document.getElementById("downloadImage");
  const toggleDragModeButton = document.getElementById("toggleDragMode");

  let dragMode = false;
  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;

  generateGridButton.addEventListener("click", () => {
    generateGrid(rowsInput.value, colsInput.value);
  });

  saveGridButton.addEventListener("click", saveGrid);
  loadGridInput.addEventListener("change", loadGrid);
  loadImageInput.addEventListener("change", loadImage);
  countBeadsButton.addEventListener("click", countBeads);
  downloadImageButton.addEventListener("click", downloadImage);
  toggleDragModeButton.addEventListener("click", toggleDragMode);

  backgroundImage.addEventListener("mousedown", startDrag);
  window.addEventListener("mouseup", stopDrag);
  window.addEventListener("mousemove", drag);

  function startDrag(event) {
    if (dragMode) {
      offsetX = event.clientX - backgroundImage.offsetLeft;
      offsetY = event.clientY - backgroundImage.offsetTop;
      isDragging = true;
    }
  }

  function stopDrag() {
    isDragging = false;
  }

  function drag(event) {
    if (isDragging && dragMode) {
      backgroundImage.style.left = `${event.clientX - offsetX}px`;
      backgroundImage.style.top = `${event.clientY - offsetY}px`;
    }
  }

  function toggleDragMode() {
    dragMode = !dragMode;
    toggleDragModeButton.classList.toggle("active", dragMode);
    toggleDragModeButton.textContent = dragMode
      ? "Режим раскрашивания"
      : "Сдвинуть картинку";
    backgroundImage.style.cursor = dragMode ? "move" : "default";
    backgroundImage.style.pointerEvents = dragMode ? "auto" : "none";
  }

  function generateGrid(rows, cols) {
    gridContainer.innerHTML = "";
    const rowNumbers = document.getElementById("rowNumbers");
    const columnNumbers = document.getElementById("columnNumbers");
    rowNumbers.innerHTML = "";
    columnNumbers.innerHTML = "";

    for (let i = 0; i < rows; i++) {
      const rowNum = document.createElement("div");
      rowNum.textContent = i + 1;
      rowNumbers.appendChild(rowNum);
    }

    for (let i = 0; i < cols; i++) {
      const colNum = document.createElement("div");
      colNum.textContent = i + 1;
      columnNumbers.appendChild(colNum);
    }

    gridContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    for (let i = 0; i < rows * cols; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.addEventListener("click", () => {
        if (!dragMode) {
          cell.style.backgroundColor = colorPicker.value;
        }
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
      resizeImage();
    };
    reader.readAsDataURL(file);
  }

  function resizeImage() {
    const width = imageWidthInput.value;
    const height = imageHeightInput.value;
    if (width) {
      backgroundImage.style.width = `${width}px`;
    }
    if (height) {
      backgroundImage.style.height = `${height}px`;
    }
  }

  function countBeads() {
    const colorsMap = {};
    const cells = gridContainer.children;
    for (let cell of cells) {
      const color = cell.style.backgroundColor;
      if (color) {
        colorsMap[color] = (colorsMap[color] || 0) + 1;
      }
    }

    beadsCountContainer.innerHTML = "";
    for (let [color, count] of Object.entries(colorsMap)) {
      const colorName = getColorName(color);
      const countElement = document.createElement("div");
      countElement.textContent = `${colorName}: ${count}`;
      beadsCountContainer.appendChild(countElement);
    }
  }

  function getColorName(color) {
    const colors = {
      "rgb(0, 0, 0)": "Черный",
      "rgb(255, 255, 255)": "Белый",
      "rgb(255, 0, 0)": "Красный",
      "rgb(0, 255, 0)": "Зеленый",
      "rgb(0, 0, 255)": "Синий",
      "rgb(255, 255, 0)": "Желтый",
      "rgb(0, 255, 255)": "Голубой",
      "rgb(255, 0, 255)": "Фиолетовый",
    };
    return colors[color] || color;
  }

  function downloadImage() {
    const gridWrapper = document.querySelector(".grid-wrapper");
    html2canvas(gridWrapper).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL();
      link.download = "beading_pattern.png";
      link.click();
    });
  }

  generateGrid(rowsInput.value, colsInput.value);
});

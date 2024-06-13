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

  generateGridButton.addEventListener("click", () => {
    generateGrid(rowsInput.value, colsInput.value);
  });

  saveGridButton.addEventListener("click", saveGrid);
  loadGridInput.addEventListener("change", loadGrid);
  loadImageInput.addEventListener("change", loadImage);

  function generateGrid(rows, cols) {
    gridContainer.innerHTML = "";
    gridContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

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
    };
    reader.readAsDataURL(file);
  }

  generateGrid(rowsInput.value, colsInput.value);
});

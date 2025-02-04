var table;
var checkup;
var modele = [];
var finis = new Set();
var finisSpan;

function createEmptyGrid() {
  return Array(9)
    .fill(null)
    .map(() => Array(9).fill(0));
}

function isValidPlacement(grid, row, col, num) {
  // Vérifier la ligne
  if (grid[row].includes(num)) return false;

  // Vérifier la colonne
  for (let r = 0; r < 9; r++) {
    if (grid[r][col] === num) return false;
  }

  // Vérifier le bloc 3x3
  const startRow = Math.floor(row / 3) * 3; // Trouver le début de la case 3x3
  const startCol = Math.floor(col / 3) * 3;
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if (grid[r][c] === num) return false;
    }
  }

  return true;
}

function fillGrid(grid) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        const numbers = shuffle(Array.from({ length: 9 }, (_, i) => i + 1));
        for (const num of numbers) {
          if (isValidPlacement(grid, row, col, num)) {
            grid[row][col] = num;
            if (fillGrid(grid)) return true; // Continue récursivement
            grid[row][col] = 0; // Backtrack
          }
        }
        return false;
      }
    }
  }
  return true;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function order(chaine) {
  value = chaine.split("");
  value.sort((a, b) => a - b);
  return value.join("");
}

function initTable(cases, modele) {
  table = document.createElement("table");
  finisSpan = document.getElementById("finis");

  for (i = 0; i < cases; i++) {
    const tr = document.createElement("tr");
    for (j = 0; j < cases; j++) {
      const td = document.createElement("th");
      td.id = `input_${i}_${j}`;
      if (modele[i][j] !== 0) {
        const span = document.createElement("span");
        span.textContent = modele[i][j];
        td.appendChild(span);
      } else {
        const input = document.createElement("input");
        input.inputMode = "numeric";
        td.appendChild(input);
        input.addEventListener("input", function () {
          const elements = document.getElementsByTagName("th");
          this.value = this.value
            .split("")
            .filter((x) => x - "0")
            .join("");
          this.value = [...new Set(this.value)].join("");
          if (this.value.length > 1) {
            this.style.color = "yellow";
            this.style.backgroundColor = "grey";
            this.classList.add("inputSmall");
            this.classList.remove("inputLarge");
            this.parentNode.style.backgroundColor = "grey";
            this.value = order(this.value);
          } else {
            this.parentNode.style.backgroundColor = "transparent";
            this.style.backgroundColor = "transparent";
            this.classList.remove("inputSmall");
            this.classList.add("inputLarge");
            this.style.color = "gray";
            this.style.fontFamily = "cursive";
          }
          const values = [];
          for (k = 0; k < elements.length; k++) {
            const fils = elements[k].childNodes[0];
            if (fils.tagName === "INPUT") {
              values.push(elements[k].childNodes[0].value);
            } else if (fils.tagName === "SPAN") {
              values.push(elements[k].childNodes[0].textContent);
            }
          }
          for (i = 1; i < 10; i++) {
            const sumI = values.reduce(
              (prev, cur) => prev + (cur === i + "" ? 1 : 0),
              0
            );
            if (sumI === 9) {
              finis.add(i);
            } else {
              finis.delete(i);
            }
          }
          let prefix = "";
          arrayFinis = [...finis].sort((a, b) => a - b);
          for (w of arrayFinis) {
            prefix += w + " ";
          }

          finisSpan.textContent = prefix;
          const flatten = checkup.flat().map((t) => t + "");
          const valuesMap = values.join();
          const hasMultipleValue = values.some((t) => t.length > 1);

          if (!values.includes("") && !hasMultipleValue) {
            if (valuesMap == flatten.join()) {
              const allElements = document.getElementsByTagName("input");
              for (z = 0; z < allElements.length; z++) {
                allElements.item(z).classList.add("valid");
                allElements.item(z).classList.remove("invalid");
              }
              setTimeout(function () {
                replay = confirm("Bravo, vous avez trouvé !");
                if (replay) {
                  location.reload();
                }
              }, 500);
            } else {
              for (l = 0; l < 9; l++) {
                for (m = 0; m < 9; m++) {
                  const inp = document.getElementById(`input_${l}_${m}`);

                  if (values[l * 9 + m] - "" !== checkup[l][m]) {
                    if (inp.childNodes[0].tagName === "INPUT") {
                      inp.childNodes[0].classList.remove("valid");
                      inp.childNodes[0].classList.add("invalid");
                    }
                  } else {
                    if (inp.childNodes[0].tagName !== "INPUT") {
                      inp.childNodes[0].classList.remove("invalid");
                    } else {
                      inp.childNodes[0].classList.add("valid");
                    }
                  }
                }
              }
            }
          }
        });
      }
      if (j % 3 === 2 && j !== 8) {
        td.style.borderRightWidth = "10px";
        td.style.borderRightStyle = "solid";
      }
      if (i % 3 === 2 && i !== 8) {
        td.style.borderBottomWidth = "10px";
        td.style.borderBottomStyle = "solid";
      }
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
}

function removeNumbers(grid, numToRemove) {
  let attempts = numToRemove;
  while (attempts > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (grid[row][col] !== 0) {
      const backup = grid[row][col];
      grid[row][col] = 0;

      // Vérifiez si la grille reste solvable et unique
      const gridCopy = JSON.parse(JSON.stringify(grid));
      if (!hasUniqueSolution(gridCopy)) {
        grid[row][col] = backup; // Restaurez si nécessaire
      } else {
        attempts--;
      }
    }
  }
}

function hasUniqueSolution(grid) {
  let solutions = 0;

  function solve(grid) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValidPlacement(grid, row, col, num)) {
              grid[row][col] = num;
              if (solve(grid)) solutions++;
              grid[row][col] = 0;

              if (solutions > 1) return false; // Pas unique
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  solve(grid);
  return solutions === 1;
}

class Coords {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  repr() {
    return `(${this.x}, ${this.y})`;
  }
}

const keysPressed = {};

function addControls() {
  document.addEventListener("keyup", (event) => {
    delete keysPressed[event.code]; // Supprime la touche relâchée
  });

  document.addEventListener("keydown", (event) => {
    keysPressed[event.code] = true;
    const current = document.activeElement;
    if (current.tagName === "INPUT") {
      const isValidCoords = (x) => x >= 0 && x <= 8;
      const move = (coords, key) => {
        const kShift = keysPressed["KeyZ"];
        if (
          kShift &&
          ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].some(
            (key) => keysPressed[key]
          ) &&
          isValidCoords(coords.x) &&
          isValidCoords(coords.y)
        ) {
          event.preventDefault();
          let bck;
          if (key === "ArrowUp" && coords.x > 0) {
            bck = new Coords(coords.x - 1, coords.y);
          } else if (key === "ArrowDown" && coords.x < 9) {
            bck = new Coords(coords.x + 1, coords.y);
          } else if (key === "ArrowLeft" && coords.y > 0) {
            bck = new Coords(coords.x, coords.y - 1);
          } else if (key === "ArrowRight" && coords.y < 9) {
            bck = new Coords(coords.x, coords.y + 1);
          } else {
            return;
          }
          const foc = document.getElementById(`input_${bck.x}_${bck.y}`);

          if (foc && foc.childNodes[0].tagName === "INPUT") {
            foc.childNodes[0].focus();
          } else {
            move(bck, key);
          }
        }
      };
      let idParams = current.parentNode.id.split("_");
      const coords = new Coords(idParams[1] - "0", idParams[2] - "0");
      move(coords, event.key);
    }
  });
}

function generateSudokuGrid(numToRemove) {
  const grid = createEmptyGrid();
  fillGrid(grid); // Crée une grille complète valide
  checkup = grid.map((r) => [...r]);
  removeNumbers(grid, numToRemove); // Supprime des chiffres pour créer le puzzle
  return grid;
}

window.onload = function () {
  if (screen.orientation) {
    screen.orientation.lock("landscape").catch((err) => {
      console.log("Erreur de verrouillage d'orientation :", err);
    });
  }
  modele = generateSudokuGrid(56);
  addControls();
  initTable(9, modele);
  document.getElementById("game").appendChild(table);
  document.getElementById("game").appendChild(finisSpan);
};

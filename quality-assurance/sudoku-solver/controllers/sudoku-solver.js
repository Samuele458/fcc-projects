class SudokuSolver {
  getRowPos(row) {
    return row.charCodeAt() - 64;
  }

  validate(puzzleString) {
    return puzzleString.length == 81 && /^[\.0-9]+$/.test(puzzleString);
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let rowLine = puzzleString.slice(9 * (column - 1), 9 * column);
    return rowLine.indexOf(value) == -1;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let colLine = "";
    for (let i = 0; i < 9; ++i) {
      colLine += puzzleString[i * 9 + (row - 1)];
    }
    return colLine.indexOf(value) == -1;
  }

  checkAll(puzzleString, row, column, value) {
    return (
      this.checkColPlacement(puzzleString, row, column, value) &
      this.checkRowPlacement(puzzleString, row, column, value) &
      this.checkRegionPlacement(puzzleString, row, column, value)
    );
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let rowRegion = Math.floor((row - 1) / 3);
    let columnRegion = Math.floor((column - 1) / 3);
    let region = "";

    for (let i = 0; i < 3; ++i) {
      for (let j = 0; j < 3; ++j) {
        region += puzzleString[columnRegion * 27 + i * 9 + rowRegion * 3 + j];
      }
    }

    return region.indexOf(value) == -1;
  }

  splitByRow(puzzleString) {
    let rows = [];

    for (let i = 0; i < 9; ++i) {
      let row = [];
      for (let j = 0; j < 9; ++j) {
        row.push({ value: puzzleString[i * 9 + j], row: j, col: i });
      }
      rows.push(row);
    }
    return rows;
  }

  splitByCol(puzzleString) {
    let cols = [];
    for (let i = 0; i < 9; ++i) {
      let col = [];
      for (let j = 0; j < 9; ++j) {
        col.push({ value: puzzleString[j * 9 + i], row: i, col: j });
      }
      cols.push(col);
    }
    return cols;
  }

  splitByRegion(puzzleString) {
    let regions = [];
    for (let i = 0; i < 9; ++i) {
      let region = [];
      for (let j = 0; j < 9; ++j) {
        region.push({
          value:
            puzzleString[
              Math.floor(i / 3) * 27 +
                (i % 3) * 3 +
                Math.floor(j / 3) * 9 +
                (j % 3)
            ],
          row: (i % 3) * 3 + (j % 3),
          col: Math.floor(i / 3) * 3 + Math.floor(j / 3),
        });
      }
      regions.push(region);
    }
    return regions;
  }

  setNumber(puzzleString, index, replacement) {
    return (
      puzzleString.substr(0, index) +
      replacement +
      puzzleString.substr(index + 1)
    );
  }

  solve(puzzleString) {
    let puzzle = puzzleString;
    let startPuzzle;
    do {
      startPuzzle = puzzle;
      for (let num = 1; num <= 9; ++num) {
        let groupsFun = [this.splitByRow, this.splitByCol, this.splitByRegion];

        groupsFun.forEach((fun) => {
          let groups = fun(puzzle);
          groups.forEach((group) => {
            let cellsToAdd = [];
            group.forEach((cell) => {
              if (
                cell.value == "." &&
                this.checkAll(puzzle, cell.row + 1, cell.col + 1, num)
              ) {
                cellsToAdd.push(cell);
              }
            });
            if (cellsToAdd.length === 1)
              puzzle = this.setNumber(
                puzzle,
                cellsToAdd[0].col * 9 + cellsToAdd[0].row,
                num
              );
          });
        });
      }
    } while (puzzle != startPuzzle && puzzle.indexOf(".") != -1);

    if (puzzle.indexOf(".") != -1) return undefined;

    return puzzle;
  }
}

module.exports = SudokuSolver;

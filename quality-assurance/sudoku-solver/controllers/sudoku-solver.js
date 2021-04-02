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

  solve(puzzleString) {}
}

module.exports = SudokuSolver;

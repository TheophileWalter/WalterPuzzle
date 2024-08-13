class WalterPiece {

    constructor(pieceNumber) {
        this.number = pieceNumber;
        this.up = Boolean(pieceNumber >> 0 & 0b1);
        this.right = Boolean(pieceNumber >> 1 & 0b1);
        this.down = Boolean(pieceNumber >> 2 & 0b1);
        this.left = Boolean(pieceNumber >> 3 & 0b1);
    }

}

class WalterPuzzle {

    constructor() {

        // Create a 4x4 array
        this.grid = Array.from({ length: 4 }, () => Array(4).fill(null));

        // Create a list of pieces
        // Just an array of 16 booleans to check if the piece is available
        this.pieces = Array.from({ length: 16 }, (_, i) => true);

    }

    setPiece(row, col, pieceNumber) {
        if (this.grid[row][col] !== null) {
            this.pieces[this.grid[row][col].number] = true;
        }
        this.grid[row][col] = new WalterPiece(pieceNumber);
        this.pieces[pieceNumber] = false;
    }

    getPiece(row, col) {
        return this.grid[row][col];
    }

    isPieceAvailable(pieceNumber) {
        return this.pieces[pieceNumber];
    }

    setPieceAvailable(pieceNumber, available) {
        this.pieces[pieceNumber] = available;
    }

    removePiece(row, col) {
        if (this.grid[row][col] === null) {
            return;
        }
        this.pieces[this.grid[row][col].number] = true;
        this.grid[row][col] = null;
    }

    getUp(row, col) {
        if (row === 0) {
            return null;
        }
        return this.getPiece(row - 1, col);
    }

    getRight(row, col) {
        if (col === 3) {
            return null;
        }
        return this.getPiece(row, col + 1);
    }

    getDown(row, col) {
        if (row === 3) {
            return null;
        }
        return this.getPiece(row + 1, col);
    }

    getLeft(row, col) {
        if (col === 0) {
            return null;
        }
        return this.getPiece(row, col - 1);
    }

    /**
     * Solves the puzzle game.
     * @returns {boolean} True if the puzzle was solved, false otherwise.
     */
    solve() {
        /**
         * Recursive function to solve the puzzle.
         * @param {WalterPuzzle} puzzle The puzzle to solve.
         * @param {Array<number>} remaining The list of remaining pieces to place.
         * @returns {boolean} True if the puzzle was solved, false otherwise.
         */
        function reccursiveSolver(puzzle, remaining) {
            
            // If there are no more pieces to place, check if the puzzle is solved
            if (remaining.length === 0) {
                return puzzle.getErrors().length === 0;
            }

            // Get the first piece to place
            var pieceNumber = remaining[0];

            // Try to place the piece in each empty cell
            for (var x = 0; x < 4; x++) {
                for (var y = 0; y < 4; y++) {
                    if (puzzle.getPiece(x, y) === null) {

                        // Check if the placement is invalid
                        var piece = new WalterPiece(pieceNumber);
                        var up = puzzle.getUp(x, y), right = puzzle.getRight(x, y), down = puzzle.getDown(x, y), left = puzzle.getLeft(x, y);
                        if ((up !== null && up.down == piece.up) || (right !== null && right.left == piece.right) || (down !== null && down.up == piece.down) || (left !== null && left.right == piece.left)) {
                            continue;
                        }
                        
                        // Place the piece if it is valid
                        puzzle.setPiece(x, y, pieceNumber);

                        // Recursively try to place the remaining pieces
                        if (reccursiveSolver(puzzle, remaining.slice(1))) {
                            return true;
                        }
                        
                        // Remove the piece if this configuration leads to a dead end
                        puzzle.removePiece(x, y);
                    }
                }
            }

            return false;

        }
        var remaining = this.pieces.reduce((acc, curr, index) => {
            if (curr) {
                acc.push(index);
            }
            return acc;
        }, []);
        return reccursiveSolver(this, remaining);
    }

    /**
     * Calculates and returns the errors in the puzzle game.
     * @returns {Array<number>} An array containing the numbers of the pieces with errors.
     */
    getErrors() {
        var errors = [];
        for (var i = 0; i < 16; i++) {
            var x = Math.floor(i / 4), y = i % 4;
            var piece = this.getPiece(x, y);
            if (piece === null) {
                continue;
            }
            var up = this.getUp(x, y), right = this.getRight(x, y), down = this.getDown(x, y), left = this.getLeft(x, y);
            if ((up !== null && up.down == piece.up) || (right !== null && right.left == piece.right) || (down !== null && down.up == piece.down) || (left !== null && left.right == piece.left)) {
                errors.push(parseInt(piece.number));
            }
        }
        return errors;
    }

    getHash() {
        return btoa(this.grid.flat().map(piece => piece === null ? '' : piece.number).join('-'));
    }

}

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
        console.log(`remove piece from cell ${row}-${col}`);
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

}

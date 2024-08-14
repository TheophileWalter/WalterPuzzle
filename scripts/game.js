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
        this.pieces = Array(16).fill(true);

        // List of external constraints
        this.constraints = {
            'top': Array(4).fill(null),
            'right': Array(4).fill(null),
            'bottom': Array(4).fill(null),
            'left': Array(4).fill(null)
        };

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

    setConstraint(position, number, value) {
        this.constraints[position][number] = value;
    }

    getConstraint(position, number) {
        return this.constraints[position][number];
    }

    /**
     * Solves the puzzle game.
     * @param {boolean} count If true, the function will return the number of solutions.
     * @returns {boolean|number} True if the puzzle was solved, false otherwise. If count is true, the number of solutions will be returned.
     */
    solve(count = false) {
        /**
         * Recursive function to solve the puzzle.
         * @param {WalterPuzzle} puzzle The puzzle to solve.
         * @param {Array<number>} remaining The list of remaining pieces to place.
         * @returns {boolean} True if the puzzle was solved, false otherwise.
         */
        function reccursiveSolver(puzzle, remaining) {
            
            // If there are no more pieces to place, check if the puzzle is solved
            if (remaining.length === 0) {
                return puzzle.getErrors().length === 0 ? (count ? 1 : true) : (count ? 0 : false);
            }

            // Get the first piece to place
            var pieceNumber = remaining[0];

            // Try to place the piece in each empty cell
            var totalSolutions = 0;
            for (var x = 0; x < 4; x++) {
                for (var y = 0; y < 4; y++) {
                    if (puzzle.getPiece(x, y) === null) {

                        // Check if the placement is invalid
                        var piece = new WalterPiece(pieceNumber);
                        var up = puzzle.getUp(x, y), right = puzzle.getRight(x, y), down = puzzle.getDown(x, y), left = puzzle.getLeft(x, y);

                        var topConstraint = puzzle.getConstraint('top', y),
                            rightConstraint = puzzle.getConstraint('right', x),
                            bottomConstraint = puzzle.getConstraint('bottom', y),
                            leftConstraint = puzzle.getConstraint('left', x);
                        if (((up !== null && up.down == piece.up) || (x == 0 && topConstraint !== null && topConstraint == piece.up)) ||
                            ((right !== null && right.left == piece.right) || (y == 3 && rightConstraint !== null && rightConstraint == piece.right)) ||
                            ((down !== null && down.up == piece.down) || (x == 3 && bottomConstraint !== null && bottomConstraint == piece.down)) ||
                            ((left !== null && left.right == piece.left) || (y == 0 && leftConstraint !== null && leftConstraint == piece.left))) {
                            continue;
                        }
                        
                        // Place the piece if it is valid
                        puzzle.setPiece(x, y, pieceNumber);

                        // Recursively try to place the remaining pieces
                        var result = reccursiveSolver(puzzle, remaining.slice(1));
                        if (!count && result) {
                            return true;
                        }
                        if (count) {
                            totalSolutions += result;
                        }
                        
                        // Remove the piece if this configuration leads to a dead end
                        puzzle.removePiece(x, y);
                    }
                }
            }

            return count ? totalSolutions : false;

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
            var topConstraint = puzzle.getConstraint('top', y),
                rightConstraint = puzzle.getConstraint('right', x),
                bottomConstraint = puzzle.getConstraint('bottom', y),
                leftConstraint = puzzle.getConstraint('left', x);
            if ((up !== null && up.down == piece.up) || (x == 0 && topConstraint !== null && topConstraint == piece.up) ||
                (right !== null && right.left == piece.right) || (y == 3 && rightConstraint !== null && rightConstraint == piece.right) ||
                (down !== null && down.up == piece.down) || (x == 3 && bottomConstraint !== null && bottomConstraint == piece.down) ||
                (left !== null && left.right == piece.left) || (y == 0 && leftConstraint !== null && leftConstraint == piece.left)) {
                errors.push(parseInt(piece.number));
            }
        }
        return errors;
    }

    /**
     * Returns the hash of the puzzle game.
     * @returns {string} The hash of the puzzle game.
     */
    getHash() {
        // Cells are stored on 5 bits from 0b00000 to 0b01111 for pieces 0 to 15 and 0b10000 for empty cells
        var cells = this.grid.flat().map(piece => piece === null ? '10000' : '0' + piece.number.toString(2).padStart(4, '0')).join('');
        // Constraints are stored on 2 bits: 0x00 for null, 0x01 for false and 0x10 for true
        var constraints = Object.values(this.constraints).flat().map(constraint => constraint === null ? '00' : (constraint ? '10' : '01')).join('');
        return WalterPuzzle.binaryToBase64(cells + constraints);
    }

    static fromHash(hash) {

        // Decode the hash
        var bin = WalterPuzzle.base64ToBinary(hash);

        // Parse the parts
        var numbers = [];
        for (var i = 0; i < 16; i++) {
            var piece = parseInt(bin.slice(i * 5, i * 5 + 5), 2);
            numbers.push(piece === 0b10000 ? '' : piece);
        }
        var constraints = [];
        for (var i = 0; i < 16; i++) {
            var constraint = parseInt(bin.slice(80 + i * 2, 80 + i * 2 + 2), 2);
            constraints.push(constraint === 0b00 ? '' : (constraint === 0b10 ? '1' : '0'));
        }

        // Create the puzzle
        var puzzle = new WalterPuzzle();

        // Set the pieces
        numbers.forEach((number, index) => {
            if (number !== '') {
                puzzle.setPiece(Math.floor(index / 4), index % 4, parseInt(number));
            }
        });

        // Set the constraints
        var positions = ['top', 'right', 'bottom', 'left'];
        positions.forEach((position, positionIndex) => {
            for (var i = 0; i < 4; i++) {
                var value = constraints[positionIndex * 4 + i];
                if (value === '') {
                    puzzle.setConstraint(position, i, null);
                } else {
                    puzzle.setConstraint(position, i, value === '1');
                }
            }
        });

        return puzzle;
    }

    /**
     * Converts a binary string to a base64 string.
     * @param {string} binaryString The binary string to convert.
     * @returns {string} The base64 string.
     */
    static binaryToBase64(binaryString) {
        let charString = '';
        for (let i = 0; i < binaryString.length; i += 8) {
            charString += String.fromCharCode(parseInt(binaryString.slice(i, i + 8), 2));
        }
        return btoa(charString);
    }

    /**
     * Converts a base64 string to a binary string.
     * @param {string} base64String The base64 string to convert.
     * @returns {string} The binary string.
     */
    static base64ToBinary(base64String) {
        let charString = atob(base64String);
        let binaryString = '';
        for (let i = 0; i < charString.length; i++) {
            let binaryChar = charString.charCodeAt(i).toString(2);
            binaryString += binaryChar.padStart(8, '0');
        }
        return binaryString;
    }

}

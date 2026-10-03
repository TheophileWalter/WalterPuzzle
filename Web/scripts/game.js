/**
 * Represents a piece of the Walter puzzle game.
 */
class WalterPiece {

    /**
     * Creates a new WalterPiece object.
     * @param {number} pieceNumber The number of the piece.
     */
    constructor(pieceNumber) {
        this.number = pieceNumber;
        this.up = Boolean(pieceNumber >> 0 & 0b1);
        this.right = Boolean(pieceNumber >> 1 & 0b1);
        this.down = Boolean(pieceNumber >> 2 & 0b1);
        this.left = Boolean(pieceNumber >> 3 & 0b1);
    }

}

/**
 * Represents the Walter puzzle game.
 * The game consists of a 4x4 grid of pieces.
 * Each piece is represented by a number from 0 to 15.
 * The number is a 4-bit integer where each bit represents a side of the piece.
 * The least significant bit is the top side, then right, bottom and left.
 * The value of the bit is 1 if the side is open and 0 if the side is closed.
 * For example, the number 0b1010 represents a piece with open top and bottom sides and closed right and left sides.
 * The goal of the game is to place the pieces in the grid so that the sides match.
 * The game also has external constraints that must be respected.
 * Each side of the grid can have a constraint that must be respected.
 * The constraint can be null, true or false.
 * If the constraint is null, the side has no constraint.
 * If the constraint is true, the side must be open.
 * If the constraint is false, the side must be closed.
 */
class WalterPuzzle {

    /**
     * Creates a new WalterPuzzle object.
     */
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

    /**
     * Sets a piece in the grid.
     * @param {number} row The row of the grid.
     * @param {number} col The column of the grid.
     * @param {number} pieceNumber The number of the piece to set.
     */
    setPiece(row, col, pieceNumber) {
        if (this.grid[row][col] !== null) {
            this.pieces[this.grid[row][col].number] = true;
        }
        this.grid[row][col] = new WalterPiece(pieceNumber);
        this.pieces[pieceNumber] = false;
    }

    /**
     * Gets the piece in the grid at the specified position.
     * @param {number} row The row of the grid.
     * @param {number} col The column of the grid.
     * @returns {WalterPiece|null} The piece at the specified position or null if there is no piece.
     */
    getPiece(row, col) {
        return this.grid[row][col];
    }

    /**
     * Checks if a piece is available.
     * @param {number} pieceNumber The number of the piece to check.
     * @returns {boolean} True if the piece is available, false otherwise.
     */
    isPieceAvailable(pieceNumber) {
        return this.pieces[pieceNumber];
    }

    /**
     * Sets the availability of a piece.
     * @param {number} pieceNumber The number of the piece to set.
     * @param {boolean} available True if the piece is available, false otherwise.
     */
    setPieceAvailable(pieceNumber, available) {
        this.pieces[pieceNumber] = available;
    }

    /**
     * Removes a piece from the grid.
     * @param {number} row The row of the grid.
     * @param {number} col The column of the grid.
     */
    removePiece(row, col) {
        if (this.grid[row][col] === null) {
            return;
        }
        this.pieces[this.grid[row][col].number] = true;
        this.grid[row][col] = null;
    }

    /**
     * Gets the piece above the specified position.
     * @param {number} row The row of the grid.
     * @param {number} col The column of the grid.
     * @returns {WalterPiece|null} The piece above the specified position or null if there is no piece.
     */
    getUp(row, col) {
        if (row === 0) {
            return null;
        }
        return this.getPiece(row - 1, col);
    }

    /**
     * Gets the piece to the right of the specified position.
     * @param {number} row The row of the grid.
     * @param {number} col The column of the grid.
     * @returns {WalterPiece|null} The piece to the right of the specified position or null if there is no piece.
     */
    getRight(row, col) {
        if (col === 3) {
            return null;
        }
        return this.getPiece(row, col + 1);
    }

    /**
     * Gets the piece below the specified position.
     * @param {number} row The row of the grid.
     * @param {number} col The column of the grid.
     * @returns {WalterPiece|null} The piece below the specified position or null if there is no piece.
     */
    getDown(row, col) {
        if (row === 3) {
            return null;
        }
        return this.getPiece(row + 1, col);
    }

    /**
     * Gets the piece to the left of the specified position.
     * @param {number} row The row of the grid.
     * @param {number} col The column of the grid.
     * @returns {WalterPiece|null} The piece to the left of the specified position or null if there is no piece.
     */
    getLeft(row, col) {
        if (col === 0) {
            return null;
        }
        return this.getPiece(row, col - 1);
    }

    /**
     * Sets a constraint at the specified position and number.
     * @param {string} position The position of the constraint: 'top', 'right', 'bottom' or 'left'.
     * @param {number} number The number of the constraint.
     * @param {boolean|null} value The value of the constraint or null to remove the constraint.
     */
    setConstraint(position, number, value) {
        this.constraints[position][number] = value;
    }

    /**
     * Returns the constraint at the specified position and number.
     * @param {string} position The position of the constraint: 'top', 'right', 'bottom' or 'left'.
     * @param {number} number The number of the constraint.
     * @returns {boolean|null} The value of the constraint or null if there is no constraint at this position.
     */
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

    /**
     * Creates a WalterPuzzle object from a hash.
     * @param {string} hash The hash of the puzzle game.
     * @returns {WalterPuzzle} The puzzle game.
     */
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

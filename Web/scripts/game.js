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
 * Pieces can also be locked in their cell, for example the pieces given by a challenge.
 */
class WalterPuzzle {

    /**
     * Creates a new WalterPuzzle object.
     */
    constructor() {

        // Create a 4x4 array
        this.grid = Array.from({ length: 4 }, () => Array(4).fill(null));

        // Create a 4x4 array of locked cells
        this.locked = Array.from({ length: 4 }, () => Array(4).fill(false));

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
     * @param {boolean} locked True if the piece cannot be moved by the player.
     */
    setPiece(row, col, pieceNumber, locked = false) {
        if (this.grid[row][col] !== null) {
            this.pieces[this.grid[row][col].number] = true;
        }
        this.grid[row][col] = new WalterPiece(pieceNumber);
        this.locked[row][col] = locked;
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
     * Checks if the piece at the specified position is locked.
     * @param {number} row The row of the grid.
     * @param {number} col The column of the grid.
     * @returns {boolean} True if the cell holds a locked piece.
     */
    isLocked(row, col) {
        return this.locked[row][col];
    }

    /**
     * Finds the position of a piece in the grid.
     * @param {number} pieceNumber The number of the piece to find.
     * @returns {{row: number, col: number}|null} The position of the piece or null if it is not in the grid.
     */
    findPiece(pieceNumber) {
        for (var i = 0; i < 16; i++) {
            var piece = this.grid[Math.floor(i / 4)][i % 4];
            if (piece !== null && piece.number === pieceNumber) {
                return { row: Math.floor(i / 4), col: i % 4 };
            }
        }
        return null;
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
        this.locked[row][col] = false;
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
     * Removes all the external constraints.
     */
    clearConstraints() {
        Object.values(this.constraints).forEach(constraints => constraints.fill(null));
    }

    /**
     * Explores the ways to complete the grid.
     * The pieces already in the grid stay in place and the external constraints are respected.
     * The cells are filled in reading order, so each candidate piece only has to match its left and top neighbours,
     * the external constraints and the pieces already placed to its right and below.
     * @param {object} options The search options.
     * @param {number} options.limit Stops the search after this number of solutions.
     * @param {boolean} options.onlyLocked If true, only the locked pieces are kept, the other ones are ignored.
     * @param {boolean} options.shuffle If true, the pieces are tried in a random order.
     * @returns {{count: number, solution: Array<number>|null}} The number of solutions found (up to the limit)
     * and the first solution as a list of 16 piece numbers in reading order.
     */
    search({ limit = Infinity, onlyLocked = false, shuffle = false } = {}) {

        // Pieces kept in the grid, -1 for the cells to fill
        var cells = this.grid.flat().map((piece, i) =>
            piece === null || (onlyLocked && !this.locked[Math.floor(i / 4)][i % 4]) ? -1 : piece.number);

        // For each cell, the sides whose shape is imposed (mask) and the imposed shapes (value)
        var mask = Array(16).fill(0), value = Array(16).fill(0);
        function impose(cell, side, open) {
            mask[cell] |= side;
            if (open) {
                value[cell] |= side;
            }
        }
        for (var i = 0; i < 4; i++) {
            if (this.constraints.top[i] !== null) impose(i, 0b0001, !this.constraints.top[i]);
            if (this.constraints.right[i] !== null) impose(i * 4 + 3, 0b0010, !this.constraints.right[i]);
            if (this.constraints.bottom[i] !== null) impose(12 + i, 0b0100, !this.constraints.bottom[i]);
            if (this.constraints.left[i] !== null) impose(i * 4, 0b1000, !this.constraints.left[i]);
        }
        var used = 0;
        for (var i = 0; i < 16; i++) {
            if (cells[i] === -1) {
                continue;
            }
            used |= 1 << cells[i];
            var x = Math.floor(i / 4), y = i % 4, p = cells[i];
            if (y < 3) impose(i + 1, 0b1000, !(p & 0b0010));
            if (y > 0) impose(i - 1, 0b0010, !(p & 0b1000));
            if (x < 3) impose(i + 4, 0b0001, !(p & 0b0100));
            if (x > 0) impose(i - 4, 0b0100, !(p & 0b0001));
        }

        // The pieces already placed must match their neighbours and the constraints
        for (var i = 0; i < 16; i++) {
            if (cells[i] !== -1 && (cells[i] & mask[i]) !== value[i]) {
                return { count: 0, solution: null };
            }
        }

        var order = Array.from({ length: 16 }, (_, i) => i);
        var grid = cells.slice(), count = 0, solution = null;

        /**
         * Recursive function to fill the grid from the specified cell.
         * @param {number} cell The index of the cell to fill.
         * @returns {boolean} True if the limit of solutions is reached.
         */
        function reccursiveSolver(cell) {

            // Skip the pieces already placed
            while (cell < 16 && cells[cell] !== -1) {
                cell++;
            }

            // The grid is full: this is a solution
            if (cell === 16) {
                if (solution === null) {
                    solution = grid.slice();
                }
                count++;
                return count >= limit;
            }

            // The left and top neighbours are always placed at this point
            var m = mask[cell], v = value[cell];
            if (cell % 4 > 0) {
                m |= 0b1000;
                if (!(grid[cell - 1] & 0b0010)) v |= 0b1000;
            }
            if (cell >= 4) {
                m |= 0b0001;
                if (!(grid[cell - 4] & 0b0100)) v |= 0b0001;
            }

            var candidates = shuffle ? WalterPuzzle.shuffle(order.slice()) : order;
            for (var k = 0; k < 16; k++) {
                var p = candidates[k];
                if ((used >> p & 1) || (p & m) !== v) {
                    continue;
                }
                used |= 1 << p;
                grid[cell] = p;
                var done = reccursiveSolver(cell + 1);
                used &= ~(1 << p);
                if (done) {
                    return true;
                }
            }
            grid[cell] = -1;
            return false;
        }

        reccursiveSolver(0);
        return { count: count, solution: solution };
    }

    /**
     * Solves the puzzle game.
     * The pieces already in the grid stay in place.
     * @param {boolean} count If true, the function will return the number of solutions.
     * @returns {boolean|number} True if the puzzle was solved, false otherwise. If count is true, the number of solutions will be returned.
     */
    solve(count = false) {
        if (count) {
            return this.search().count;
        }
        var result = this.search({ limit: 1 });
        if (result.solution === null) {
            return false;
        }
        this.applySolution(result.solution);
        return true;
    }

    /**
     * Counts the solutions of the puzzle, keeping the pieces already in the grid.
     * @param {number} limit Stops counting at this number of solutions.
     * @param {boolean} onlyLocked If true, only the locked pieces are kept.
     * @returns {number} The number of solutions, at most the limit.
     */
    countSolutions(limit = Infinity, onlyLocked = false) {
        return this.search({ limit: limit, onlyLocked: onlyLocked }).count;
    }

    /**
     * Places the missing pieces of a solution in the empty cells.
     * @param {Array<number>} solution The 16 piece numbers of the solution in reading order.
     */
    applySolution(solution) {
        solution.forEach((pieceNumber, i) => {
            if (this.getPiece(Math.floor(i / 4), i % 4) === null) {
                this.setPiece(Math.floor(i / 4), i % 4, pieceNumber);
            }
        });
    }

    /**
     * Checks if the puzzle is complete and without errors.
     * @returns {boolean} True if the puzzle is solved.
     */
    isSolved() {
        return this.pieces.every(available => !available) && this.getErrors().length === 0;
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
            var topConstraint = this.getConstraint('top', y),
                rightConstraint = this.getConstraint('right', x),
                bottomConstraint = this.getConstraint('bottom', y),
                leftConstraint = this.getConstraint('left', x);
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
        // Locked cells are stored on 1 bit
        var locked = this.locked.flat().map(locked => locked ? '1' : '0').join('');
        return WalterPuzzle.binaryToBase64(cells + constraints + locked);
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
        // Older hashes have no locked cells
        var locked = [];
        for (var i = 0; i < 16; i++) {
            locked.push(bin.charAt(112 + i) === '1');
        }

        // Create the puzzle
        var puzzle = new WalterPuzzle();

        // Set the pieces
        numbers.forEach((number, index) => {
            if (number !== '') {
                puzzle.setPiece(Math.floor(index / 4), index % 4, parseInt(number), locked[index]);
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
     * Creates a challenge: a grid with some locked pieces, taken from a random solution,
     * whose number of solutions is between the specified bounds.
     * The pieces are revealed one by one until there are few enough solutions,
     * then the pieces that are not needed to stay under the maximum are removed.
     * @param {number} minSolutions The minimum number of solutions of the challenge.
     * @param {number} maxSolutions The maximum number of solutions of the challenge.
     * @returns {WalterPuzzle} The challenge.
     */
    static generateChallenge(minSolutions, maxSolutions) {
        while (true) {

            // Pick a random solution of the free puzzle
            var solution = new WalterPuzzle().search({ limit: 1, shuffle: true }).solution;

            // Reveal its pieces in a random order until there are few enough solutions
            var puzzle = new WalterPuzzle();
            var cells = WalterPuzzle.shuffle(Array.from({ length: 16 }, (_, i) => i));
            var count = Infinity;
            for (var k = 0; k < 16 && count > maxSolutions; k++) {
                puzzle.setPiece(Math.floor(cells[k] / 4), cells[k] % 4, solution[cells[k]], true);
                count = puzzle.countSolutions(maxSolutions + 1);
            }

            // Too few solutions: the last revealed piece removed too many of them, try again
            if (count < minSolutions) {
                continue;
            }

            // Remove the pieces that are not needed, removing a piece can only add solutions
            WalterPuzzle.shuffle(cells).forEach(cell => {
                var x = Math.floor(cell / 4), y = cell % 4;
                if (puzzle.getPiece(x, y) === null) {
                    return;
                }
                var pieceNumber = puzzle.getPiece(x, y).number;
                puzzle.removePiece(x, y);
                if (puzzle.countSolutions(maxSolutions + 1) > maxSolutions) {
                    puzzle.setPiece(x, y, pieceNumber, true);
                }
            });

            return puzzle;
        }
    }

    /**
     * Shuffles an array in place.
     * @param {Array} array The array to shuffle.
     * @returns {Array} The shuffled array.
     */
    static shuffle(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
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

/**
 * This file is used to bridge the gap between the HTML and the puzzle logic.
 * The puzzle object is the reference: every change is made on it, then the page is rendered from it.
 */

/**
 * The challenge difficulties, given by the number of solutions of the challenge.
 */
const DIFFICULTIES = {
    'easy': { label: 'Easy', min: 200, max: 1000 },
    'medium': { label: 'Medium', min: 20, max: 199 },
    'hard': { label: 'Hard', min: 2, max: 19 },
    'expert': { label: 'Expert', min: 1, max: 1 }
};

/**
 * The image shown for each constraint state, depending on the side of the grid.
 */
const CONSTRAINT_IMAGES = {
    'top': { 'off': 'horizontal-off', 'true': 'horizontal-down', 'false': 'horizontal-up' },
    'right': { 'off': 'vertical-off', 'true': 'vertical-left', 'false': 'vertical-right' },
    'bottom': { 'off': 'horizontal-off', 'true': 'horizontal-up', 'false': 'horizontal-down' },
    'left': { 'off': 'vertical-off', 'true': 'vertical-right', 'false': 'vertical-left' }
};

/**
 * Creates the cells and the constraints of the grid, and the pieces in the tray.
 */
function buildBoard() {

    var grid = document.getElementById('grid');

    /**
     * Adds an element to the grid.
     * @param {string} className The class of the element.
     * @param {string|null} image The image to display in the element, if any.
     * @returns {HTMLElement} The created element.
     */
    function add(className, image = null) {
        var element = document.createElement('div');
        element.className = className;
        if (image !== null) {
            var img = document.createElement('img');
            img.src = `./constraints/${image}.svg`;
            img.alt = '';
            img.draggable = false;
            element.appendChild(img);
        }
        grid.appendChild(element);
        return element;
    }

    /**
     * Adds a border constraint to the grid.
     * @param {string} side The side of the grid: 'top', 'right', 'bottom' or 'left'.
     * @param {number} number The number of the constraint along the side.
     */
    function addConstraint(side, number) {
        var orientation = side == 'top' || side == 'bottom' ? 'horizontal' : 'vertical';
        var element = add(`${orientation}-constraint`, CONSTRAINT_IMAGES[side]['off']);
        element.id = `${side}-${number}`;
        element.setAttribute('role', 'button');
        element.setAttribute('aria-label', `Constraint ${side} ${number + 1}`);
        if (side == 'right') element.children[0].classList.add('mirror-horizontal');
        if (side == 'bottom') element.children[0].classList.add('mirror-vertical');
        element.onclick = () => toggleConstraint(side, number);
    }

    add('corner', 'corner-top-left');
    for (var i = 0; i < 4; i++) addConstraint('top', i);
    add('corner', 'corner-top-right');
    for (var row = 0; row < 4; row++) {
        addConstraint('left', row);
        for (var col = 0; col < 4; col++) {
            var cell = add('cell');
            cell.id = `${row}-${col}`;
            cell.dataset.row = row;
            cell.dataset.col = col;
        }
        addConstraint('right', row);
    }
    add('corner', 'corner-bottom-left');
    for (var i = 0; i < 4; i++) addConstraint('bottom', i);
    add('corner', 'corner-bottom-right');

    // One slot per piece in the tray, so the pieces always come back to the same place
    var tray = document.getElementById('tray');
    for (var i = 0; i < 16; i++) {
        var slot = document.createElement('div');
        slot.className = 'slot';
        slot.id = `slot-${i}`;
        var img = document.createElement('img');
        img.src = `./pieces/${i}.svg`;
        img.alt = `Piece ${i}`;
        img.draggable = false;
        img.className = 'piece';
        img.id = `piece-${i}`;
        img.dataset.piece = i;
        slot.appendChild(img);
        tray.appendChild(slot);
    }
}

/**
 * Renders the puzzle object on the page.
 * @param {Array<number>} highlighted The numbers of the pieces to show in green.
 */
function render(highlighted = []) {

    // Pieces
    var errors = puzzle.getErrors();
    for (var i = 0; i < 16; i++) {
        var img = document.getElementById(`piece-${i}`);
        var position = puzzle.findPiece(i);
        var target = position === null ? document.getElementById(`slot-${i}`) : document.getElementById(`${position.row}-${position.col}`);
        if (img.parentElement !== target) {
            target.appendChild(img);
        }
        img.classList.toggle('locked', position !== null && puzzle.isLocked(position.row, position.col));
        img.classList.toggle('red-filter', errors.indexOf(i) > -1);
        img.classList.toggle('green-filter', highlighted.indexOf(i) > -1 && errors.indexOf(i) === -1);
    }

    // Constraints
    Object.keys(CONSTRAINT_IMAGES).forEach(side => {
        for (var i = 0; i < 4; i++) {
            var value = puzzle.getConstraint(side, i);
            var image = CONSTRAINT_IMAGES[side][value === null ? 'off' : String(value)];
            document.getElementById(`${side}-${i}`).children[0].src = `./constraints/${image}.svg`;
        }
    });

    document.getElementById('grid').classList.toggle('solved', puzzle.isSolved());
    history.replaceState(null, '', '#' + puzzle.getHash());
    updateStatus();
}

/**
 * Moves a piece to a cell, swapping it with the piece already there, or back to the tray.
 * Locked pieces cannot be moved or replaced.
 * @param {number} pieceNumber The number of the piece to move.
 * @param {number|null} row The row of the target cell, or null to put the piece back in the tray.
 * @param {number|null} col The column of the target cell, or null to put the piece back in the tray.
 */
function movePiece(pieceNumber, row = null, col = null) {
    var from = puzzle.findPiece(pieceNumber);
    if (from !== null && puzzle.isLocked(from.row, from.col)) {
        return;
    }
    if (row === null) {
        if (from !== null) {
            puzzle.removePiece(from.row, from.col);
        }
    } else {
        if (puzzle.isLocked(row, col) || (from !== null && from.row === row && from.col === col)) {
            return;
        }
        var occupant = puzzle.getPiece(row, col);
        if (from !== null) {
            puzzle.removePiece(from.row, from.col);
        }
        if (occupant !== null) {
            puzzle.removePiece(row, col);
            // The replaced piece takes the place of the moved one, or goes back to the tray
            if (from !== null) {
                puzzle.setPiece(from.row, from.col, occupant.number);
            }
        }
        puzzle.setPiece(row, col, pieceNumber);
    }
    render();
    if (puzzle.isSolved()) {
        showMessage('Solved! Well done.', 'success');
    }
}

/**
 * Checks if the puzzle is a challenge, that is if it has locked pieces.
 * @returns {boolean} True if the puzzle has locked pieces.
 */
function isChallenge() {
    return puzzle.locked.flat().some(locked => locked);
}

/**
 * Returns the difficulty matching a number of solutions.
 * @param {number} solutions The number of solutions.
 * @returns {object|null} The difficulty, or null if there are too many solutions for a challenge.
 */
function difficultyOf(solutions) {
    return Object.values(DIFFICULTIES).find(difficulty => solutions >= difficulty.min && solutions <= difficulty.max) || null;
}

/**
 * Displays a message in the status line.
 * @param {string} text The message.
 * @param {boolean} success True to display the message as a success.
 */
function setStatus(text, success = false) {
    var status = document.getElementById('status');
    status.textContent = text;
    status.classList.toggle('success', success);
}

let messageTimeout = null;

/**
 * Displays a message in a banner at the bottom of the screen, visible wherever the page is scrolled.
 * @param {string} text The message.
 * @param {string} kind The kind of message: 'info', 'success' or 'warning'.
 * @param {boolean} persistent If true, the message stays until it is replaced or hidden, otherwise it disappears after a few seconds.
 */
function showMessage(text, kind = 'info', persistent = false) {
    var message = document.getElementById('message');
    message.textContent = text;
    message.className = `message visible ${kind}`;
    clearTimeout(messageTimeout);
    if (!persistent) {
        messageTimeout = setTimeout(hideMessage, 6000);
    }
}

/**
 * Hides the message banner.
 */
function hideMessage() {
    clearTimeout(messageTimeout);
    document.getElementById('message').classList.remove('visible');
}

/**
 * Displays the state of the game in the status line.
 */
function updateStatus() {
    var placed = puzzle.pieces.filter(available => !available).length;
    if (puzzle.isSolved()) {
        setStatus('Solved! Well done.', true);
    } else if (isChallenge()) {
        var given = puzzle.locked.flat().filter(locked => locked).length;
        var solutions = puzzle.countSolutions(1001, true);
        var difficulty = difficultyOf(solutions);
        var solutionsText = solutions > 1000 ? 'more than 1000 solutions' : `${solutions} solution${solutions < 2 ? '' : 's'}`;
        setStatus(`${difficulty === null ? '' : difficulty.label + ' '}challenge · ${given} pieces given · ${solutionsText} · ${placed}/16 placed`);
    } else {
        setStatus(`Free play · ${placed}/16 placed`);
    }
}

/**
 * Runs a long task after the page had time to display a message, with the buttons disabled.
 * @param {string} message The message to display during the task.
 * @param {function} task The task to run.
 */
function runLater(message, task) {
    showMessage(message, 'info', true);
    var buttons = document.querySelectorAll('button');
    buttons.forEach(button => button.disabled = true);
    setTimeout(() => {
        try {
            task();
        } finally {
            buttons.forEach(button => button.disabled = false);
        }
    }, 50);
}

/**
 * Generates a new challenge with the selected difficulty.
 */
function newChallengeButton() {
    var difficulty = DIFFICULTIES[document.getElementById('difficulty').value];
    clearSelection();
    runLater('Generating a challenge...', () => {
        puzzle = WalterPuzzle.generateChallenge(difficulty.min, difficulty.max);
        render();
        hideMessage();
    });
}

/**
 * Places one more piece of a solution that keeps the pieces already placed.
 */
function hintButton() {
    clearSelection();
    if (puzzle.isSolved()) {
        return;
    }
    var result = puzzle.search({ limit: 1, shuffle: true });
    if (result.solution === null) {
        showMessage('The pieces placed cannot lead to a solution, move some of them.', 'warning');
        return;
    }
    var empty = [];
    for (var i = 0; i < 16; i++) {
        if (puzzle.getPiece(Math.floor(i / 4), i % 4) === null) {
            empty.push(i);
        }
    }
    var cell = empty[Math.floor(Math.random() * empty.length)];
    puzzle.setPiece(Math.floor(cell / 4), cell % 4, result.solution[cell]);
    render([result.solution[cell]]);
}

/**
 * Solves the puzzle game and updates the HTML elements.
 * If the pieces placed by the player cannot be completed, they are removed and the challenge is solved from its given pieces.
 */
function solveButton() {
    clearSelection();
    var before = puzzle.pieces.map(available => !available);
    var result = puzzle.search({ limit: 1 });
    var message = null;
    if (result.solution === null) {
        result = puzzle.search({ limit: 1, onlyLocked: true });
        if (result.solution === null) {
            showMessage('The puzzle is not solvable with these constraints.', 'warning');
            return;
        }
        for (var i = 0; i < 16; i++) {
            var x = Math.floor(i / 4), y = i % 4;
            if (puzzle.getPiece(x, y) !== null && !puzzle.isLocked(x, y)) {
                puzzle.removePiece(x, y);
            }
        }
        before = puzzle.pieces.map(available => !available);
        message = 'Your pieces could not lead to a solution, here is a solution from the given pieces.';
    }
    puzzle.applySolution(result.solution);
    render(Array.from({ length: 16 }, (_, i) => i).filter(i => !before[i]));
    if (message !== null) {
        showMessage(message, 'warning');
    }
}

/**
 * Counts the number of solutions to the puzzle game, keeping the pieces already placed.
 */
function countButton() {
    clearSelection();
    runLater('Counting the solutions, this may take a few seconds...', () => {
        var count = puzzle.countSolutions();
        if (count === 0) {
            showMessage('The pieces placed cannot lead to a solution.', 'warning');
        } else {
            showMessage(`${count.toLocaleString('en')} solution${count < 2 ? '' : 's'} with the pieces placed.`, 'success');
        }
    });
}

/**
 * Removes the pieces placed by the player.
 * If there are none, clears the whole grid, including the challenge and the constraints.
 */
function resetButton() {
    clearSelection();
    var removed = false;
    for (var i = 0; i < 16; i++) {
        var x = Math.floor(i / 4), y = i % 4;
        if (puzzle.getPiece(x, y) !== null && !puzzle.isLocked(x, y)) {
            puzzle.removePiece(x, y);
            removed = true;
        }
    }
    if (!removed) {
        puzzle = new WalterPuzzle();
    }
    render();
}

/**
 * Toggles an external constraint: no constraint, then a hole on the border, then a tab on the border.
 * @param {string} side The side of the constraint (top, right, bottom, left).
 * @param {number} number The number of the constraint along the side.
 */
function toggleConstraint(side, number) {
    var value = puzzle.getConstraint(side, number);
    puzzle.setConstraint(side, number, value === null ? false : (value === false ? true : null));
    render();
}

/**
 * Creates a small preview of a puzzle.
 * @param {string} hash The hash of the puzzle.
 * @returns {HTMLElement} The preview.
 */
function buildPreview(hash) {
    var preview = document.createElement('div');
    preview.className = 'preview';
    var saved = WalterPuzzle.fromHash(hash);
    for (var i = 0; i < 16; i++) {
        var x = Math.floor(i / 4), y = i % 4;
        var cell = document.createElement('div');
        cell.className = 'cell';
        var piece = saved.getPiece(x, y);
        if (piece !== null) {
            var img = document.createElement('img');
            img.src = `./pieces/${piece.number}.svg`;
            img.alt = '';
            img.draggable = false;
            img.className = 'mini-piece';
            img.classList.toggle('locked', saved.isLocked(x, y));
            cell.appendChild(img);
        }
        preview.appendChild(cell);
    }
    return preview;
}

/**
 * Saves the puzzle game to the local storage.
 */
function saveButton() {
    clearSelection();
    var name = prompt('Enter the name of the puzzle:', 'Puzzle - ' + new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString());
    if (name === null) {
        return;
    }
    var puzzles = JSON.parse(localStorage.getItem('puzzles') || '[]');
    puzzles.push({name: name, hash: puzzle.getHash()});
    localStorage.setItem('puzzles', JSON.stringify(puzzles));
    displaySavedPuzzles();
    showMessage(`Saved as "${name}".`, 'success');
}

/**
 * Displays the saved puzzles.
 */
function displaySavedPuzzles() {
    let puzzles = JSON.parse(localStorage.getItem('puzzles') || '[]');
    var section = document.getElementById('saved-puzzles');
    section.innerHTML = puzzles.length === 0 ? '' : '<h4>Saved puzzles</h4>';
    var list = document.createElement('div');
    list.className = 'saved-list';
    puzzles.reverse().forEach(puzzle => {
        var item = document.createElement('div');
        item.classList.add('saved-puzzle');
        item.onclick = () => loadSavedPuzzle(puzzle.hash);
        var name = document.createElement('strong');
        name.textContent = puzzle.name;
        item.append(buildPreview(puzzle.hash), name);
        list.appendChild(item);
    });
    section.appendChild(list);
}

/**
 * Loads a saved puzzle.
 * @param {string} hash The hash of the saved puzzle.
 */
function loadSavedPuzzle(hash) {
    console.log(`Loading saved puzzle: ${hash}`);
    clearSelection();
    puzzle = WalterPuzzle.fromHash(hash);
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Loads the puzzle from the hash.
 */
function loadFromHash() {
    var hash = window.location.hash;
    if (hash.length > 1) {
        try {
            puzzle = WalterPuzzle.fromHash(hash.substring(1));
            console.log(`Loaded puzzle from hash: ${hash}`);
        } catch (error) {
            console.log(`Invalid hash: ${hash}`);
        }
    }
    render();
}

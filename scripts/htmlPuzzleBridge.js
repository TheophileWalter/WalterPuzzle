/**
 * This file is used to bridge the gap between the HTML and the puzzle logic.
 */


/**
 * Converts the HTML elements to a WalterPuzzle object.
 */
function htmlToGame() {
    var puzzle = new WalterPuzzle();
    for (var i = 0; i < 16; i++) {
        var x = Math.floor(i / 4), y = i % 4;
        var cell = document.getElementById(`${x}-${y}`);
        if (cell.children.length !== 0) {
            puzzle.setPiece(x, y, parseInt(cell.children[0].id));
        }
    }
    return puzzle;
}

/**
 * Converts the WalterPuzzle object to HTML elements.
 * @param {WalterPuzzle} puzzle The puzzle object to convert.
 * @param {boolean} markGreen If true, the green filter will be applied to the new pieces.
 */
function gameToHtml(puzzle, markGreen = false) {
    var imageList = document.getElementById('imageList');
    for (var i = 0; i < 16; i++) {
        var x = Math.floor(i / 4), y = i % 4;
        var cell = document.getElementById(`${x}-${y}`);
        var empty = true;
        while (cell.children.length !== 0) {
            imageList.appendChild(cell.children[0]);
            empty = false;
        }
        var piece = puzzle.getPiece(x, y);
        if (piece !== null) {
            var image = document.getElementById(piece.number);
            cell.appendChild(image);
            if (markGreen && empty) {
                image.classList.add('green-filter');
            }
        }
    }
    displayErrors(markGreen);
    window.location.hash = puzzle.getHash();
}

/**
 * Displays the errors on the HTML elements.
 * @param {boolean} preserveGreen If true, the green filter will be preserved.
 */
function displayErrors(preserveGreen = false) {
    var errors = puzzle.getErrors();
    for (var i = 0; i < 16; i++) {
        if (errors.indexOf(i) > -1) {
            document.getElementById(i).classList.add('red-filter');
        } else {
            document.getElementById(i).classList.remove('red-filter');
            if (!preserveGreen) {
                document.getElementById(i).classList.remove('green-filter');
            }
        }
    }
}

/**
 * Solves the puzzle game and updates the HTML elements.
 */
function solveButton() {
    if (puzzle.getErrors().length > 0) {
        alert('The puzzle has errors.');
        return;
    }
    if (!puzzle.solve()) {
        alert('The puzzle is not solvable.');
    }
    gameToHtml(puzzle, true);
}

/**
 * Resets the puzzle game and updates the HTML elements.
 */
function resetButton() {
    puzzle = new WalterPuzzle();
    gameToHtml(puzzle);
}

/**
 * Loads the puzzle from the hash.
 */
function loadFromHash() {
    var hash = window.location.hash;
    if (hash.length > 1) {
        puzzle = WalterPuzzle.fromHash(hash.substring(1));
        gameToHtml(puzzle);
    }
}

function toggleConstraint(element, side) {
    var img = element.children[0];
    var orientation = side == 'top' || side == 'bottom' ? 'horizontal' : 'vertical';
    var state = extractBetween(img.src, orientation + '-', '.svg');
    var newState = 'off';
    if (side == 'top') {
        if (state == 'off') newState = 'up';
        else if (state == 'up') newState = 'down';
    } else if (side == 'right') {
        if (state == 'off') newState = 'right';
        else if (state == 'right') newState = 'left';
    } else if (side == 'bottom') {
        if (state == 'off') newState = 'down';
        else if (state == 'down') newState = 'up';
    } else if (side == 'left') {
        if (state == 'off') newState = 'left';
        else if (state == 'left') newState = 'right';
    }
    img.src = img.src.replace(`${orientation}-${state}.svg`, `${orientation}-${newState}.svg`);
}

function extractBetween(src, startVar, endVar) {
    var regex = new RegExp(startVar + "(.*?)" + endVar);
    var match = src.match(regex);
    if (match && match[1]) {
        return match[1];
    }
    return null;
}
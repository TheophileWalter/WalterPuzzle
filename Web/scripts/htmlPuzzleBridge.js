/**
 * This file is used to bridge the gap between the HTML and the puzzle logic.
 */


/**
 * Converts the HTML elements to a WalterPuzzle object.
 */
function htmlToGame() {

    // Create a new puzzle object.
    var puzzle = new WalterPuzzle();

    // Iterate over the 16 cells to set the pieces.
    for (var i = 0; i < 16; i++) {
        var x = Math.floor(i / 4), y = i % 4;
        var cell = document.getElementById(`${x}-${y}`);
        if (cell.children.length !== 0) {
            puzzle.setPiece(x, y, parseInt(cell.children[0].id));
        }
    }

    // Set the constraints
    var positions = ['top', 'right', 'bottom', 'left'];
    positions.forEach(position => {
        for (var i = 0; i < 4; i++) {
            var img = document.getElementById(`${position}-${i}`);
            var orientation = position == 'top' || position == 'bottom' ? 'horizontal' : 'vertical';
            var state = extractBetween(img.src, orientation + '-', '.svg');
            if (state == 'off') {
                puzzle.setConstraint(position, i, null);
            } else if (position == 'top') {
                puzzle.setConstraint(position, i, state == 'down');
            } else if (position == 'right') {
                puzzle.setConstraint(position, i, state == 'left');
            } else if (position == 'bottom') {          
                puzzle.setConstraint(position, i, state == 'up');
            } else if (position == 'left') {
                puzzle.setConstraint(position, i, state == 'right');
            }
        }
    });

    // Return the puzzle object.
    return puzzle;
}

/**
 * Converts the WalterPuzzle object to HTML elements.
 * @param {WalterPuzzle} puzzle The puzzle object to convert.
 * @param {boolean} markGreen If true, the green filter will be applied to the new pieces.
 */
function gameToHtml(puzzle, markGreen = false) {

    // Remove all the images from the cells
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

    // Set the constraints
    var positions = ['top', 'right', 'bottom', 'left'];
    positions.forEach(position => {
        for (var i = 0; i < 4; i++) {
            var img = document.getElementById(`${position}-${i}`);
            var orientation = position == 'top' || position == 'bottom' ? 'horizontal' : 'vertical';
            var state = puzzle.getConstraint(position, i);
            if (state === null) {
                img.src = img.src.replace(new RegExp(`${orientation}-.*\\.svg`), `${orientation}-off.svg`);
            } else if (position == 'top') {
                img.src = img.src.replace(new RegExp(`${orientation}-.*\\.svg`), `${orientation}-${state ? 'down' : 'up'}.svg`);
            } else if (position == 'right') {
                img.src = img.src.replace(new RegExp(`${orientation}-.*\\.svg`), `${orientation}-${state ? 'left' : 'right'}.svg`);
            } else if (position == 'bottom') {
                img.src = img.src.replace(new RegExp(`${orientation}-.*\\.svg`), `${orientation}-${state ? 'up' : 'down'}.svg`);
            } else if (position == 'left') {
                img.src = img.src.replace(new RegExp(`${orientation}-.*\\.svg`), `${orientation}-${state ? 'right' : 'left'}.svg`);
            }
        }
    });

    // Display the errors
    displayErrors(markGreen);

    // Update the hash
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
            document.getElementById(i).classList.remove('green-filter');
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
    console.log('Solving the puzzle');
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
 * Counts the number of solutions to the puzzle game.
 */
function countButton() {
    console.log('Counting the solutions');
    document.getElementById('counting').style.display = 'block';
    setTimeout(() => {
        var count = puzzle.solve(true);
        document.getElementById('counting').style.display = 'none';
        alert(`The puzzle has ${count} solution${count < 2 ? '' : 's'}.`);
    }, 100);
}

/**
 * Returns the base64 representation of the game preview.
 * @param {function} callback The function to call with the base64 representation of the game preview.
 * @param {number} width The width of the game preview (optional).
 * @param {number} height The height of the game preview (optional).
 * @returns {string} The base64 representation of the game preview.
 */
function getGamePreview(callback, width = null, height = null) {

    const element = document.getElementById('grid');
    const canvas = document.getElementById('canvas');
    html2canvas(element).then(function (canvasElement) {
        const context = canvas.getContext('2d');
        canvas.width = width === null ? canvasElement.width : width;
        canvas.height = height === null ? canvasElement.height : height;
        context.drawImage(canvasElement, 0, 0, canvas.width, canvas.height);
        callback(canvas.toDataURL());
    });

}

/**
 * Saves the puzzle game to the local storage.
 */
function saveButton() {
    getGamePreview(preview => {
        var hash = puzzle.getHash();
        var name = prompt('Enter the name of the puzzle:', 'Puzzle - ' + new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString());
        if (name === null) {
            return;
        }
        var puzzles = JSON.parse(localStorage.getItem('puzzles') || '[]');
        puzzles.push({name: name, hash: hash, preview: preview});
        localStorage.setItem('puzzles', JSON.stringify(puzzles));
        displaySavedPuzzles();
    });
}

/**
 * Displays the saved puzzles.
 */
function displaySavedPuzzles() {
    let puzzles = JSON.parse(localStorage.getItem('puzzles') || '[]');
    var list = document.getElementById('saved-puzzles');
    list.innerHTML = puzzles.length === 0 ? '' : '<h4>Saved puzzles</h4>';
    puzzles.reverse().forEach(puzzle => {
        var item = document.createElement('div');
        item.classList.add('saved-puzzle');
        item.onclick = () => loadSavedPuzzle(puzzle.hash);
        item.innerHTML = `<img src="${puzzle.preview}" /><br /><strong>${puzzle.name}</strong>`;
        list.appendChild(item);
    });
}

/**
 * Loads a saved puzzle.
 * @param {string} hash The hash of the saved puzzle.
 */
function loadSavedPuzzle(hash) {
    console.log(`Loading saved puzzle: ${hash}`);
    puzzle = WalterPuzzle.fromHash(hash);
    gameToHtml(puzzle);
}

/**
 * Resets the puzzle game and updates the HTML elements.
 */
function resetButton() {
    console.log('Resetting the puzzle');
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
        console.log(`Loaded puzzle from hash: ${hash}`);
        gameToHtml(puzzle);
    }
}

/**
 * Toggles an external constraint
 * @param {HTMLElement} element The element to toggle.
 * @param {string} side The side of the constraint (top, right, bottom, left).
 */
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
    console.log(`Set constraint ${side}-${img.id.split('-')[1]} to ${newState}`);
    img.src = img.src.replace(`${orientation}-${state}.svg`, `${orientation}-${newState}.svg`);
    puzzle = htmlToGame();
    displayErrors();
    location.hash = puzzle.getHash();
}

/**
 * Extracts a string between two variables.
 * @param {string} src The source string.
 * @param {string} startVar The start variable.
 * @param {string} endVar The end variable.
 * @returns {string} The string between the two variables.
 */
function extractBetween(src, startVar, endVar) {
    var regex = new RegExp(startVar + "(.*?)" + endVar);
    var match = src.match(regex);
    if (match && match[1]) {
        return match[1];
    }
    return null;
}
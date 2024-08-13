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
 */
function gameToHtml(puzzle) {
    var imageList = document.getElementById('imageList');
    for (var i = 0; i < 16; i++) {
        var x = Math.floor(i / 4), y = i % 4;
        var cell = document.getElementById(`${x}-${y}`);
        while (cell.children.length !== 0) {
            imageList.appendChild(cell.children[0]);
        }
        var piece = puzzle.getPiece(x, y);
        if (piece !== null) {
            var image = document.getElementById(piece.number);
            cell.appendChild(image);
        }
    }
    displayErrors();
}

/**
 * Displays the errors on the HTML elements.
 */
function displayErrors() {
    var errors = puzzle.getErrors();
    for (var i = 0; i < 16; i++) {
        if (errors.indexOf(i) > -1) {
            document.getElementById(i).classList.add('red-filter');
        } else {
            document.getElementById(i).classList.remove('red-filter');
        }
    }
}
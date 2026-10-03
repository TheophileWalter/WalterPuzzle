/**
 * This file handles the moves of the pieces, with a mouse, a pen or a finger.
 * A piece can be dragged to a cell or back to the tray,
 * or tapped to select it and then moved by tapping a cell or the tray.
 */

// Distance in pixels a pointer has to move before a press becomes a drag
const DRAG_THRESHOLD = 6;

let selectedPiece = null;
let press = null;

/**
 * Selects a piece, or unselects it if it is already selected.
 * @param {HTMLElement|null} piece The piece to select, or null to clear the selection.
 */
function selectPiece(piece) {
    if (selectedPiece !== null) {
        selectedPiece.classList.remove('selected');
    }
    selectedPiece = piece === selectedPiece ? null : piece;
    if (selectedPiece !== null) {
        selectedPiece.classList.add('selected');
    }
}

/**
 * Clears the selected piece.
 */
function clearSelection() {
    selectPiece(null);
}

/**
 * Checks if a piece is locked in its cell.
 * @param {HTMLElement} piece The piece to check.
 * @returns {boolean} True if the piece cannot be moved.
 */
function isLockedPiece(piece) {
    return piece.classList.contains('locked');
}

/**
 * Finds where a piece would be dropped at the specified point.
 * @param {number} x The horizontal position of the point in the viewport.
 * @param {number} y The vertical position of the point in the viewport.
 * @returns {{cell: HTMLElement|null, tray: boolean}} The cell under the point, or whether the point is over the tray.
 */
function dropTargetAt(x, y) {
    /**
     * Checks if the point is inside an element.
     * @param {HTMLElement} element The element to check.
     * @returns {boolean} True if the point is inside the element.
     */
    function contains(element) {
        var rect = element.getBoundingClientRect();
        return x >= rect.left && x < rect.right && y >= rect.top && y < rect.bottom;
    }
    // The tabs of the pieces go over the neighbouring cells, so the cells are found by their position
    var cell = Array.from(document.querySelectorAll('.cell')).find(contains) || null;
    return { cell: cell, tray: cell === null && contains(document.getElementById('tray')) };
}

/**
 * Highlights the place where the dragged piece would be dropped.
 * @param {{cell: HTMLElement|null, tray: boolean}|null} target The drop target, or null to remove the highlight.
 */
function highlightDropTarget(target) {
    document.querySelectorAll('.drop-target').forEach(element => element.classList.remove('drop-target'));
    if (target === null) {
        return;
    }
    if (target.cell !== null) {
        target.cell.classList.add('drop-target');
    } else if (target.tray) {
        document.getElementById('tray').classList.add('drop-target');
    }
}

/**
 * Moves a piece to a drop target.
 * @param {HTMLElement} piece The piece to move.
 * @param {{cell: HTMLElement|null, tray: boolean}} target The place where the piece is dropped.
 */
function dropPiece(piece, target) {
    var pieceNumber = parseInt(piece.dataset.piece);
    if (target.cell !== null) {
        movePiece(pieceNumber, parseInt(target.cell.dataset.row), parseInt(target.cell.dataset.col));
    } else if (target.tray) {
        movePiece(pieceNumber);
    }
}

document.addEventListener('pointerdown', event => {
    var piece = event.target.closest('.piece');
    if (piece === null || !event.isPrimary || event.button > 0) {
        return;
    }
    event.preventDefault();
    press = { piece: piece, startX: event.clientX, startY: event.clientY, ghost: null };
});

document.addEventListener('pointermove', event => {
    if (press === null || !event.isPrimary) {
        return;
    }
    if (press.ghost === null) {
        var distance = Math.hypot(event.clientX - press.startX, event.clientY - press.startY);
        if (distance < DRAG_THRESHOLD || isLockedPiece(press.piece)) {
            return;
        }
        // Start dragging a copy of the piece, at its displayed size
        clearSelection();
        var rect = press.piece.getBoundingClientRect();
        press.ghost = press.piece.cloneNode();
        press.ghost.removeAttribute('id');
        press.ghost.classList.remove('red-filter', 'green-filter');
        press.ghost.classList.add('ghost');
        press.ghost.style.width = `${rect.width}px`;
        press.ghost.style.height = `${rect.height}px`;
        document.body.appendChild(press.ghost);
        press.piece.classList.add('dragging');
    }
    press.ghost.style.left = `${event.clientX}px`;
    press.ghost.style.top = `${event.clientY}px`;
    highlightDropTarget(dropTargetAt(event.clientX, event.clientY));
});

document.addEventListener('pointerup', event => {
    if (press === null || !event.isPrimary) {
        return;
    }
    var current = press;
    press = null;
    if (current.ghost !== null) {
        // End of a drag
        current.ghost.remove();
        current.piece.classList.remove('dragging');
        highlightDropTarget(null);
        dropPiece(current.piece, dropTargetAt(event.clientX, event.clientY));
        return;
    }
    // A tap on a piece in the grid while another piece is selected puts the selected piece in the tapped cell
    var target = dropTargetAt(event.clientX, event.clientY);
    if (selectedPiece !== null && selectedPiece !== current.piece && target.cell !== null) {
        var piece = selectedPiece;
        clearSelection();
        dropPiece(piece, target);
        return;
    }
    if (!isLockedPiece(current.piece)) {
        selectPiece(current.piece);
    }
});

document.addEventListener('pointercancel', () => {
    if (press !== null && press.ghost !== null) {
        press.ghost.remove();
        press.piece.classList.remove('dragging');
        highlightDropTarget(null);
    }
    press = null;
});

// A tap on an empty cell or on the tray moves the selected piece there
document.addEventListener('click', event => {
    if (selectedPiece === null || event.target.closest('.piece') !== null) {
        return;
    }
    var cell = event.target.closest('.cell');
    var tray = event.target.closest('#tray');
    if (cell === null && tray === null) {
        return;
    }
    var piece = selectedPiece;
    clearSelection();
    dropPiece(piece, { cell: cell, tray: tray !== null });
});

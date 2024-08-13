const imageList = document.getElementById('imageList');
const grid = document.getElementById('grid');

// Create and append images to the image list
for (let i = 0; i < 16; i++) {
    const img = document.createElement('img');
    img.src = `./pieces/${i}.svg`;
    img.draggable = true;
    img.id = i;
    img.addEventListener('dragstart', dragStart);
    img.addEventListener('dragend', dragEnd);
    imageList.appendChild(img);
}

// Create and append cells to the grid
for (let i = 0; i < 16; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.id = `${Math.floor(i / 4)}-${i % 4}`;
    cell.addEventListener('dragover', dragOver);
    cell.addEventListener('drop', drop);
    grid.appendChild(cell);
}

let draggedImage = null;

function dragStart(event) {
    draggedImage = event.target;
    setTimeout(() => {
        event.target.style.display = 'none';
    }, 0);
}

function dragEnd(event) {
    setTimeout(() => {
        event.target.style.display = 'block';
        draggedImage = null;
    }, 0);
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    let targetCell = event.target;

    // If the target is an image, get its parent cell
    if (targetCell.tagName === 'IMG') {
        targetCell = targetCell.parentElement;
    }

    if (targetCell.className === 'cell') {

        if (targetCell.children.length === 0) {

            // Set an image to a cell
            
            console.log(`set piece ${draggedImage.id} to cell ${targetCell.id}`);
            targetCell.appendChild(draggedImage);

        } else {

            // Replace an image in a cell

            const existingImage = targetCell.children[0];

            console.log(`remove piece ${existingImage.id} from cell ${targetCell.id}`);
            imageList.appendChild(existingImage);

            console.log(`set piece ${draggedImage.id} to cell ${targetCell.id}`);
            targetCell.appendChild(draggedImage);

        }

    } else if (targetCell.id === 'imageList') {

        // Remove an image from a cell

        console.log(`remove piece ${draggedImage.id}`);
        imageList.appendChild(draggedImage);

    }

    // Update the puzzle
    puzzle = htmlToGame();

    // Display errors
    displayErrors();

    // Update hash
    window.location.hash = puzzle.getHash();

}

imageList.addEventListener('dragover', dragOver);
imageList.addEventListener('drop', drop);
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
            
            console.log(`Set piece ${draggedImage.id} to cell ${targetCell.id}`);
            targetCell.appendChild(draggedImage);

        } else {

            // Replace an image in a cell

            const existingImage = targetCell.children[0];

            console.log(`Remove piece ${existingImage.id} from cell ${targetCell.id}`);
            imageList.appendChild(existingImage);

            console.log(`Set piece ${draggedImage.id} to cell ${targetCell.id}`);
            targetCell.appendChild(draggedImage);

        }

    } else if (targetCell.id === 'imageList') {

        // Remove an image from a cell

        console.log(`Remove piece ${draggedImage.id}`);
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
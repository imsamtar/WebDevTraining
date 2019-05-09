const image = document.getElementById('image');
const boxes = document.getElementsByClassName('box');

for(box of boxes){
    box.addEventListener('dragover', dragOver);
    box.addEventListener('dragleave', dragLeave);
    box.addEventListener('dragenter', dragEnter);
    box.addEventListener('drop', dragDrop);
}


image.addEventListener('dragstart', dragStart);
image.addEventListener('dragend', dragEnd);
image.addEventListener('drop', dragDrop);

function dragStart(){
    this.className = 'invisible';
}

function dragEnd(){
    this.className = '';
}

function dragOver(e){
    e.preventDefault();
}

function dragLeave(){
    this.className = 'box';
}

function dragEnter(){
    this.className = 'box dragover';
}

function dragDrop(){
    this.className = 'box';
    this.append(image);
}
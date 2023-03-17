const board = document.querySelector('#board');

function setColor(divContent, colorToSet) {
    divContent.style.backgroundColor = colorToSet;
}

function generateBoard() {
    let lastWasWhite = true;
    for(let y =0; y<8; y++) {
        const row = document.createElement('div');
        board.prepend(row);
        row.classList.add('row');
        lastWasWhite = !lastWasWhite;
        for(let x=0; x<8; x++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.id = "x" + x + "-y" + y;
            row.style.height = "100px";
            lastWasWhite = !lastWasWhite;
            setColor(square, (lastWasWhite ? "#bb002f" : "rgb(237 192 192)"));
            
            row.appendChild(square);

        }
    }

    rows = document.querySelectorAll('.row');
}

function populateBoard(){
    squares.forEach(square => {
        const x  = square.id.charAt(1);
        const y  = square.id.charAt(square.id.length-1);
        (y>5) ? square.classList.add('black','piece') : 0;
        (y<2) ? square.classList.add('white','piece') : 0;
        (y==1|y==6) ? square.classList.add('pawn') : 0;
        if(y==0|y==7){
            (x==0|x==7) ? square.classList.add('rook') : 0;
            (x==1|x==6) ? square.classList.add('knight') : 0;
            (x==2|x==5) ? square.classList.add('bishop') : 0;
            (x==3) ? square.classList.add('queen') : 0;
            (x==4) ? square.classList.add('king') : 0;
        }
    });
}

let rows;
generateBoard();
rows = document.querySelectorAll('.row');
squares = document.querySelectorAll('.square');
populateBoard();

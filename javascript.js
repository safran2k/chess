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

}

function populateBoard(){
    squares.forEach(square => {
        const x  = square.id.charAt(1);
        const y  = square.id.charAt(square.id.length-1);
        (y>5) ? square.classList.add('black','piece', 'image') : 0;
        (y<2) ? square.classList.add('white','piece', 'image') : 0;
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

function makePiecesResponsive(){
    pieces.forEach(selectedPiece => {
        selectedPiece.addEventListener('click', () => {
            resetSelectedPiece();
            selectedPiece.classList.add('selected');
            console.log("Selected piece:  " + selectedPiece.id);
            let availableSquareIds =[];

            availableSquareIds[0] =  selectedPiece.id.substring(0,4) + (+selectedPiece.id.substring(4) + 1);
            availableSquareIds[1] =  selectedPiece.id.substring(0,4) + (+selectedPiece.id.substring(4) + 2);
            for (idNumber in availableSquareIds){
                console.log("availableSquare: " + availableSquareIds[idNumber]);
                let newMove = document.createElement('div');
                document.getElementById(availableSquareIds[idNumber]).appendChild(newMove);
                newMove.classList.add('available-move', 'image');
            }
        });
    });
}

function resetSelectedPiece(){
    // DELETES ALL HTML within each square, removes all 'selected' classes
    squares.forEach(square => {
        square.innerHTML = '';
        square.classList.remove('selected');
    });
}

const board = document.querySelector('#board');
generateBoard();
squares = document.querySelectorAll('.square');
populateBoard();
let pieces = document.querySelectorAll('.piece');
document.body.addEventListener('click', resetSelectedPiece, {
    capture: true
}); 
makePiecesResponsive();


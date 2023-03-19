function setColor(divContent, colorToSet) {
    divContent.style.backgroundColor = colorToSet;
}

function newGame(){
    squares.forEach(square => {
        square.classList.remove('piece', 'image', 'white', 'black', 'pawn', 'knight', 'bishop', 'rook', 'queen', 'king');
        resetSelectedPiece();
        populateBoard();
        });
    
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
    let pieces = document.querySelectorAll('.piece');
    pieces.forEach(selectedPiece => {
        selectedPiece.addEventListener('click', () => {
            resetSelectedPiece();
            selectedPiece.classList.add('selected');
            showAvailableMoves(selectedPiece);
           
        });
    });
}

function resetSelectedPiece(){
    // DELETES ALL HTML within each square, removes all 'selected' classes
    squares.forEach(square => {
        square.innerHTML = '';
        square.classList.remove('selected', 'can-be-killed');
    });
}

function coOrdsToId(x, y) {
    return "x" + x + "-y" + y;
}

function getDifferentSquareId(squareId, dx, dy){
    let xvalue = +squareId.charAt(1);
    let yvalue = +squareId.charAt(4);
    return "x" + (xvalue + dx) + "-y" + (yvalue + dy);
}

function checkIfPieceCanMoveHere(selectedSquareId, squareIdToMoveTo){
    //returns 0 if square doesnt exist or is occupied by ally piece, returns 2 if there's a piece it can kill, else return 1

    let xvalue = +squareIdToMoveTo.charAt(1);
    let yvalue = +squareIdToMoveTo.charAt(4);
    if(xvalue < 0 | xvalue > 7) {
        return 0;
    } else if(yvalue < 0 | yvalue > 7) {
        return 0;
    } else {
        const squareToMoveTo = document.getElementById(squareIdToMoveTo);
        const selectedSquare = document.getElementById(selectedSquareId);
        if(squareToMoveTo.classList.contains('piece')) {
            if(squareToMoveTo.classList.contains('white') & selectedSquare.classList.contains('white')) {
                return 0;
            } else if (squareToMoveTo.classList.contains('black') & selectedSquare.classList.contains('black')) {
                return 0;
            } else {
                return 2;
            }
        }
    }
    
    return 1;
}

function pushIdToArrayIfValid(array, squareId) {
    if(squareId.charAt(1) < 8)
    array.push()
}

function showAvailableMoves(selectedPiece){
    let availableSquareIds =[];

    availableSquareIds.push(getDifferentSquareId(selectedPiece.id, 0, 1));
    availableSquareIds.push(getDifferentSquareId(selectedPiece.id, 0, 2));
    for (idNumber in availableSquareIds){
        if(checkIfPieceCanMoveHere(selectedPiece.id, availableSquareIds[idNumber]) == 1) {
            const newMove = document.createElement('div');
            document.getElementById(availableSquareIds[idNumber]).appendChild(newMove);
            newMove.classList.add('available-move', 'image');
        } else if (checkIfPieceCanMoveHere(selectedPiece.id, availableSquareIds[idNumber]) == 2) {
            document.getElementById(availableSquareIds[idNumber]).classList.add('can-be-killed');
        }
    }
}

const board = document.querySelector('#board');
const newGameButton = document.getElementById('new-game');
newGameButton.addEventListener('click', newGame)
generateBoard();
squares = document.querySelectorAll('.square');
populateBoard();
let pieces = document.querySelectorAll('.piece');
document.body.addEventListener('click', resetSelectedPiece, {
    capture: true
}); 
makePiecesResponsive();


const board = document.querySelector('#board');
const newGameButton = document.getElementById('new-game');
newGameButton.addEventListener('click', newGame);

let squareClicked = false;
generateBoard();
const squares = document.querySelectorAll('.square');
populateBoard();
makeBoardResponsive();
document.body.addEventListener('click', resetSelectedPieceOutsideOfSquares); 

function setColor(divContent, colorToSet) {
    divContent.style.backgroundColor = colorToSet;
}

function newGame(){
    resetSelectedPiece();
    squares.forEach(square => {
        square.classList.remove('piece', 'image', 'white', 'black', 'pawn', 'knight', 'bishop', 'rook', 'queen', 'king');
    });
    populateBoard();
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

function makeBoardResponsive() {
    squares.forEach(square => {
        square.addEventListener('click', () =>{
            squareClicked = true;
            let currentlySelectedPiece = document.querySelector('.selected');

            if(currentlySelectedPiece){
                if(!square.classList.contains('available-move')){
                    if(!square.classList.contains('can-be-killed')){
                        resetSelectedPiece();
                    }
                }
            }

            if(currentlySelectedPiece & !square.classList.contains('available-move')) {
                resetSelectedPiece();
            }

            if(square.classList.contains('piece') & !square.classList.contains('can-be-killed')){
                resetSelectedPiece();
                square.classList.add('selected');
                showAvailableMoves(square);
            } else {
                if(square.classList.contains('available-move')){
                    let pieceToMoveClassList = currentlySelectedPiece.classList.value.split(" ");
                    for(selectorClass in pieceToMoveClassList) {
                        square.classList.add(pieceToMoveClassList[selectorClass]);
                        if(pieceToMoveClassList[selectorClass] != 'square'){
                            currentlySelectedPiece.classList.remove(pieceToMoveClassList[selectorClass]);
                        }
                    }
                    resetSelectedPiece();
                }

                if(square.classList.contains('can-be-killed')){
                    let pieceToMoveClassList = currentlySelectedPiece.classList.value.split(" ");
                    let pieceToKillClassList = square.classList.value.split(" ");

                    for(deathClass in pieceToKillClassList){
                        if(pieceToKillClassList[deathClass] != 'square'){
                            square.classList.remove(pieceToKillClassList[deathClass]);
                        }
                    }

                    for(selectorClass in pieceToMoveClassList) {
                        square.classList.add(pieceToMoveClassList[selectorClass]);
                        if(pieceToMoveClassList[selectorClass] != 'square'){
                            currentlySelectedPiece.classList.remove(pieceToMoveClassList[selectorClass]);
                        }
                    }
                    resetSelectedPiece();
                }
            }
        });
    });
}

function resetSelectedPiece(){
    // DELETES ALL HTML within each square, removes all 'selected' classes
    squares.forEach(square => {
        square.innerHTML = '';
        square.classList.remove('selected', 'can-be-killed', 'available-move');
    });
}

function coOrdsToId(x, y) {
    return "x" + x + "-y" + y;
}

function getDifferentSquareId(squareId, dx, dy){
    let xvalue = +squareId.charAt(1) + dx;
    let yvalue = +squareId.charAt(4) + dy;
    let newId = "x" + (xvalue) + "-y" + (yvalue);
    if(newId.length > 5 & (xvalue < 8 & yvalue & 8)) {
        return false;
    } else {
        return newId;
    }
}

function checkIfPieceCanMoveHere(selectedSquareId, squareIdToMoveTo){
    //returns 0 if square doesnt exist or is occupied by ally piece, returns 2 if there's a piece it can kill, else return 1

    let xvalue = +squareIdToMoveTo.charAt(1);
    let yvalue = +squareIdToMoveTo.charAt(4);
    if(squareIdToMoveTo.length > 5| xvalue > 7) {
        //instead of xvalue < 0, if an element tries to access a square 
        // on the left of the board (that doesnt exist), the id will have 
        // a negative number, so we instead check that the id is not > 5
        return 0;
    } else if(yvalue > 7) {
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

function pushIdToArrayIfValid(array, squareId, dx, dy) {
    if(getDifferentSquareId(squareId, dx, dy)) {
        array.push(getDifferentSquareId(squareId, dx, dy));
    }
}

function showAvailableMoves(selectedPiece){
    let availableSquareIds =[];

    if(selectedPiece.classList.contains('pawn')){
        if(selectedPiece.classList.contains('white')) {
            availableSquareIds.push(getDifferentSquareId(selectedPiece.id, 0, 1));
            if(selectedPiece.id.includes("y1")){
                let squareInFront = document.getElementById(getDifferentSquareId(selectedPiece.id, 0, 1));
                if(!squareInFront.classList.contains('piece')) {
                    availableSquareIds.push(getDifferentSquareId(selectedPiece.id, 0, 2));
                }
            }
            if(!selectedPiece.id.includes("x7")){
                availableSquareIds.push(getDifferentSquareId(selectedPiece.id, 1, 1));
            }
            if(!selectedPiece.id.includes("x0")){
                availableSquareIds.push(getDifferentSquareId(selectedPiece.id, -1, 1));
            }
        }
        if(selectedPiece.classList.contains('black')) {
            availableSquareIds.push(getDifferentSquareId(selectedPiece.id, 0, -1));
            if(selectedPiece.id.includes("y6")){
                let squareInFront = document.getElementById(getDifferentSquareId(selectedPiece.id, 0, -1));
                if(!squareInFront.classList.contains('piece')) {
                    availableSquareIds.push(getDifferentSquareId(selectedPiece.id, 0, -2));
                }
            }
            if(!selectedPiece.id.includes("x7")){
                availableSquareIds.push(getDifferentSquareId(selectedPiece.id, 1, -1));
            }
            if(!selectedPiece.id.includes("x0")){
                availableSquareIds.push(getDifferentSquareId(selectedPiece.id, -1, -1));
            }
        }

        let blocked = false;
        console.table(availableSquareIds);
        for (idNumber in availableSquareIds){
            const squareToMoveTo = document.getElementById(availableSquareIds[idNumber]);
            if(idNumber==0 & squareToMoveTo.classList.contains('piece')){
                blocked = true;
            } else {
                blocked = false;
            }
            
            if(!(selectedPiece.id.charAt(1) == availableSquareIds[idNumber].charAt(1)) & squareToMoveTo.classList.contains('piece')){
                if((selectedPiece.classList.contains('white') & squareToMoveTo.classList.contains('black')) | selectedPiece.classList.contains('black') & squareToMoveTo.classList.contains('white')){
                    document.getElementById(availableSquareIds[idNumber]).classList.add('can-be-killed');
                }
            }
            
            if((selectedPiece.id.charAt(1) == availableSquareIds[idNumber].charAt(1)) & !document.getElementById(availableSquareIds[idNumber]).classList.contains('piece')){
                if(!(idNumber == 1 & blocked)){
                    const newMove = document.createElement('div');
                    document.getElementById(availableSquareIds[idNumber]).appendChild(newMove);
                    document.getElementById(availableSquareIds[idNumber]).classList.add('available-move');
                    newMove.classList.add('available-move-bubble', 'image');
                }
            }
        }

    }

    if(selectedPiece.classList.contains('knight')){
        availableSquareIds.push(getDifferentSquareId(selectedPiece.id, 1, 2));
        availableSquareIds.push(getDifferentSquareId(selectedPiece.id, 2, 1));
        availableSquareIds.push(getDifferentSquareId(selectedPiece.id, 1, -2));
        availableSquareIds.push(getDifferentSquareId(selectedPiece.id, 2, -1));
        availableSquareIds.push(getDifferentSquareId(selectedPiece.id, -1, 2));
        availableSquareIds.push(getDifferentSquareId(selectedPiece.id, -2, 1));
        availableSquareIds.push(getDifferentSquareId(selectedPiece.id, -1, -2));
        availableSquareIds.push(getDifferentSquareId(selectedPiece.id, -2, -1));
    }

    if(selectedPiece.classList.contains('bishop') | selectedPiece.classList.contains('queen')){
        let counter = 1;
        let block = 1;
        do {
            availableSquareIds.push(getDifferentSquareId(selectedPiece.id, counter, counter));
            block = checkIfPieceCanMoveHere(selectedPiece.id, getDifferentSquareId(selectedPiece.id, counter, counter));
            counter++;
        } while(block ==1);
        counter=1;
        do {
            availableSquareIds.push(getDifferentSquareId(selectedPiece.id, -counter, counter));
            block = checkIfPieceCanMoveHere(selectedPiece.id, getDifferentSquareId(selectedPiece.id, -counter, counter));
            counter++;
        } while(block ==1);
        counter=1;
        do {
            availableSquareIds.push(getDifferentSquareId(selectedPiece.id, counter, -counter));
            block = checkIfPieceCanMoveHere(selectedPiece.id, getDifferentSquareId(selectedPiece.id, counter, -counter));
            counter++;
        } while(block ==1);
        counter=1;
        do {
            availableSquareIds.push(getDifferentSquareId(selectedPiece.id, -counter, -counter));
            block = checkIfPieceCanMoveHere(selectedPiece.id, getDifferentSquareId(selectedPiece.id, -counter, -counter));
            counter++;
        } while(block ==1);
    }

    if(selectedPiece.classList.contains('rook') | selectedPiece.classList.contains('queen')){
        counter = 1;
        block = 1;
        do {
            availableSquareIds.push(getDifferentSquareId(selectedPiece.id, 0, counter));
            block = checkIfPieceCanMoveHere(selectedPiece.id, getDifferentSquareId(selectedPiece.id, 0, counter));
            counter++;
        } while(block ==1);
        counter=1;
        do {
            availableSquareIds.push(getDifferentSquareId(selectedPiece.id, counter, 0));
            block = checkIfPieceCanMoveHere(selectedPiece.id, getDifferentSquareId(selectedPiece.id, counter, 0));
            counter++;
        } while(block ==1);
        counter=1;
        do {
            availableSquareIds.push(getDifferentSquareId(selectedPiece.id, 0, -counter));
            block = checkIfPieceCanMoveHere(selectedPiece.id, getDifferentSquareId(selectedPiece.id, 0, -counter));
            counter++;
        } while(block ==1);
        counter=1;
        do {
            availableSquareIds.push(getDifferentSquareId(selectedPiece.id, -counter, 0));
            block = checkIfPieceCanMoveHere(selectedPiece.id, getDifferentSquareId(selectedPiece.id, -counter, 0));
            counter++;
        } while(block ==1);
    }

    if(selectedPiece.classList.contains('king')) {
        availableSquareIds.push(getDifferentSquareId(selectedPiece.id, 1, 1));
        availableSquareIds.push(getDifferentSquareId(selectedPiece.id, -1, 1));
        availableSquareIds.push(getDifferentSquareId(selectedPiece.id, 1, -1));
        availableSquareIds.push(getDifferentSquareId(selectedPiece.id, -1, -1));
        availableSquareIds.push(getDifferentSquareId(selectedPiece.id, 0, 1));
        availableSquareIds.push(getDifferentSquareId(selectedPiece.id, 1, 0));
        availableSquareIds.push(getDifferentSquareId(selectedPiece.id, 0, -1));
        availableSquareIds.push(getDifferentSquareId(selectedPiece.id, -1, 0));
    }
    
    if(!selectedPiece.classList.contains('pawn')){
        for (idNumber in availableSquareIds){
            if(checkIfPieceCanMoveHere(selectedPiece.id, availableSquareIds[idNumber]) == 1) {
                const newMove = document.createElement('div');
                document.getElementById(availableSquareIds[idNumber]).appendChild(newMove);
                document.getElementById(availableSquareIds[idNumber]).classList.add('available-move');
                newMove.classList.add('available-move-bubble', 'image');
            } else if (checkIfPieceCanMoveHere(selectedPiece.id, availableSquareIds[idNumber]) == 2) {
                document.getElementById(availableSquareIds[idNumber]).classList.add('can-be-killed');
            }
        }
    }
}


function resetSelectedPieceOutsideOfSquares() {
    if(!squareClicked){
        resetSelectedPiece();
    }
    squareClicked = false;
}


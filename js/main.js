'use strict'
const MINE = '💣'
const SUSPECT = '🚩'
const EMPTY = ''

var minesLocation
var isFirstClick
var gStartTime
var gTimerInterval
var gBoard
var gLevel = { size: 4, mines: 2 }
var gGame = { isOn: false, shownCount: 0, markedCount: 0, }

function init() {
    isFirstClick = true
    gBoard = createBoard()
    renderBoard()
}
function createCell() {
    return {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
    }
}
function createBoard() {
    var board = [];
    for (var i = 0; i < gLevel.size; i++) {
        board.push([])
        for (var j = 0; j < gLevel.size; j++) {
            board[i][j] = createCell()
        }
    }
    return board;
}
function placeMines() {
    var mines = gLevel.mines
    for (var i = 0; i < mines; i++) {
        var randomI = getRandomInt(0, gLevel.size)
        var randomJ = getRandomInt(0, gLevel.size)
        if (gBoard[randomI][randomJ].isMine) i--
        gBoard[randomI][randomJ].isMine = true
    }

}
function setMinesNegsCount(gBoard) {
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            var negsCount = countNeighbors(i, j, gBoard)
            gBoard[i][j].minesAroundCount = negsCount
        }
    }
}
function countNeighbors(cellI, cellJ, gBoard) {
    var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (gBoard[i][j].isMine) neighborsCount++;
        }
    }
    return neighborsCount;
}
function renderBoard() {
    var strHTML = '';
    for (var i = 0; i < gLevel.size; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gLevel.size; j++) {
            var currCell = gBoard[i][j]
            var className = (currCell.isMine) ? `mine cell-${i}-${j}` : `cell-${i}-${j}`;
            //  var cell = (currCell.isMine) ? MINE : ' '
            strHTML += `<td class="${className}" onmousedown="cellClicked(event,${i},${j})"></td>`;
        }
        strHTML += '</tr>';
    }
    var elBoard = document.querySelector('.board-container');
    elBoard.innerHTML = strHTML;
}
function cellClicked(elCell, i, j) {
    if (isFirstClick) {
        FirstClick(i, j)
    } 
        switch (elCell.button) {
            case 0:
                leftClick(elCell, i, j)
                checkGameOver()
                break;
            case 2:
                cellMarked(elCell, i, j)
                checkGameOver()

                break;
        }
}

function cellMarked(elCell, i, j) {
    var currCell = gBoard[i][j]
    var location = getLocation(`.cell-${i}-${j}`)
    console.log('hi');
    if (currCell.isShown) return
    if (currCell.isMarked) {
        renderCell(location, EMPTY)
        currCell.isMarked = false
        gGame.markedCount--
    } else {
        currCell.isMarked = true
        renderCell(location, SUSPECT)
        gGame.markedCount++
    }
}
function newGame() {
    clearInterval(gTimerInterval);
    document.querySelector('.timer').innerHTML = 'time: 00:000'
    init();
}
function FirstClick(i, j) {
    gGame.isOn=true
    gStartTime = new Date();
    gTimerInterval = setInterval(renderTimer, 10);
    placeMines()
    setMinesNegsCount(gBoard)
    findMinesLocation()

    isFirstClick = false
    renderBoard()

}
function leftClick(elCell, i, j) {
    var currCell = gBoard[i][j]
    if (currCell.isMine) {
        onMine()
        return
    }
    if (currCell.isMarked) return
    else {
        currCell.isShown = true
        var location = getLocation(`.cell-${i}-${j}`)
        renderCell(location, currCell.minesAroundCount)
        gGame.shownCount++
        if (currCell.minesAroundCount === 0) {
            expandShown(gBoard, elCell, i, j)

        }
    }
}
function expandShown(gBoard, elCell, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            var currCell = gBoard[i][j]
            if (currCell.isMarked) continue;
            var location = getLocation(`cell-${i}-${j}`)
            renderCell(location, currCell.minesAroundCount);
            gGame.shownCount++
        }
    }
}
// }
function onMine() {
    var elMines = document.querySelectorAll('.mine')
    for (var i = 0; i < elMines.length; i++) {
        elMines[i].innerText = MINE
    }
    var elModal = document.querySelectorAll('.modal')
    elModal.innerText = 'You lost'
    console.log(elModal);
    elModal.display = 'block'
    clearInterval(gTimerInterval);
}
function checkGameOver() {
    if (checkShown && checkMinesMark) {
        gGame.isOn=false

    }
}

function findMinesLocation() {
    minesLocation = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j]
            var location = {
                i,
                j,
            }
            if (currCell.isMine) {
                minesLocation.push(location)
            }
        }
    }
    return minesLocation
}
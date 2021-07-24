'use strict'
function createBoard() { //creates the board with cell objects
    var board = [];
    for (var i = 0; i < gLevel.size; i++) {
        board.push([])
        for (var j = 0; j < gLevel.size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }
        }
    }
    return board;
}
function renderBoard() { //present the board 
    var strHTML = '';
    for (var i = 0; i < gLevel.size; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < gLevel.size; j++) {
            var currCell = gBoard[i][j]
            var className = (currCell.isMine) ? `mine cell-${i}-${j}` : `cell-${i}-${j}`
            strHTML += `<td class="${className}" oncontextmenu="cellMarked(this,${i},${j});return false;" onclick="leftClick(this,${i},${j})"></td>\n`;
        }
        strHTML += '</tr>\n';
    }
    var elBoard = document.querySelector('.board-container');
    elBoard.innerHTML = strHTML;
}
function setMinesNegsCount(gBoard) { //count mines in neighbor cell
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
function placeMines(i, j) { // place mines randomly at the board
    var mines = gLevel.mines
    for (var idx = 0; idx < mines; idx++) {
        var randomI = getRandomInt(0, gLevel.size)
        var randomJ = getRandomInt(0, gLevel.size)
        if (gBoard[randomI][randomJ].isMine) idx--
        if (i !== randomI && j !== randomJ) {
            gBoard[randomI][randomJ].isMine = true
        } 
        else {
            idx--
        }
    }
}
function renderTimer() {
    var currentTime = new Date();
    var timeElapsed = new Date(currentTime - gStartTime);
    var min = timeElapsed.getUTCMinutes();
    var sec = timeElapsed.getUTCSeconds();
    var ms = timeElapsed.getUTCMilliseconds();
    document.querySelector('.timer').innerHTML = 'Time: ' + ('0' + min) + ':' + (sec > 9 ? sec : '0' + sec) + ':' +
        (ms > 99 ? ms : ms > 9 ? '0' + ms : '00' + ms);
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is inclusive and the minimum is inclusive 
}
function chooseBoardSize(elButton) { //changes the level according the radio buttons
    gLevel.size = elButton.getAttribute('data-inside');
    gLevel.mines = elButton.getAttribute('data-mines');
    gLevel.lives = elButton.getAttribute('data-lives');
    init();
}
function findMinesLocation() { //for me the test the game different possibilities
    minesLocations = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j]
            var location = {
                i,
                j,
            }
            if (currCell.isMine) {
                minesLocations.push(location)
            }
        }
    }
    return minesLocations
}
function renderLives() {
    var elLives = document.querySelector('.lives')
    elLives.innerText = `Lives: ${gLevel.lives}`
}
function useHint() {
    var elHint = document.querySelector('.hints')
    if (gGame.isHintOn) {
        elHint.innerText = 'hints: ' + HINT.repeat(3)
        gGame.isHintOn = false
    } else if (!gGame.isHintOn) {
        gGame.isHintOn = true
        var elHint = document.querySelector('.hints')
        elHint.innerText = 'hints: ' + '⚡'.repeat(3)
    }
}

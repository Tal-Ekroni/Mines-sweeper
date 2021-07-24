'use strict'
const MINE = '💣'
const FLAG = '🚩'
const UN_ARMED = '❌'
const EMPTY = ''
const NORMAL = '😄'
const SAD = '😪'
const HAPPY = '😎'
const HINT = '💡'

var gLevel = { size: 4, mines: 2, lives: 1 }//sets game level
var gGame // the model
var minesLocations //for checks only
var gStartTime
var gTimerInterval
var gBoard

//happens on load of the page reset all
function init() {
    var levelData = document.querySelector('input[name="level"]:checked')
    gLevel.size = levelData.getAttribute('data-inside');
    gLevel.mines = levelData.getAttribute('data-mines');
    gLevel.lives = levelData.getAttribute('data-lives');
    var elHints = document.querySelector('.hints')
    elHints.innerText = 'hints: ' + HINT.repeat(3)
    var elButton = document.querySelector('.start-button')
    elButton.innerText = NORMAL
    document.querySelector('.timer').innerHTML = 'Time: 00:00:000'
    gBoard = createBoard()
    clearInterval(gTimerInterval);
    gGame = { isOn: false, shownCount: 0, markedCount: 0, isFirstClick: true, isHintOn: false }
    renderBoard()
    renderLives()
}
//after first click mines are placed and time start running
function FirstClick(i, j) {
    gGame.isFirstClick = false
    gGame.isOn = true
    gStartTime = new Date();
    gTimerInterval = setInterval(renderTimer, 10);
    placeMines(i, j)
    setMinesNegsCount(gBoard)
    findMinesLocation()
    renderBoard()
    var elCell = document.querySelector(`.cell-${i}-${j}`)
    elCell.innerText = gBoard[i][j].minesAroundCount
    elCell.classList.add('clicked')
    var currCell = gBoard[i][j]
    if (currCell.minesAroundCount === 0) {
        expandShown(i, j)
        return
    }
}
function leftClick(elCell, cellI, cellJ) {//reveals a num or mine and decrease lives
    var currCell = gBoard[cellI][cellJ]
    if (gGame.isFirstClick) {
        FirstClick(cellI, cellJ)
        elCell.classList.add('clicked')
        return
    }
    if (!gGame.isOn) return
    if (currCell.isMarked) return
    if (currCell.isMine) {
        if (currCell.isShown) return
        if (gLevel.lives <= 1) {//game over out of lives
            renderLives()
            hitMine()
            return
        } else {
            elCell.classList.add('showMines')//add red color to a shown mine
            gLevel.lives--
            renderLives()
            gGame.shownCount++
            currCell.isShown = true
            elCell.innerText = MINE
            elCell.classList.add('clicked')
            console.log(elCell);
        }
        return
    }
    if (currCell.isMarked) return
    if (!currCell.isShown) {
        //reveals num
        //updating model
        currCell.isShown = true
        gGame.shownCount++
        //updating DOM
        elCell.innerText = currCell.minesAroundCount
        elCell.classList.add('clicked')
        // elCell.classList.add('.clicked')
        //expend 1st degree negs
        if (currCell.minesAroundCount === 0) {
            elCell.innerText = EMPTY
            expandShown(cellI, cellJ)
            checkGameOver()
        }
        checkGameOver()
    }

}
function cellMarked(elCell, i, j) { //flags/unflagges a cell
    var currCell = gBoard[i][j]
    if (!gGame.isOn) return
    if (currCell.isShown) return
    if (currCell.isMarked) {
        if (currCell.isMine) {
            elCell.classList.remove('marked')//removes X where a mine was disabled
            gGame.markedCount--
        }
        //updating model
        currCell.isMarked = false
        //updating DOM
        elCell.innerText = EMPTY;
        elCell.classList.remove('clicked')
        return
    }
    if (!currCell.isMarked) {
        if (currCell.isMine) {
            elCell.classList.add('marked')//puts X where a mine was disabled
            gGame.markedCount++
            checkGameOver()
        }
        //updating model 
        currCell.isMarked = true
        //updating DOM
        elCell.innerText = FLAG;
        elCell.classList.add('clicked')
        checkGameOver()
        return
    }
}
function expandShown(cellI, cellJ) { //expand 1st degree negs
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue;
            // if (i === cellI && j === cellJ) continue;
            var currCell = gBoard[i][j]
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            if (currCell.isMarked) continue;
            if (currCell.isMine) continue;
            if (currCell.isShown) continue;
            gGame.shownCount++
            currCell.isShown = true
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            elCell.classList.add('clicked')
            elCell.innerText = currCell.minesAroundCount
            if (currCell.minesAroundCount === 0) {
                elCell.innerText = EMPTY
                expandShown(i, j) //gets the full expand with recursion
            } else continue
        }
    }
}
function hitMine() { //when out of lives and hit mine, all mines will appear
    var elMines = document.querySelectorAll('.mine')
    for (var i = 0; i < elMines.length; i++) {
        elMines[i].innerText = MINE
        elMines[i].classList.add('showMines')
        if (elMines[i].classList.contains("marked")) {
            elMines[i].innerText = UN_ARMED;
        }
    }
    gameOver()
    var elButton = document.querySelector('.start-button')
    elButton.innerText = SAD
    var elLives = document.querySelector('.lives')
    elLives.innerText = `Lives: 0`
}
function gameOver() {
    gGame.isOn = false
    clearInterval(gTimerInterval);
}
function checkGameOver() { //checks if all mines were flagged and all nums are reveald
    var reveald = gGame.shownCount
    var flagged = gGame.markedCount
    if (reveald + flagged === gLevel.size ** 2) {
        var elButton = document.querySelector('.start-button')
        elButton.innerText = HAPPY
        gameOver()
    }
}

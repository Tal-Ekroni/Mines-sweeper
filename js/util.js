'use strict'
function renderTimer() {
    var currentTime = new Date();
    var timeElapsed = new Date(currentTime - gStartTime);
    var sec = timeElapsed.getUTCSeconds();
    var ms = timeElapsed.getUTCMilliseconds();
    document.querySelector('.timer').innerHTML = 'Time: ' + (sec > 9 ? sec : '0' + sec) + ':' +
        (ms > 99 ? ms : ms > 9 ? '0' + ms : '00' + ms);
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is inclusive and the minimum is inclusive 
}

function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
    elCell.innerText = value;
}

function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}
function getLocation(str) {
    var strLocation = (str.split('-'))
    var location = {
        i: strLocation[1],
        j: strLocation[2]
    }
    return location
}
function chooseBoardSize(elButton) {
    gLevel.size = elButton.getAttribute('data-inside');
    gLevel.mines = elButton.getAttribute('value');
    newGame();
}

function checkShown() {
    var shownCellsCount = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j]
            if (currCell.isShown) {
                shownCellsCount++
            }
        }
    }
    if (shownCellsCount === gGame.shownCount) {
        return true
    }
    else return false
}
function checkMinesMark() {
    var markCount = 0
    for (var i = 0; i < minesLocation.length; i++) {
        var row = minesLocation[i].i
        var col = minesLocation[i].j
        if (gBoard[row][col].isMarked) {
            markCount++
        }
    }
    if (markCount === gLevel.mines) {
        return true
    } else return false
}
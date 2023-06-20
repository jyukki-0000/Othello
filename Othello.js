// グローバル変数の設定
const boardSize = 8; // ボードの大きさ
let board = []; // ボードの状態を保持する2次元配列
let blackIsNext = true; // 黒が次の手番かどうかを保持
const cells = []; // DOMのセル要素を保持する2次元配列

// ボタンと結果表示部分のDOM要素を取得
const restartButton = document.getElementById('restartBtn');
const result = document.getElementById('result');
const turn = document.getElementById('turn');

// ボードの初期化
function createBoard() {
    const table = document.getElementById('board');
    for (let i = 0; i < boardSize; i++) {
        const row = [];
        const tr = document.createElement('tr');
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement('td');
            cell.classList.add('cell');
            cell.addEventListener('click', () => cellClick(i, j));
            tr.appendChild(cell);
            row.push(cell);
        }
        table.appendChild(tr);
        cells.push(row);
    }
}

// ゲームの初期化
function initBoard() {
    board = [];
    for (let i = 0; i < boardSize; i++) {
        const row = [];
        for (let j = 0; j < boardSize; j++) {
            if ((i === 3 && j === 3) || (i === 4 && j === 4)) {
                row.push('white');
            } else if ((i === 3 && j === 4) || (i === 4 && j === 3)) {
                row.push('black');
            } else {
                row.push(null);
            }
        }
        board.push(row);
    }
    blackIsNext = true;
    updateTurn();
}

// 手番の更新
function updateTurn() {
    turn.textContent = blackIsNext ? '黒のターン' : '白のターン';
}

// ボードの状態を更新
function updateBoard() {
    let blackScore = 0;
    let whiteScore = 0;
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = cells[i][j];
            cell.innerHTML = '';
            const color = board[i][j];
            if (color !== null) {
                const piece = document.createElement('div');
                piece.classList.add(color);
                cell.appendChild(piece);
                if (color === 'black') {
                    blackScore++;
                } else {
                    whiteScore++;
                }
            }
            if (isValidMove(i, j)) {
                const possible = document.createElement('div');
                possible.classList.add('possible');
                cell.appendChild(possible);
            }
        }
    }
    // 全てのマスが埋まった場合もしくは両方のプレイヤーが手を打てない場合にゲーム終了
    if (blackScore + whiteScore === boardSize * boardSize || !canMove()) {
        checkGameOver(blackScore, whiteScore);
    }
}

// 有効な手があるかどうかをチェック
function isValidMove(i, j) {
    if (board[i][j] !== null) {
        return false;
    }
    const flips = getFlips(i, j);
    if (flips.length === 0) {
        return false;
    }
    return true;
}

// 任意のプレイヤーが動けるかどうかをチェック
function canMove() {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (isValidMove(i, j)) {
                return true;
            }
        }
    }
    return false;
}

// セルクリック時の挙動
function cellClick(i, j) {
    if (!isValidMove(i, j)) {
        return;
    }
    const color = blackIsNext ? 'black' : 'white';
    const flips = getFlips(i, j);
    board[i][j] = color;
    for (const [x, y] of flips) {
        board[x][y] = color;
    }
    blackIsNext = !blackIsNext;
    updateTurn();
    updateBoard();
}

// 有効な手があるかどうかをチェック
function isValidMove(i, j) {
    if (board[i][j] !== null) {
        return false;
    }
    const flips = getFlips(i, j);
    if (flips.length === 0) {
        return false;
    }
    return true;
}

// 裏返す石の位置を取得
function getFlips(i, j) {
    const color = blackIsNext ? 'black' : 'white';
    const otherColor = blackIsNext ? 'white' : 'black';
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
    let flips = [];
    for (const [dx, dy] of dirs) {
        let x = i + dx;
        let y = j + dy;
        let temp = [];
        while (x >= 0 && x < boardSize && y >= 0 && y < boardSize && board[x][y] === otherColor) {
            temp.push([x, y]);
            x += dx;
            y += dy;
        }
        if (x >= 0 && x < boardSize && y >= 0 && y < boardSize && board[x][y] === color) {
            flips = flips.concat(temp);
        }
    }
    return flips;
}

// ゲームオーバーの確認と処理
function checkGameOver(blackScore, whiteScore) {
    result.textContent = blackScore > whiteScore ? '黒の勝ち' : '白の勝ち';
    result.classList.remove('hide');
    restartButton.classList.remove('hide');
}

// ゲームのリスタート
function restart() {
    const table = document.getElementById('board');
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    cells.splice(0, cells.length);
    createBoard();
    initBoard();
    updateBoard();
    result.classList.add('hide');
    restartButton.classList.add('hide');
}

// イベントリスナーの設定
restartButton.addEventListener('click', restart);

// ゲームの開始
createBoard();
initBoard();
updateBoard();
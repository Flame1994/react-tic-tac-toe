import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    const test = `square ${props.win ? "winner" : ""}`;
    return (
        <button className={test} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        let win = this.calculateIsWin(i);

        return (
            <Square
                value={this.props.squares[i]}
                win={win}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    calculateIsWin(i) {
        if (this.props.winner) {
            return this.props.winner.includes(i);
        }

        return false;
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        // If winner is set or square has already been selected (not null)
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const draw = calculateDraw(current.squares);

        const moves = history.map((step, move) => {
            const description = move ?
                'Go to move #' + move :
                'Go to game start';
            const difference = calculateDifference(move, step.squares, history);

            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{description}</button>
                    <p>{difference}</p>
                    <Board
                        squares={step.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </li>
            );
        });

        let status;

        if (winner) {
            status = 'Winner: ' + current.squares[winner[0]];
        } else if (draw) {
            status = 'Draw';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        winner={winner}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateDraw(squares) {
    for (let i = 0; i < squares.length; i++) {
        if (squares[i] == null) {
            return false;
        }
    }

    return true;
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return lines[i];
        }
    }
    return null;
}

function calculateDifference(step, squares, history) {
    if (step <= 0) {
        return 'No move has been made yet.';
    }

    let mover = (step % 2) === 0 ? 'O' : 'X';
    let previousBoard = history[step-1].squares;

    for (let i = 0; i < squares.length; i++) {
        if (squares[i] !== previousBoard[i]) {
            let col = i % 3 + 1;
            let row = Math.floor(i / 3) + 1;
            return mover + " made a move at (" + row + ',' + col + ')';
        }
    }

    return 'No move made';
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

/*
    Created by @ethans333 on Github.
*/

import { drawGrid , clearRows, clearGrid, gridLines } from './Scripts/Grid.js';
import { updateShapes, createRanShape } from './Scripts/Shape.js';


const canvas = document.getElementById("canvas");
export const ctx = canvas.getContext("2d");

export let grid, score = { score: 0, pointsPer: 50}, fall = { interval: '', time: 0, min: 1000, max: 150 }, settings = { gridWidth: 10, gridHeight: 20, squareWidth: 25, canvasWidth: 0, canvasHeight: 0 };

const keyEvents = () => {
    document.onkeydown = checkKey;

    function checkKey(e) {
        e = e || window.event;

        if (e.keyCode == '38') { //up
            shapes.current.rotate();
        } else if (e.keyCode == '40') { //down
            shapes.current.shiftDown();
        } else if (e.keyCode == '37') { //left
            shapes.current.shiftLeft();
        } else if (e.keyCode == '39') { //right
            shapes.current.shiftRight();
        } else if (e.keyCode == '32') { //space
            shapes.current.floor();
        }

    }
}

export const setFallingInterval = (t) => {
    (fall != undefined) && clearInterval(fall.interval);
    fall.interval = setInterval( () => { shapes.current.shiftDown() }, t);
    fall.time = t;
}

const init = _ => {
    canvas.width = settings.gridWidth * settings.squareWidth;
    canvas.height = settings.gridHeight * settings.squareWidth;
    settings.canvasWidth = settings.gridWidth * settings.squareWidth;
    settings.canvasHeight = settings.gridHeight * settings.squareWidth;

    window.requestAnimationFrame(draw);
    
    keyEvents();
    setFallingInterval(fall.min);
}

grid = clearGrid(settings.gridWidth, settings.gridHeight);

const shapes = { static: [], current: createRanShape() }

const draw = _ => {
    ctx.clearRect(0, 0, settings.canvasWidth, settings.canvasHeight);
    grid = clearGrid(settings.gridWidth, settings.gridHeight);
    updateShapes(Array(...shapes.static, shapes.current));

    if (shapes.current.isFloored()) {
        shapes.static.push(shapes.current), shapes.current = createRanShape();
        shapes.static = clearRows(shapes.static);
    }

    gameOver();
    
    drawGrid();
    gridLines();

    window.requestAnimationFrame(draw);
}
init();

const gameOver = () => {
    let gameOver = false;
    shapes.static.forEach(shape => {
        (shape.y == 0) && (gameOver = true);
    });
    gameOver && (alert(`Game Over! Final Score: ${score.score}`), shapes.static = [], setFallingInterval(fall.min));
}
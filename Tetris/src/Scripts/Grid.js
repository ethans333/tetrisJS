import { settings, ctx, grid, setFallingInterval, fall, score } from '../Main.js';

const colors = {
    0: "clear",
    1: "#82cfed", // Blue
    2: "#FDFD97", // Yellow
    3: "#FFC2C1", // Pink
    4: "#9EE09E", // Green
    5: "#FF6663", // Red
    6: "#CC99C9", // Purple
    7: "#FEB144", // Orange
    8: "#f2f2f2" // Grid
};

export const clearGrid = (w, h) => {
    return new Array(h).fill(null).map(() => new Array(w).fill(0));
}

export const drawGrid = _ => {
    for (let row = 0; row < grid.length; row++) {
        for (let column = 0; column < grid[row].length; column++) {

            const color = colors[grid[row][column]];

            if (color == colors[0]) {
                ctx.clearRect(column*settings.squareWidth, row*settings.squareWidth, 
                    settings.squareWidth, settings.squareWidth); 
            } else {
                ctx.fillStyle = color;
                ctx.fillRect(column*settings.squareWidth, row*settings.squareWidth, 
                    settings.squareWidth, settings.squareWidth); 
            }
        }
    }
}

const rowFilled = _ => {
    let filledRows = [];

    for (let row = 0; row < grid.length; row++) {
        !grid[row].includes(0) && (filledRows.push(row),
         setFallingInterval((fall.time * .9 > fall.max) && (fall.time * .9)),
         score.score += score.pointsPer/2,
         document.getElementById("score").innerText = `@ethans333 Score: ${score.score}`);
    }

    return filledRows;
}

export const clearRows = (statics) => {
    rowFilled().forEach(row => {
        for (let column = 0; column < settings.gridWidth; column++) {
            statics.forEach(shape => {
                shape.clearSquareCoord(column, row);
            });
        }
    });

    rowFilled().forEach(row => {
        statics.forEach(shape => {
            shape.aboveRow(row);
        });
    });

    return statics;
}

export const gridLines = () => {
    ctx.strokeStyle = colors[8];

    for (let h = 0; h < settings.gridHeight; h++) {
        ctx.beginPath();
        ctx.moveTo(0, h * settings.squareWidth);
        ctx.lineTo(settings.squareWidth * settings.gridWidth, h * settings.squareWidth);
        ctx.stroke();   
    }

    for (let v = 0; v < settings.gridWidth; v++) {
        ctx.beginPath();
        ctx.moveTo(v * settings.squareWidth, 0);
        ctx.lineTo(v * settings.squareWidth, settings.squareWidth * settings.gridHeight);
        ctx.stroke();   
    }
}
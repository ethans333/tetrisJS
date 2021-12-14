import { grid, settings } from '../Main.js';
import { arrObjIncludes } from './arrObjIncludes.js';

class Shape {
    constructor (x, y, shifts, color, type) {
        this.x = x;
        this.y = y;
        this.shifts = JSON.parse(shifts);
        this.color = color;
        this.type = type;
        this.onGroundBlock = false;
    }

    squareCoords () {
        let squareCoords = [];
        this.shifts.forEach(shift => squareCoords.push({x: shift.x + this.x, y: shift.y + this.y}));
        return squareCoords;
    }

    updateGrid () {
        this.squareCoords().forEach(coord => grid[coord.y][coord.x] = this.color);
    }

    rotate () {
        let shifts = [], oob = false, squareCoords = [], tempCoords = [];

        this.shifts.forEach(coord => {
            (-coord.y + this.x < 0 || -coord.y + this.x > settings.gridWidth - 1 ||
                coord.x + this.y < 0 || coord.x + this.y > settings.gridHeight - 1) && (oob = true);

            shifts.push({x: -coord.y, y: coord.x});
            squareCoords.push({x: this.x - coord.y, y: this.y + coord.x});
        });

        squareCoords.forEach(coord => (!arrObjIncludes(this.squareCoords(), {x: coord.x, y: coord.y})) && tempCoords.push(coord));

        for (let i = 0; i < tempCoords.length; i++) {
            const coord = tempCoords[i];
            tempCoords[i] = (grid[coord.y][coord.x] == 0); 
        }

        (!oob && this.type != "O" && !tempCoords.includes(false)) && (this.shifts = shifts);
    }

    shiftLeft () {
        const oob = [], tempCoords = [];

        this.squareCoords().forEach(coord => oob.push(coord.x - 1 < 0));
        this.squareCoords().forEach(coord => (!arrObjIncludes(this.squareCoords(), {x: coord.x - 1, y: coord.y})) && tempCoords.push(coord));

        for (let i = 0; i < tempCoords.length; i++) {
            const coord = tempCoords[i];
            tempCoords[i] = (grid[coord.y][coord.x - 1] == 0); 
        }

        (!oob.includes(true) && !tempCoords.includes(false)) && (this.x -= 1);
    }

    shiftRight () {
        const oob = [], tempCoords = [];
        
        this.squareCoords().forEach(coord => oob.push(coord.x + 1 < 0));
        this.squareCoords().forEach(coord => (!arrObjIncludes(this.squareCoords(), {x: coord.x + 1, y: coord.y})) && tempCoords.push(coord));

        for (let i = 0; i < tempCoords.length; i++) {
            const coord = tempCoords[i];
            tempCoords[i] = (grid[coord.y][coord.x + 1] == 0); 
        }

        (!oob.includes(true) && !tempCoords.includes(false)) && (this.x += 1);
    }

    shiftDown () {
        const tempCoords = [];

        this.squareCoords().forEach(coord => (!arrObjIncludes(this.squareCoords(), {x: coord.x, y: coord.y + 1})) && tempCoords.push(coord));

        for (let i = 0; i < tempCoords.length; i++) {
            const coord = tempCoords[i];
            tempCoords[i] = (grid[coord.y + 1][coord.x] == 0); 
        }

        (!this.isFloored() && !tempCoords.includes(false)) ? (this.y += 1) : this.onGroundBlock = true;
    }

    isFloored () {
        let isFloored = false;
        this.squareCoords().forEach(coord => (coord.y == settings.gridHeight-1 || this.onGroundBlock) && (isFloored = true));
        return isFloored;
    }

    clearSquareCoord (x, y) {
        for (let i = 0; i < this.shifts.length; i++) {
            (this.x + this.shifts[i].x == x && this.y + this.shifts[i].y == y) && this.shifts.splice(i, 1);
        }
    }

    aboveRow (row) {
        let aboveRow = false;
        
        this.squareCoords().forEach(coord => {
            (coord.y < row) && (aboveRow = true)
        });

        for (let i = 0; i < this.shifts.length; i++) {
            (this.y + this.shifts[i].y + 1 < settings.gridHeight && aboveRow) && (this.shifts[i].y += 1);   
        }
    }

    floor () {
        while (!this.isFloored()) {
            this.shiftDown()
        }
    }
}

const shapeTypes = {
    I: {coords: [{x: -2, y: 0}, {x: -1, y: 0},  {x: 0, y: 0},  {x: 1, y: 0}],   color: 1},
    O: {coords: [{x: 0, y: 0},  {x: -1, y: -1}, {x: 0, y: -1}, {x: -1, y: 0}],  color: 2},
    T: {coords: [{x: 0, y: 0},  {x: 0, y: 1},   {x: -1, y: 0}, {x: 1, y: 0}],   color: 3},
    S: {coords: [{x: 0, y: 0},  {x: 0, y: 1},   {x: -1, y: 0}, {x: 1, y: 1}],   color: 4},
    Z: {coords: [{x: 0, y: 0},  {x: 1, y: 0},   {x: 0, y: 1},  {x: -1, y: 1}],  color: 5},
    J: {coords: [{x: -1, y: 1}, {x: -1, y: 0},  {x: 0, y: 0},  {x: 1, y: 0}],   color: 6},
    L: {coords: [{x: 0, y: 0},  {x: 1, y: 0},   {x: 1, y: 1},  {x: -1, y: 0}],  color: 7}
};

export const updateShapes = (shapes) => shapes.forEach(shape => {shape.updateGrid()});

const createShape = (shapeType) => new Shape(Math.floor(settings.gridWidth/2), (shapeType == "O") ? 1 : 0, JSON.stringify(shapeTypes[shapeType].coords), shapeTypes[shapeType].color, shapeType);

export const createRanShape = () => createShape(Object.keys(shapeTypes)[Math.floor(Math.random() * Object.keys(shapeTypes).length)]);
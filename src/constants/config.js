import { toIndex } from "../functions/config";

export const TILE_W = 40, TILE_H = 40;
export const MAP_W = 10, MAP_H = 10;

export const START = 12, GOAL = 88;

export const TILETYPES = {
    0: { name: 'wall', color: '#999999' },
    1: { name: 'road', color: '#ccffcc' },
    2: { name: 'exit', color: 'blue' },
    3: { name: 'fire', color: 'red' },
    4: { name: 'fire', color: 'yellow' },
}

export const directions = {
    down: 0,
    left: 1,
    right: 2,
    up: 3,
}

export const modifier = {
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
    up: { x: 0, y: -1 },
};
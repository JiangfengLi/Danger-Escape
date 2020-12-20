import React, { Component } from "react";
import { render } from 'react-dom';
import { TILE_W, TILE_H, MAP_W, MAP_H, TILETYPES, START, GOAL} from "../constants/config";
import { TILES, PARENTS, DISTS }from "../components/map";
import { Stage, Layer, Text, Image } from 'react-konva';
import { Spring, animated } from 'react-spring/renderprops-konva';

export const toIndex = function(x, y)
{
	return((y * MAP_W) + x);
}

export const validMove = function(newX, newY)
{
	return newX >= 0 && newX < MAP_W && newY >= 0 && newY < MAP_H &&
            TILES[toIndex(newX, newY)] !== 0 && TILES[toIndex(newX, newY)] !== 3;
}

export const spawn = function(x, y, parentIdx){
    var isGoal = false;
    if(validMove(x, y)){
        if(TILES[toIndex(x, y)] === 2) isGoal = true;
        TILES[toIndex(x, y)] = 3;
        PARENTS[toIndex(x, y)] = parentIdx;
    } 
    return isGoal;
        // && TILES[toIndex(x, y)] !== 4)
}

export const changeColor = function(x, y){
    if(spawn(x, y - 1, toIndex(x, y)) || 
        spawn(x + 1, y, toIndex(x, y)) || 
        spawn(x, y + 1, toIndex(x, y)) || 
        spawn(x - 1, y, toIndex(x, y)))
        return true;
    return false;
};

const addNeighbour = function(x, y, parentIdx, type){
    var newDist = DISTS[parentIdx] + 1;
    if(type === 3)
        newDist = calculateGDist(x, y)
    //console.log("newDist: " + newDist);
    if(validMove(x, y) && DISTS[parentIdx] !== Number(Infinity)
                && newDist < DISTS[toIndex(x, y)]){
        //TILES[toIndex(x, y)] = 3;
        //console.log("x:" + x + " y: " + y);
        PARENTS[toIndex(x, y)] = parentIdx;
        DISTS[toIndex(x, y)] = newDist;
        //console.log(toIndex(x, y) + ": " + DISTS[toIndex(x, y)]);
        //pq.enqueue(toIndex(x, y), calculateFDist(x, y));
    }
}

const findNeighbours = function(x, y, type){
    addNeighbour(x + 1, y, toIndex(x, y), type); 
    addNeighbour(x, y + 1, toIndex(x, y), type); 
    addNeighbour(x - 1, y, toIndex(x, y), type);
    addNeighbour(x, y - 1, toIndex(x, y), type);
};

export const buildPath = function(goal){
    var last = PARENTS[goal];
    TILES[goal] = 4;
    while(last !== 0){
        TILES[last] = 4;
        last = PARENTS[last];
        //console.log("last: " + last);
    }
}

export const clearMap = function(){
    TILES.map((val, i) => { 
        if(val === 3 || val === 4) TILES[i] = 1;
        //if(val === 2) goal = i;
    });
    PARENTS.map((val, i) => { 
       PARENTS[i] = 0;
    });
    TILES[GOAL] = 2;
    ////console.log(TILES);
}

export const setDISTS = function(value){
    DISTS.map((val, i) => { 
        DISTS[i] = value;
    });
    ////console.log(DISTS);
}

export const calculateGDist = function(currX, currY){
    const startX = START % MAP_W, startY = Math.floor(START / MAP_H), 
        endX = GOAL % MAP_W, endY = Math.floor(GOAL / MAP_H);

    //currX = curr % MAP_W, currY = Math.floor(curr / MAP_H),
    //DISTS[toIndex(currX, currY)] +
    return (Math.abs(currX - startX) + Math.abs(currY - startY)) +
        (Math.abs(endX - currX) + Math.abs(endY - currY));
}

export const minDistance = function(currX, currY){
    var min = Number(Infinity), minIdx = -1;

    for (var v = 0; v < DISTS.length; v++) { 
        if (validMove(v % MAP_W, Math.floor(v / MAP_H)) && DISTS[v] <= min) { 
            min = DISTS[v];
            minIdx = v;
        } 
    }    

    return minIdx;
}

export const BFSSearch = function(GameMap, hasCharacter){            
            ////console.log("count: " + (++count));
            ////console.log("GameMap: " + GameMap);

            var attacked = [], pathFound = false, goal = -1;
            TILES.map((val, i) => { 
                if(val === 3) attacked.push(i);
                //if(val === 2) goal = i;
            });
            attacked.map((index) => {
                //pathFound = true;
                pathFound = changeColor(index % MAP_W, Math.floor(index / MAP_H));               
            })

            //console.log("pathFound: " + pathFound + " hasCharacter: " + hasCharacter);
            if(pathFound === true && !hasCharacter) buildPath(GOAL);
            
            GameMap.setState({ tiles: updateTiles()});
    return pathFound;
}

export const pathSearch = function(GameMap, type){
    const curr = Number(minDistance());
    //console.log("curr: " + curr);
    //console.log("TILES[curr]: " + TILES[curr]);
    if(TILES[curr] === 2){
        buildPath(curr);
        GameMap.setState({ tiles: updateTiles()});
        return true;
    }
    
    TILES[curr] = 3;
    findNeighbours(curr % MAP_W, Math.floor(curr / MAP_H), type);
    GameMap.setState({ tiles: updateTiles()});
    return false;
}

export const updateTiles = function(){
    const cells = TILES.map((el, i) => {
        //const bg = this.state.clickedIndex.indexOf(i) > -1 ? 'black' : tileTypes[el].color
        //return <div className="box" onClick={() => this.onClick(i)} style={{background: bg}}>{i}</div>
            ////console.log("el: " + el + " i: " + i);
            ////console.log("x: " + (i % mapW) + " y: " + Math.floor(i / mapH));
            return (
                <Spring
                    native
                    from={{ fill: TILETYPES[el].color }}
                    to={{
                    fill: TILETYPES[el].color,
                    }}
                    config={{
                        duration: 200,
                    }}
                    key={i}
                >
                    {props => (<animated.Rect
                            {...props}
                            x={(i % MAP_W)*TILE_W}
                            y={Math.floor(i / MAP_H)*TILE_H}
                            width={TILE_W}
                            height={TILE_H}
                            key={i}
                />)}
              </Spring>
              );
              //onDragEnd={this.changeColor}
              //onDragStart={this.changeColor}

    })
    return cells;
}

export const setFinalScreen = function(title, color, image){
    return(
        <Stage width={400} height={400}>
            <Layer>
                <Image image={image} 
                    x={0} y={0} 
                    width={400}
                    height={400}
                    />
                <Text 
                    x={150}
                    y={150}
                    text={title} 
                    fontSize={50}
                    fill={color}
                />
            </Layer>
        </Stage>
    );
}
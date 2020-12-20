import { useState } from "react";
//import { TILES } from "../../components/map";
import { validMove } from "../../functions/config";
//import { playerPosition } from "../../components/map";
//const position = { x: 0, y: 0};

export default function useWalk(maxSteps){
    const [position, setPosition] = useState({x: 2, y: 1});
    const [dir, setDir] = useState(0);
    const [step, setStep] = useState(0);
    //var userState = 0;

    const directions = {
        down: 0,
        left: 1,
        right: 2,
        up: 3,
    }

    const modifier = {
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 },
        up: { x: 0, y: -1 },
    };

    function walk(dir, playerPostion){
        //console.dir(directionis[dir]);
        //var playerState = 0;
        if(directions.hasOwnProperty(dir)){
            setDir((prev) => {
                if(directions[dir] === prev) move(dir, playerPostion);
                //console.log("prev: " + prev);
                return directions[dir];
            });
            setStep((prev) => (prev < maxSteps - 1 ? prev + 1 : 0));    
        }
    }

    function move(dir, playerPostion){
        var newX = playerPostion.x + modifier[dir].x;
        var newY = playerPostion.y + modifier[dir].y;
        if(validMove(newX, newY)){
            setPosition((prev) => ({
                x: newX,
                y: newY
            }));
        }
        //userState = updatePlayerStatus(position);
        //position.x = position.x + modifier[dir].x;
        //position.y = position.y + modifier[dir].y;
        ////console.log("position.x: " + position.x);
        ////console.log("position.y: " + position.y);
        ////console.log("setPosition: " + setPosition);
    }

    function setDefaultVal(){
        setDir((prev) => {
            return 0;
        });
        setPosition((prev) => ({
            x: 2,
            y: 1
        }));
        setStep((prev) => (0));
    }

    ////console.log("position.y: " + position.y);
    ////console.log("position.x: " + position.x);

    return {
        walk, 
        dir, 
        step, 
        position,
        setDefaultVal
    };
}
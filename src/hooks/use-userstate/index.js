import { useState } from "react";

//const position = { x: 0, y: 0};

export default function useUserState(){
    const [playerState , setPlayerState] = useState(1);

    function update(newPlayerState){
        setPlayerState((prev) => (newPlayerState));
        //userState = updatePlayerStatus(position);
        //position.x = position.x + modifier[dir].x;
        //position.y = position.y + modifier[dir].y;
        //console.log("position.x: " + position.x);
        //console.log("position.y: " + position.y);
        //console.log("setPosition: " + setPosition);
    }

    return {
        update, 
        playerState,
    };
}
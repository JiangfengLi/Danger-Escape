import React from "react";

export default function Sprite({ image, data, position }){
    const { y, x, h, w } = data;

    //console.log("position.y: " + position.y);
    //console.log("position.x: " + position.x);

    return <div 
        style={{
            position: "absolute",
            top: position.y * 40,
            left: position.x * 40,
            height: `${h}px`,
            width: `${w}px`,
            backgroundImage: `url(${image})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: `-${x}px -${y}px`
        }}
    />
}
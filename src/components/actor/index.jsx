import React from "react";
import Sprite from "../sprite";

export default function Actor({ 
    sprite, 
    data, 
    position={ x: 2, y: 1}, 
    step = 0, 
    dir = 0,
}){
    const{ h, w } = data;
    
    return(
        <Sprite 
            image={sprite} 
            position={position}
            data={{
                x: step * w,
                y: dir * h,
                w,
                h,
            }}
            step={step}
            dir={dir}
        />
    );
}
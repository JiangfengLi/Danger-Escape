import React, { Component, useEffect } from "react";
import { render } from 'react-dom';
import Actor from "../actor";
import useKeyPress from "../../hooks/use-key-press";
import useWalk from "../../hooks/use-walk";
import useUserState from "../../hooks/use-userstate";
import { Stage, Layer, Text, Rect, Image } from 'react-konva';
import { TILE_W, TILE_H, MAP_W, MAP_H} from "../../constants/config";
import { toIndex, changeColor, updateTiles, buildPath, setDefaultInterval, updateMap } from "../../functions/config";
import { TILES, playerPosition } from "../map";
import useImage from 'use-image';

var count = 0, playerState = 1, isClosed = false, goal = -1;
var myInterval;
var pathFound = false;

class GameMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {tiles: updateTiles(), userState: 1 };
      }

    componentDidMount() {
        var { myInterval, playerState, pathFound } =
        setDefaultInterval(myInterval, this, playerState, playerPosition, pathFound);
    }
    
    componentWillUnmount() {
        clearInterval(myInterval);
    }
         
    render() {
        //if(pathFound === true) clearInterval(myInterval);
        console.log("playerState: " + this.state.userState);
        if(this.state.userState === 2){
            console.log("myInterval is closed!!");
            clearInterval(myInterval);
            return (
                <Stage width={400} height={400}>
                    <Layer>
                        <Image image={this.props.image} 
                            x={0} y={0} 
                            width={400}
                            height={400}
                            />
                        <Text 
                            x={150}
                            y={150}
                            text="You win!" 
                            fontSize={50}
                            fill="yellow"
                        />
                    </Layer>
                </Stage>
            );
        }
        else if(this.state.userState === 1){
            return(<div>
                {updateMap(this.state.tiles)}
                <Actor 
                    sprite={`/sprites/skins/${this.props.skin}.png`} 
                    data={this.props.data} 
                    step={this.props.step} 
                    dir={this.props.dir}
                    position={this.props.position}
                />
            </div>);
        } else {
            console.log("myInterval is closed!!");
            clearInterval(myInterval);
            return (
                <Stage width={400} height={400}>
                    <Layer>
                        <Image 
                            image={this.props.image2} 
                            x={0} y={0} 
                            width={400}
                            height={400}
                        />
                        <Text 
                            x={100}
                            y={150}
                            text="You lose T-T !" 
                            fontSize={25}
                            fill="white"
                        />
                    </Layer>
                </Stage>
        );       
        } 
    }
}

export default GameMap;
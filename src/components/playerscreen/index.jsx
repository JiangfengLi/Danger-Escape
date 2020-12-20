import React, { Component, useEffect } from "react";
import { render } from 'react-dom';
import Actor from "../actor";
import useKeyPress from "../../hooks/use-key-press";
import useWalk from "../../hooks/use-walk";
import {Button} from "react-bootstrap"
import { Stage, Layer } from 'react-konva';
import { TILE_W, TILE_H, MAP_W, MAP_H, START} from "../../constants/config";
import { toIndex, updateTiles, BFSSearch, pathSearch, 
    setDISTS, setFinalScreen, clearMap, calculateGDist } from "../../functions/config";
import { TILES, DISTS } from "../map";
import useImage from 'use-image';
import firebase from '../../firebase';
import { useAuth } from "../../contexts/AuthContext";

var playMode = 1, playerState = 1, userId = null, playerPosition = { x: 2, y: 1};
var myInterval;
var pathFound = false, needReset = false, intervalCleared = false, userLoaded = false
, onLoading = false, isPaused = false;
var currentUserEmail;
var userMapData = null;
//var usersData = [];

function stopInterval(){
    if(myInterval != null && !intervalCleared){
        clearInterval(myInterval);
        intervalCleared = true;
        ////console.log("myInterval is closed!!");
    }
}

class GameMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {tiles: updateTiles(), userState: 1, userPos: { x: 2, y: 1}};

        this.setBFSInterval = this.setBFSInterval.bind(this);
        this.setDijkstraInterval = this.setDijkstraInterval.bind(this);
        this.setAStarInterval = this.setAStarInterval.bind(this);
        this.setDefaultInterval = this.setDefaultInterval.bind(this);
        //this.pauseOrResumeGame = this.pauseOrResumeGame.bind(this);
      }

    componentDidMount() {
        this.setDefaultInterval();
    }
    
    componentWillUnmount() {
        currentUserEmail = '';
        stopInterval();
    }

    setDefaultInterval(){

        //console.log("set default !!!");

        clearMap();
        //console.log("playerState: " + playerState);
        stopInterval();

        playMode = 1;
        needReset = true;
        TILES[START + 1] = 3;
        playerState = 1;
        playerPosition = { x: 2, y: 1}
        pathFound = false;
        this.setState({ tiles: updateTiles(), 
            userState: TILES[toIndex(playerPosition.x, playerPosition.y)],
            userPos: {x: playerPosition.x, y: playerPosition.y}});

        intervalCleared = false;
        myInterval = setInterval(() => {
            if(!isPaused){
                if(!onLoading){
                    BFSSearch(this, true);
                    ////console.log("setDefaultInterval x: " + playerPosition.x + " y: " + playerPosition.y);
                    //this.setState({ tiles: updateTiles(), 
                } else{
                    this.setState({ tiles: updateTiles()});
                    onLoading = false;
                }
                this.setState({userState: TILES[toIndex(playerPosition.x, playerPosition.y)]});
                playerState = TILES[toIndex(playerPosition.x, playerPosition.y)];
            }
        }, 3000)
    }

    setBFSInterval(){
        //console.log("setBFSInterval!!!");

        clearMap();
        stopInterval();
        
        playMode = 2;
        TILES[START] = 3;
        pathFound = false;
        intervalCleared = false;
        myInterval = setInterval(() => {
            if(!pathFound && !isPaused)
                pathFound = BFSSearch(this, false);
            else if(!isPaused)
                stopInterval();
        }, 500)
    }

    setDijkstraInterval(){
        //console.log("setDijkstraInterval!!!");

        clearMap();
        setDISTS(Number(Infinity));
        stopInterval();
        
        playMode = 2;
        DISTS[START] = 0;
        TILES[START] = 1;
        pathFound = false;
        intervalCleared = false;
        ////console.log("DISTS[START] 1: " + DISTS[START]);
        myInterval = setInterval(() => {
            ////console.log("DISTS[START] 2: " + DISTS[START]);
            //console.log("myInterval before pathFound : " + pathFound);
            if(!pathFound && !isPaused)
                pathFound = pathSearch(this, 2);
            else if(!isPaused)
                stopInterval();
            //console.log("myInterval after pathFound : " + pathFound);
            ////console.log("DISTS: " + DISTS);
        }, 500)
    }

    setAStarInterval(){
        //console.log("setAStarInterval!!!");

        clearMap();
        setDISTS(Number(Infinity));
        stopInterval();
        
        playMode = 2;
        DISTS[START] = calculateGDist(START % MAP_W, Math.floor(START / MAP_H));
        TILES[START] = 1;
        pathFound = false;
        //PQ = new PriorityQueue();
        //PQ.enqueue(START, calculateFDist(START % MAP_W, Math.floor(START / MAP_H)));
        ////console.log("PriorityQueue 1: " + PQ.printPQueue());
        intervalCleared = false;
        myInterval = setInterval(() => {
            ////console.log("PriorityQueue 3: " + PQ.printPQueue());
            //console.log("myInterval before pathFound : " + pathFound);
            if(!pathFound && !isPaused)
                pathFound = pathSearch(this, 3);
            else if(!isPaused)
                stopInterval();
            //console.log("myInterval after pathFound : " + pathFound);
        }, 500)
    }

    setGameFunction(){
        return(
            <div className="manipulate heightTopBTN d-flex align-items-center justify-content-center" 
                style={{ height: "50px" }}>
                <Button style={{ margin: "5px" }} className="btn btn-primary w-70 mt-3" 
                    onClick={() => { isPaused = true }}>
                    Pause
                </Button >
                <Button style={{ margin: "5px" }} className="btn btn-primary w-70 mt-3" 
                        onClick={() => { isPaused = false }}>
                    Resume
                </Button >
                <Button style={{ margin: "5px" }} className="btn btn-primary w-70 mt-3" 
                    onClick={this.setDefaultInterval}>
                    Start New Game
                </Button >
            </div>
        );
    }

    createAlgorithmButton(){
        return(
            <div>
                <button onClick={this.setBFSInterval}>BFS</button>
                <button onClick={this.setDijkstraInterval}>Dijkstra</button>
                <button onClick={this.setAStarInterval}>A *</button>
            </div>
        );
    }
         
    render() {

        ////console.log("render userState : " + this.state.userState);
        playerState = TILES[toIndex(playerPosition.x, playerPosition.y)];
        ////console.log("render playerState: " + playerState);
        ////console.log("render needReset: " + needReset);
        //console.log("playMode: " + playMode);
        if(playMode === 1 && (this.state.userState === 2 || playerState === 2)){
            
            ////console.log("myInterval is closed!!");
            stopInterval();
            //playMode = 3;
            playerPosition = { x: 2, y: 1};
            ////console.log("win playMode1 x: " + this.state.userPos.x + " y: " + this.state.userPos.y);
            ////console.log("win playerPosition x: " + playerPosition.x + " y: " + playerPosition.y);           
            return (<>
                    <div style={{ height: "450px" }}>
                        {setFinalScreen("You win!", "yellow", this.props.image)}
                    </div>
                        {this.setGameFunction()}
                    </>
            );
        } else if(playMode === 2){
            ////console.log("pathFound: " + pathFound);
            if(pathFound === true){
                //console.log(TILES);
                stopInterval();
            }

            return(
                <>
                    <div style={{ height: "450px" }}>
                        <div>
                            <Stage width={MAP_W * TILE_W} height={MAP_H * TILE_H}>
                                <Layer>
                                {this.state.tiles}
                                </Layer>
                            </Stage>   
                        </div>
                        {this.createAlgorithmButton()}
                    </div>
                    {this.setGameFunction()}
                </>
            );
        } else if(playMode === 1 && (this.state.userState === 1 || playerState === 1)){
           // //console.log("playMode1 x: " + this.state.userPos.x + " y: " + this.state.userPos.y);
            ////console.log("playerPosition x: " + playerPosition.x + " y: " + playerPosition.y);
            return(
                <div>
                    <div style={{ height: "450px" }}>
                        <div>
                            <Stage width={MAP_W * TILE_W} height={MAP_H * TILE_H}>
                                <Layer>
                                {this.state.tiles}
                                </Layer>
                            </Stage>   
                            <Actor 
                                sprite={`/sprites/skins/${this.props.skin}.png`} 
                                data={this.props.data} 
                                step={this.props.step} 
                                dir={this.props.dir}
                                position={playerPosition}
                            />
                        </div>
                        {this.createAlgorithmButton()}
                    </div>
                    {this.setGameFunction()}
                </div>
            );
        } else if (playMode === 1 && (this.state.userState === 3 || playerState === 3)) {
            
            stopInterval();
            playerPosition = { x: 2, y: 1}
            //playMode = 3;
            return (
                <>
                    <div style={{ height: "450px" }}>
                        {setFinalScreen("You lose T-T !", "white", this.props.image2)}
                    </div>
                    {this.setGameFunction()}
                </>
            );       
        } 
    }
}

export default function PlayeScreen({ skin }){
    const { dir, step, walk, position, setDefaultVal } = useWalk(3);
    const{ currentUser } = useAuth();
    currentUserEmail = currentUser.email;

    if(!needReset){
        playerPosition = position;
        playerState = TILES[toIndex(position.x, position.y)];
    }
    //const { update, playerState } = useUserState();
    const [ image ] = useImage('/img/escape_from_fire.jpg');
    const [ image2 ] = useImage('/img/maxresdefault.jpg');
    
    const data = {
        h: 32,
        w: 32
    }

    useKeyPress((e) => {
        //console.log("useKeyPress needReset: " + needReset);
        //console.log("useKeyPress onLoading: " + onLoading);
        //console.log("useKeyPress isPaused: " + isPaused);
        if(!onLoading && !isPaused){
            //reset the state of players if users restart the game.
            if(needReset){
                setDefaultVal();
                needReset = false;
                playerState = 1;
                //console.log("Reseted !");
            }

            if(playerState <= 1){
                walk(e.key.replace("Arrow", "").toLowerCase(), playerPosition);
                e.preventDefault();
            } 
            /*else if(myInterval != null){
                //isClosed = true;
                myInterval = null;
            }*/
        }
    });

    if(!userLoaded){
        const usersGameData = firebase.database().ref('usersData');

        usersGameData.on('value', (snapshot) => {
          const gameData = snapshot.val();
          for (let id in gameData) {
            //console.log("UserEmail: " + gameData[id].Email)
            if(gameData[id].Email === currentUserEmail) userId = id;
          }
          //console.log("userId: " + userId)
        });

        userLoaded = true;
    }

    const saveGame = () => {
        //console.log("saveGame  playMode  " + playMode);
        if(playMode === 1){
            //console.log("save game!!!");
    
            //TILES[toIndex(playerPosition.x, playerPosition.y)] = 5;
        
            var userSavedData = { Email: currentUserEmail, Map: [...TILES], playerPos: toIndex(playerPosition.x, playerPosition.y)};
            //var userId = -1;
            
            const usersGameData = firebase.database().ref('usersData');
    
            /*
            usersGameData.on('value', (snapshot) => {
              const gameData = snapshot.val();
              for (let id in gameData) {
                //console.log("UserEmail: " + gameData[id].Email)
                if(gameData[id].Email === currentUserEmail) userId = id;
              }
            });
            */
    
            //console.log("userId: " + userId);
            if(userId !== null ){
                const userDataRef = firebase.database().ref('usersData').child(userId);
                userDataRef.update(userSavedData);
            } else{
                usersGameData.push(userSavedData);
            }
    
            TILES[toIndex(playerPosition.x, playerPosition.y)] = playerState;
        }
    }
    

    async function getGameMap(){
        
        var mapData = null, playerLocation = -1;
        const usersGameData = firebase.database().ref('usersData');
        usersGameData.on('value', (snapshot) => {
          const gameData = snapshot.val();
          for (let id in gameData) {
            ////console.log("UserEmail: " + gameData[id].Email)
            if(gameData[id].Email === currentUserEmail 
                && userId === id){
                    mapData = [...gameData[id].Map];
                playerLocation = gameData[id].playerPos;
            }
          }

          ////console.log("mapData: " + mapData);
          if(mapData !== null && playerLocation !== -1){
            playerPosition.x = playerLocation % MAP_W;
            playerPosition.y = Math.floor(playerLocation / MAP_H);
            playerState = mapData[playerLocation];
          }

          userMapData = mapData;
          //TILES = mapData;
          //console.log("userId: " + userId);
          //return mapData;
        });
    }

    const loadGame = async() => {
        //console.log("loadGame  playMode  " + playMode);
        if(playMode === 1){
            //console.log("load game!!!");

            if(userId !== null){
                //console.log("before userMapData: ");
                await getGameMap();
                //loading = true;
                //check whether get the map data successfully
                if(userMapData !== null){
                    //console.log("userMapData: " + userMapData);
                    //TILES = userMapData;
                    TILES.map((val, i) => {
                        TILES[i] = userMapData[i];
                    })
                    onLoading = true;
                    //console.log("onLoading: " + onLoading);
                }
            }
        }
    }


    ////console.log("position.y: " + position.y);
    ////console.log("position.x: " + position.x);

    //playerPosition = position;
    //playerState = TILES[toIndex(position.x, position.y)];
    ////console.log("PlayeScreen  playMode  " + playMode);
    if(playMode === 1){
        return(
            <>
                <GameMap 
                    skin={skin} 
                    image={image} 
                    image2={image2} 
                    dir={dir} 
                    step={step} 
                    data={data}
                />
                <div className="manipulate heightBottomBTN d-flex align-items-center justify-content-center">
                    <Button  style={{ margin: "10px" }} className="btn btn-primary w-40 mt-3" 
                        onClick={saveGame}>
                        Save Game
                    </Button >
                    <Button style={{ margin: "10px" }} className="btn btn-primary w-40 mt-3" 
                        onClick={loadGame}>
                        Load Game
                    </Button >
                </div>
            </>
        );
    } else {
        return(
            <>
                <GameMap 
                    skin={skin} 
                    image={image} 
                    image2={image2} 
                    dir={dir} 
                    step={step} 
                    data={data}
                />
            </>
        );        
    }

}


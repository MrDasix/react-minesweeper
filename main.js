'use strict';

class BoardInfo extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            cols: 5,
            rows: 5
        };

        this.tmp = {
            cols: 5,
            rows: 5
        }

        this.board = React.createRef();
    }

    handleChange = (evt) =>{
        let obj = evt.target;
        if(obj.name == "cols") this.tmp.cols = evt.target.value;
        else if (obj.name == "rows") this.tmp.rows = evt.target.value;
    }

    setBoard = () => {
        this.setState({
            cols: this.tmp.cols,
            rows: this.tmp.rows
        });

        this.board.current.clearBoard(); 
    }

    render(){
        return (
            <div className="info-container">
                <div className="inputs">
                    <input min="5" max="90" type="number" placeholder="5" name="cols" onChange = {this.handleChange}/>
                    <input min="5" max="35" type="number" placeholder="5" name="rows" onChange = {this.handleChange}/>
                    <button onClick={this.setBoard}> Start Game</button>
                </div>
                <div className="grid-parent">
                    <Board ref={this.board} cols={this.state.cols} rows={this.state.rows}/>
                </div>
            </div>
        );
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props);

        this.infoGrid = [];
    }

    clearBoard = () => {
        this.infoGrid.forEach(function(vec){
            vec.forEach(function(el){
                el.ref.current.clearSquare();
            });
        });
    }

    createGrid = () => {

        let tmpGrid = [];
        for(let x = 0; x < this.props.cols; x++){
            tmpGrid.push([]);
            for(let y = 0; y < this.props.rows; y++){
                let info = {
                    isBomb: false,
                    neighbors: 0,
                    ref: React.createRef(),
                }
                
                tmpGrid[x].push(info);
            }
        }

        this.setBombs(tmpGrid);

        const grid = [];
        tmpGrid.forEach(function(vec){
            vec.forEach(function(el){
                grid.push(<BoardSquare 
                    isBomb={el.isBomb} 
                    neighbors={el.neighbors}
                    ref={el.ref}
                />);
            }); 
        });

        this.infoGrid = tmpGrid;

        return grid;
    }

    setBombs(tmpGrid){
        let numBombs = Math.floor((Math.random()*this.props.cols*this.props.rows*0.15)+(this.props.cols*this.props.rows*0.15)); //Random num of bombs
        
        for(let i = 0; i < numBombs; i++){
            let x = Math.floor(Math.random() * this.props.cols);
            let y = Math.floor(Math.random() * this.props.rows); 
            
            let info = tmpGrid[x][y];

            //if awayFrom is not null set the bomb more away of x+1 x-1 y+1 and y-1
            if(!info.isBomb){
                info.isBomb = true;
                
                for(let j = x-1; j <= x+1; j++){
                    for(let k = y-1; k <= y+1; k++){
                        if(this.notOutOfBonds(j,k)){
                            tmpGrid[j][k].neighbors += 1;
                        }
                    }
                }                    
            }else{
                numBombs++; // Set one more loop
            }
        }
    }

    notOutOfBonds(x,y){
        return ((x < this.props.cols && x > -1) && (y < this.props.rows && y > -1))
    }

    gridStyle(){
        return {
            gridTemplateColumns: "repeat("+this.props.cols+",20px)",
        }
    }

    render() {        
        return (
            <div className="grid-container" style={this.gridStyle()}>
                {this.createGrid()}
            </div>
        );
    }
}

class BoardSquare extends React.Component {
    
    constructor(props) {
        super(props);
        this.state={
            img: "images/facingDown.png",
            clicked : false,
            flagged: false
        };
    }

    clearSquare = () => {
        this.setState({
            img: "images/facingDown.png",
            clicked : false,
            flagged: false
        });
    }

    handleClick = (e) => {
        if(e.button == 0){
            this.setState({
                img: this.props.isBomb ? "images/bomb.png" : "images/"+this.props.neighbors+".png",
                clicked: true,
            });
        }else if(e.button == 2){
            e.preventDefault();
            this.setState({
                img: "images/flagged.png",
                flagged: true,
            });
        }
    }

    render() {
        return (
            <div 
                className = "grid-item"
                onClick = {this.handleClick}
                onContextMenu = {this.handleClick}
                style = {{cursor: this.state.clicked ? "default" : "pointer"}}
            >
                <img src= {this.state.img} alt="board item"/>
            </div>
        );
    }
}

function createBoard(){
    let domContainer = document.getElementById("root")
    ReactDOM.render(<BoardInfo />, domContainer);
}

function init(){
    createBoard();
}

window.onload = init;
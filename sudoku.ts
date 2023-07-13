import { Board, Solver } from "./solver.js"

class Sudoku {
    board : Board
    eles : Array<Array<HTMLInputElement>>
    readonly legal_values = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
    result : HTMLDivElement
    submit : HTMLButtonElement
    reset : HTMLButtonElement

    init() {
        this.board  = new Array(9)
        this.eles    = new Array(9)
        for(let i = 0; i<this.board.length; i++){
            this.board[i] = new Array(9)
            this.eles[i]   = new Array(9)
        }
    }

    constructor(){
        this.init()
    }

    onLoad(){
        let board = document.getElementById("board") as HTMLElement

        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                let div_ele = document.createElement("div")
                div_ele.classList.add('inner-grid-container')
                for(let k = 0; k < 3; k++){
                    for(let l = 0; l < 3; l++){
                        let square = document.createElement("div")
                        let square_text = document.createElement("input")
                        square_text.classList.add('input')
                        square_text.setAttribute("type", "number")
                        square.appendChild(square_text)

                        let id = i*27+j*3+k*9+l
                        square_text.setAttribute('id', 'square'+id)
                        square_text.addEventListener('input', this.onInput.bind(this, square_text, id))

                        let row = Math.floor(id/9)
                        let col = id%9
                        this.eles[row][col] = square_text
                        this.board[row][col] = 0
                        div_ele.appendChild(square)
                    }
                }
                board.append(div_ele)
            }
        }
        this.result = document.getElementById("result") as HTMLDivElement
        this.result.innerText = ""

        this.submit = document.getElementById("submit") as HTMLButtonElement
        this.submit.addEventListener('click', this.onSubmit.bind(this))

        this.reset = document.getElementById("reset") as HTMLButtonElement
        this.reset.addEventListener('click', this.onReset.bind(this))
    }

    onInput(ele : HTMLInputElement, id: number, event: InputEvent){
        let row = Math.floor(id/9)
        let col = id%9
        if(event.inputType === "insertText"){
            if(this.legal_values.includes(ele.value)){
                this.board[row][col] = parseInt(ele.value)
            } else {
                //Illegal value.  Simply hold the old cell state.
                if(this.board[row][col] === 0){
                    ele.value = ""
                } else {
                    ele.value = this.board[row][col].toString()
                }
            }
        } else {
            // Deletion case.
            ele.value = ""
            this.board[row][col] = 0
        }
    }

    setSolvable(solvable : boolean){
        if(solvable){
            this.result.classList.remove('result-fail')
            this.result.classList.add('result-pass')
            this.result.innerText = "Solvable!"
        } else {
            this.result.classList.remove('result-pass')
            this.result.classList.add('result-fail')
            this.result.innerText = "Unsolvable!"
        }
    }

    fixInputCells(){
        for(let i = 0; i<this.eles.length; i++){
            for(let j = 0; j<this.eles[i].length; j++){
                if(this.eles[i][j].value !== ""){
                    this.eles[i][j].classList.add('fixed')
                    this.eles[i][j].disabled = true
                }
            }
        }
    }

    onSubmit(event: InputEvent){
        this.fixInputCells()
        let solver = new Solver(this.board)
        let [solvable, answer] = solver.solveSudoku()

        if(solvable){
            for(let i = 0; i<answer.length; i++){
                for(let j = 0; j<answer[i].length; j++){
                    this.eles[i][j].value = answer[i][j].toString()
                }
            }
        }
        this.setSolvable(solvable)
    }

    onReset(event: InputEvent){
        this.result.innerText = ""
        for(let i = 0; i<this.eles.length; i++){
            for(let j = 0; j<this.eles[i].length; j++){
                this.eles[i][j].classList.remove('fixed')
                this.eles[i][j].disabled = false
                this.eles[i][j].value = ""
                this.board[i][j] = 0
            }
        }
    }
}

let sudoku = new Sudoku()
window.onload = sudoku.onLoad.bind(sudoku)
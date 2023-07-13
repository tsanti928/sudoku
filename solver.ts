type Rows = Array<Set<number>>
type Cols = Array<Set<number>>
type Grid = Array<Array<Set<number>>>
export type Board = Array<Array<number>>

export class Solver {
    private rows : Rows
    private cols : Cols
    private grid : Grid
    private board : Board

    constructor(board : Board) {
        this.board = board
    }

    public setBoard(board : Board) {
        this.board = board
    }

    private intraGridCoords(i : number, j : number) : [number, number] {
        return [Math.floor(i/3), Math.floor(j/3)]
    }

    private init() : boolean {
        this.rows = new Array<Set<number>>(9)
        this.cols = new Array<Set<number>>(9)
        this.grid = new Array<Array<Set<number>>>(3)

        for(let i = 0; i < 9; i++){
            this.rows[i] = new Set<number>()
            this.cols[i] = new Set<number>()
        }

        for(let i = 0; i < 3; i++){
            this.grid[i] = new Array<Set<number>>(3)
            for(let j = 0; j < 3; j++){
                this.grid[i][j] = new Set<number>()
            }
        }

        for(let i = 0; i < this.board.length; i++){
            for(let j = 0; j < this.board[i].length; j++){
                if(this.board[i][j] !== 0){
                    let [ii, ij] = this.intraGridCoords(i, j)
                    if(
                        this.rows[i].has(this.board[i][j]) ||
                        this.cols[j].has(this.board[i][j]) ||
                        this.grid[ii][ij].has(this.board[i][j])
                    )
                        return false

                    this.rows[i].add(this.board[i][j])
                    this.cols[j].add(this.board[i][j])
                    this.grid[ii][ij].add(this.board[i][j])
                }
            }
        }

        return true
    }

    private getNext(i : number, j : number) : [number, number] {
        if(j < 8)
            return [i, j+1]

        return [i+1, 0]
    }

    private backtrack(i : number, j : number) : boolean {
        if(i > 8 || j > 8)
            return false;

        // Continue to next square if this one has already been
        // assigned.
        if(this.board[i][j] !== 0){
            if(i == 8 && j == 8)
                return true;

            let [nextI, nextJ] = this.getNext(i, j);
            return this.backtrack(nextI, nextJ);
        }

        for(let k = 1; k<=9; k++){
            let [ii, ij] = this.intraGridCoords(i, j)
            if(
                this.rows[i].has(k) ||
                this.cols[j].has(k) ||
                this.grid[ii][ij].has(k)
            )
                continue

            this.board[i][j] = k
            this.rows[i].add(k)
            this.cols[j].add(k)
            this.grid[ii][ij].has(k)

            if(this.backtrack(i, j))
                return true

            this.board[i][j] = 0
            this.rows[i].delete(k)
            this.cols[j].delete(k)
            this.grid[ii][ij].delete(k)
        }

        return false;
    }

    public printBoard() {
        let b = ""
        for(let i = 0; i < this.board.length; i++){
            for(let j = 0; j < this.board[i].length; j++){
                b += this.board[i][j].toString()
            }
            b += "\n"
        }
        console.log(b)
    }

    private validate() : boolean {
        if(this.board.length != 9)
            return false

        for(let i = 0; i < this.board.length; i++)
            if(this.board[i].length != 9)
                return false

        return true
    }

    public solveSudoku() : [boolean, Board] {
        if(!this.validate()){
            console.log("Invalid board.")
            return [false, []]

        }
        if(!this.init()){
            console.log("Invalid board.")
            return [false, []]
        }

        if(!this.backtrack(0, 0)){
            console.log("Solution is not possible.")
            return [false, []]
        }

        return [true, this.board]
    }
}

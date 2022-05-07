export class Position {
    public x: number;
    public y: number;
    constructor(x: number=0, y: number=0) {
        this.x = x;
        this.y = y;
    }
}
export class Size {
    public width: number;
    public height: number;
    constructor(width: number=0, height: number=0) {
        this.width = width;
        this.height = height;
    }
}
export class Table {
    public column: number;
    public record: number;
    constructor(column: number=0, record: number=0) {
        this.column = column;
        this.record = record;
    }
}
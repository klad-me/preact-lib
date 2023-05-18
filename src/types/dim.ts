
/** Координата x/y */
export type Coord = {
	x: number;
	y: number;
};


/** Размер w/h */
export type Size = {
	w: number;
	h: number;
};


/** Прямоугольник x/y/w/h */
export type Rect = Coord & Size;


/** Линич from/to */
export type Line = {
	from: Coord;
	to: Coord;
}
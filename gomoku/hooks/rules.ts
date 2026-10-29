export type Stone = "" | "black" | "white";
export interface Game {
  board: Stone[];
  moves: string[];
  turn: "black" | "white";
  result: string | null;
}

export const SIZE = 15;
export const BOARD = 600;
export const PAD = 30;
export const CELL = (BOARD - 2 * PAD) / (SIZE - 1);
const LETTERS = "ABCDEFGHIJKLMNO";

export const fresh = (): Game => ({
  board: Array<Stone>(SIZE * SIZE).fill(""),
  moves: [],
  turn: "black",
  result: null,
});
export const name = (index: number): string => `${LETTERS[index % SIZE]}${SIZE - Math.floor(index / SIZE)}`;

export function parse(point: string): number {
  const match = /^([A-O])(\d{1,2})$/i.exec(point.trim());
  if (!match) return -1;
  const row = SIZE - Number(match[2]);
  return row >= 0 && row < SIZE ? row * SIZE + LETTERS.indexOf(match[1]!.toUpperCase()) : -1;
}

export function at(x: number, y: number): number {
  const column = Math.round((x - PAD) / CELL);
  const row = Math.round((y - PAD) / CELL);
  return column < 0 || row < 0 || column >= SIZE || row >= SIZE ? -1 : row * SIZE + column;
}

export function wins(board: readonly Stone[], index: number): boolean {
  const colour = board[index];
  const [x, y] = [index % SIZE, Math.floor(index / SIZE)];
  for (const [dx, dy] of [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
  ] as const) {
    let count = 1;
    for (const sign of [1, -1])
      for (let step = 1; step < 5; step++) {
        const [nx, ny] = [x + dx * step * sign, y + dy * step * sign];
        if (nx < 0 || ny < 0 || nx >= SIZE || ny >= SIZE || board[ny * SIZE + nx] !== colour) break;
        count += 1;
      }
    if (count >= 5) return true;
  }
  return false;
}

export function svg(game: Game): string {
  const lines: string[] = [];
  for (let i = 0; i < SIZE; i++) {
    const p = PAD + i * CELL;
    lines.push(
      `<line x1="${PAD}" y1="${p}" x2="${BOARD - PAD}" y2="${p}"/><line x1="${p}" y1="${PAD}" x2="${p}" y2="${BOARD - PAD}"/>`,
    );
  }
  const last = game.moves.length ? parse(game.moves[game.moves.length - 1]!) : -1;
  const stones = game.board.flatMap((stone, index) => {
    if (!stone) return [];
    const [cx, cy] = [PAD + (index % SIZE) * CELL, PAD + Math.floor(index / SIZE) * CELL];
    const mark = index === last ? `<circle cx="${cx}" cy="${cy}" r="4" fill="#c0392b"/>` : "";
    return [
      `<circle cx="${cx}" cy="${cy}" r="${CELL * 0.42}" fill="${stone === "black" ? "#1d1d1d" : "#f4f1ea"}" stroke="#3b2f22"/>${mark}`,
    ];
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${BOARD} ${BOARD}"><rect width="${BOARD}" height="${BOARD}" rx="12" fill="#d9b77e"/><g stroke="#5a4630">${lines.join("")}</g>${stones.join("")}</svg>`;
}

export const status = (game: Game): string =>
  game.result ?? `第 ${game.moves.length + 1} 手 · ${game.turn === "black" ? "轮到你（黑）" : "Agent 思考中（白）"}`;

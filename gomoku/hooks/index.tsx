import type { Dollar, Register } from "autoseek";
import { fresh, name, parse, status, wins, type Game } from "./rules.ts";

const load = async ($: Dollar): Promise<Game | null> => (await $.state.get<Game>("game")).value;

async function play($: Dollar, game: Game, index: number): Promise<void> {
  game.board[index] = game.turn;
  game.moves.push(name(index));
  if (wins(game.board, index))
    game.result = game.turn === "black" ? "你连成五子，你赢了" : "Agent 连成五子，Agent 赢了";
  else game.turn = game.turn === "black" ? "white" : "black";
  await $.state.set("game", game);
  const { Text } = $.ui.elements;
  if (game.result)
    await $.session.append(<Text weight="medium">{`五子棋：${game.result}（${game.moves.length} 手）`}</Text>);
}

export const register: Register = (on) => {
  on("session.start", async ($) => {
    await $.command.register({ name: "gomoku", description: "开一局五子棋" });
    await $.tool.register<{ point: string }>(
      {
        name: "move",
        description: "Place the Agent's white stone in the open gomoku game, e.g. point H8.",
        readOnly: true,
        inputSchema: { type: "object", properties: { point: { type: "string" } }, required: ["point"] },
      },
      async ({ point }, $) => {
        const game = await load($);
        if (!game || game.result) return "No game is in progress.";
        if (game.turn !== "white") return "It is not your turn.";
        const index = parse(point);
        if (index < 0 || game.board[index]) return `${point} is not a free point.`;
        await play($, game, index);
        return game.result ?? `You played ${name(index)}. Moves so far: ${game.moves.join(" ")}.`;
      },
    );
    await $.tool.register<{ point: string }>({ name: "play", pageOnly: true }, async ({ point }, $) => {
      const game = await load($);
      const index = parse(point);
      if (!game || game.result || game.turn !== "black" || index < 0 || game.board[index]) return { ok: false };
      await play($, game, index);
      if (!game.result) await $.prompt.submit(`[五子棋] 我下在 ${name(index)}。轮到你：用 mod__gomoku__move 落白子。`);
      return { ok: true, status: status(game) };
    });
    await $.tool.register({ name: "again", pageOnly: true }, async (_args, $) => {
      await $.state.set("game", fresh());
      return { ok: true };
    });
  });

  on("command.run", { command: "gomoku" }, async ($) => {
    await $.state.set("game", fresh());
    await $.ui.open({ id: "board", title: "五子棋", place: "stage" });
    return { text: "五子棋开局，你执黑先走。" };
  });

  on("ui.render", { component: "Stage", id: "board" }, async ($) => {
    const game = (await load($)) ?? fresh();
    const { Client } = $.ui.elements;
    return <Client src="ui/board.html" data={{ ...game, status: status(game) }} />;
  });
};

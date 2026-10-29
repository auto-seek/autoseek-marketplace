test("/gomoku opens the board on the stage and the Agent's tool answers a move", async (mod, assert) => {
  assert.equal(await mod.command("gomoku"), "五子棋开局，你执黑先走。");
  const board = await mod.view("board");
  assert.equal(board?.type, "Client");
  assert.equal((board?.props["data"] as { status: string }).status, "第 1 手 · 轮到你（黑）");
  assert.match(await mod.tool("move", { point: "H8" }), /not your turn/);
});

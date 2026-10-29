# 五子棋

一个 AutoSeek Mod。安装后在对话里输入 `/gomoku` 开一局：棋盘显示在对话区，点格子落黑子，Agent 用插件提供的
`move` 工具落白子；连成五子时对话里会加一行结果。

- `hooks/index.tsx`：命令、工具和舞台视图（`<Client src="ui/board.html" data={...} />`）。
- `hooks/rules.ts`：棋盘、胜负和坐标。
- `ui/board.html`：棋盘页面，走 MCP Apps 协议：`tools/call` 调 `play` 和 `again`（只给页面用的工具），
  `ui/notifications/tool-result` 收到新的棋局。
- `gomoku.test.ts`：`autoseek plugin test` 运行的测试。

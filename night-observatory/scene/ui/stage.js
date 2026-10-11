export class SceneStage {
  constructor(app) {
    this.app = app;
    this.rows = new Map();
    this.cache = new Map();
    this.page = 0;
  }
  el(id) {
    return this.app.el(id);
  }
  async asset(token) {
    if (this.cache.size >= 32) this.cache.delete(this.cache.keys().next().value);
    if (!this.cache.has(token))
      this.cache.set(
        token,
        this.app.host.teamChat.asset(token).catch((error) => {
          this.cache.delete(token);
          throw error;
        }),
      );
    return this.cache.get(token);
  }
  setMembers(members) {
    this.members = members;
    const ids = new Set(members.map((member) => member.id));
    this.app.settings.order = [...new Set([...(this.app.settings.order || []).filter((id) => ids.has(id)), ...ids])];
    this.page = Math.min(this.page, Math.max(0, Math.ceil(members.length / 6) - 1));
    this.render();
  }
  turnPage(delta) {
    this.page += delta;
    this.render();
  }
  render() {
    this.rows.clear();
    this.el("cast").replaceChildren();
    this.el("empty").hidden = !!this.members?.length;
    const ids = this.app.settings.order || [];
    for (const id of ids.slice(this.page * 6, this.page * 6 + 6)) {
      const member = this.members.find((row) => row.id === id);
      if (member) this.el("cast").append(this.character(member));
    }
    this.el("previous").disabled = this.page === 0;
    this.el("next").disabled = (this.page + 1) * 6 >= ids.length;
    this.el("page").textContent = `${this.page + 1} / ${Math.max(1, Math.ceil(ids.length / 6))}`;
    this.update();
  }
  button(label, action) {
    const button = this.app.doc.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.onclick = action;
    return button;
  }
  character(member) {
    const doc = this.app.doc,
      copy = this.app.copy,
      assets = member.character?.assets || {};
    const article = doc.createElement("article");
    article.className = "character";
    article.dataset.member = member.id;
    const bubble = doc.createElement("div");
    bubble.className = "bubble";
    const portrait = this.button("", () => this.app.toggleMention(member.id));
    portrait.className = "portrait-button";
    portrait.setAttribute("aria-label", `@${member.name}`);
    const fallback = doc.createElement("span");
    fallback.className = "initial";
    fallback.textContent = [...member.name].slice(0, 1).join("");
    portrait.append(fallback);
    const image = doc.createElement("img");
    image.alt = member.name;
    image.hidden = true;
    portrait.append(image);
    const status = doc.createElement("div");
    status.className = "asset-status";
    let imageGeneration = 0;
    const loadImage = async (token) => {
      const generation = ++imageGeneration;
      image.hidden = true;
      fallback.hidden = false;
      status.textContent = "";
      if (!token) return;
      try {
        const url = await this.asset(token);
        if (generation !== imageGeneration) return;
        image.onload = () => {
          image.hidden = false;
          fallback.hidden = true;
        };
        image.onerror = () => {
          image.hidden = true;
          fallback.hidden = false;
          status.textContent = copy.missing;
        };
        image.src = url;
      } catch {
        if (generation === imageGeneration) status.textContent = copy.missing;
      }
    };
    const name = doc.createElement("h3");
    name.append(this.button(member.name, () => this.app.toggleMention(member.id)));
    const controls = doc.createElement("div");
    controls.className = "character-controls";
    const expressions = doc.createElement("select");
    expressions.setAttribute("aria-label", `${member.name} · ${copy.expression}`);
    const expressionValues = { "": assets.portrait || assets.avatar, ...assets.expressions };
    for (const key of Object.keys(expressionValues)) expressions.add(new window.Option(key || copy.portrait, key));
    expressions.value = this.app.settings.expressions?.[member.id] || "";
    if (expressions.selectedIndex < 0) expressions.value = "";
    expressions.onchange = () => {
      this.app.settings.expressions ||= {};
      this.app.settings.expressions[member.id] = expressions.value;
      this.app.saveSettings();
      void loadImage(expressionValues[expressions.value]);
    };
    controls.append(expressions);
    for (const [delta, label] of [
      [-1, copy.left],
      [1, copy.right],
    ]) {
      const move = this.button(delta < 0 ? "←" : "→", () => this.move(member.id, delta));
      move.title = label;
      move.setAttribute("aria-label", `${member.name} · ${label}`);
      controls.append(move);
    }
    article.append(bubble, portrait, name, controls);
    const clips = Object.entries(assets.audio || {});
    if (clips.length) {
      const select = doc.createElement("select");
      select.setAttribute("aria-label", `${member.name} · ${copy.audio}`);
      select.add(new window.Option(copy.audio, ""));
      for (const [label, token] of clips) select.add(new window.Option(label, token));
      const audio = doc.createElement("audio");
      audio.controls = true;
      audio.preload = "none";
      audio.hidden = true;
      audio.onerror = () => {
        status.textContent = copy.missing;
      };
      select.onchange = async () => {
        const token = select.value;
        audio.pause();
        audio.removeAttribute("src");
        audio.hidden = true;
        if (!token) return;
        try {
          const url = await this.asset(token);
          if (select.value === token) {
            audio.src = url;
            audio.hidden = false;
            status.textContent = "";
          }
        } catch {
          status.textContent = copy.missing;
        }
      };
      controls.append(select);
      article.append(audio);
    }
    article.append(status);
    this.rows.set(member.id, { bubble, portrait });
    void loadImage(expressionValues[expressions.value]);
    return article;
  }
  move(id, delta) {
    const order = this.app.settings.order,
      from = order.indexOf(id),
      to = from + delta;
    if (to < 0 || to >= order.length) return;
    [order[from], order[to]] = [order[to], order[from]];
    this.app.saveSettings();
    this.render();
  }
  update() {
    for (const [id, row] of this.rows) {
      const message = [...this.app.messages.values()]
        .filter((item) => item.authorId === id)
        .sort((a, b) => b.seq - a.seq)[0];
      const stream = [...this.app.streams.values()].find((item) => item.entity_id === id);
      row.bubble.textContent = stream?.content_so_far || message?.content || "";
      row.portrait.setAttribute("aria-pressed", String(this.app.mentions.has(id)));
    }
  }
}

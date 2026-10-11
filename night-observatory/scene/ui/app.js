import { copyFor } from "./copy.js";
import { SceneStage } from "./stage.js";

export class TeamScene {
  constructor(doc, host) {
    this.doc = doc;
    this.host = host;
    this.messages = new Map();
    this.deliveries = new Map();
    this.deliveryRevisions = new Map();
    this.eventRevision = 0;
    this.streams = new Map();
    this.mentions = new Set();
    this.members = [];
    this.settings = {};
    this.generation = 0;
    this.unsubscribers = [];
    this.stage = new SceneStage(this);
  }
  el(id) {
    return this.doc.getElementById(id);
  }
  status(text, error = false) {
    this.el("status").textContent = text;
    this.el("status").dataset.error = String(error);
  }
  storageKey(kind, department = this.department) {
    return `team-scene:${this.context.scopeId || this.context.projectId}:${department}:${kind}`;
  }
  read(kind) {
    try {
      const value = JSON.parse(localStorage.getItem(this.storageKey(kind)) || "{}");
      return value && typeof value === "object" && !Array.isArray(value) ? value : {};
    } catch {
      return {};
    }
  }
  write(kind, value, department) {
    try {
      localStorage.setItem(this.storageKey(kind, department), JSON.stringify(value));
    } catch {
      this.status(this.copy.error, true);
    }
  }
  saveSettings() {
    this.write("settings", this.settings);
    this.settingsRevision = (this.settingsRevision || 0) + 1;
    if (this.host.teamChat.scene) {
      const departmentId = this.department,
        generation = this.generation;
      void this.host.teamChat
        .scene({
          departmentId,
          settings: {
            background: this.settings.background || "dusk",
            order: this.settings.order || [],
            expressions: this.settings.expressions || {},
          },
        })
        .catch((error) => {
          if (generation === this.generation) this.status(error.message || this.copy.error, true);
        });
    }
  }
  saveDraft() {
    this.write("draft", { content: this.el("message").value, mentions: [...this.mentions], pending: this.pending });
  }
  appearance(context) {
    this.context = { ...this.context, ...context };
    this.copy = copyFor(this.context.locale);
    this.doc.documentElement.lang = this.context.locale || "en";
    this.doc.documentElement.dataset.theme = this.context.theme || "dark";
    for (const node of this.doc.querySelectorAll("[data-copy]")) node.textContent = this.copy[node.dataset.copy];
    this.el("message").placeholder = this.copy.placeholder;
    this.el("message").setAttribute("aria-label", this.copy.placeholder);
  }
  async start() {
    this.appearance(await this.host.getContext());
    this.bind();
    if (!this.host.teamChat || !this.context.projectId) {
      this.status(this.copy.openTeam);
      this.el("send").disabled = true;
      return;
    }
    this.unsubscribers.push(
      this.host.onFrame((frame) => this.receive(frame)),
      this.host.onHostEvent((value) => {
        this.appearance(value);
        if (value.departmentId && value.departmentId !== this.department)
          void this.selectDepartment(value.departmentId);
        else if (value.teamConnection === "ready") void this.refresh();
        if (value.teamConnection === "disconnected") this.status(this.copy.error, true);
      }),
    );
    this.appearance(await this.host.getContext());
    await this.selectDepartment(this.context.departmentId || this.context.projectId);
  }
  bind() {
    this.el("composer").onsubmit = (event) => {
      event.preventDefault();
      void this.send();
    };
    this.el("message").oninput = () => this.saveDraft();
    this.el("message").onkeydown = (event) => {
      if (event.key === "Enter" && (event.ctrlKey || event.metaKey) && !event.isComposing) {
        event.preventDefault();
        void this.send();
      }
    };
    this.el("add-member").onclick = () => this.toggleMention(this.el("members").value);
    this.el("department").onchange = () => {
      void this.selectDepartment(this.el("department").value);
    };
    this.el("background").onchange = () => {
      this.settings.background = this.el("background").value;
      this.applySettings();
      this.saveSettings();
    };
    this.el("refresh").onclick = () => {
      void this.refresh();
    };
    this.el("older").onclick = () => {
      void this.refresh(Math.min(...[...this.messages.values()].map((row) => row.seq)));
    };
    this.el("previous").onclick = () => this.stage.turnPage(-1);
    this.el("next").onclick = () => this.stage.turnPage(1);
    for (const button of this.doc.querySelectorAll("[data-prompt]"))
      button.onclick = () => {
        if (this.pending) return;
        this.el("message").value = this.copy[`${button.dataset.prompt}Prompt`];
        this.saveDraft();
        this.el("message").focus();
      };
  }
  applySettings() {
    const background = ["dusk", "garden", "studio"].includes(this.settings.background)
      ? this.settings.background
      : "dusk";
    this.el("background").value = background;
    this.el("stage").dataset.background = background;
  }
  async selectDepartment(id) {
    if (this.department) this.saveDraft();
    this.department = id;
    this.generation++;
    this.members = [];
    this.messages.clear();
    this.deliveries.clear();
    this.deliveryRevisions.clear();
    this.streams.clear();
    this.settings = this.read("settings");
    this.sceneLoaded = false;
    this.settingsRevision = 0;
    if (!Array.isArray(this.settings.order)) this.settings.order = [];
    if (
      !this.settings.expressions ||
      typeof this.settings.expressions !== "object" ||
      Array.isArray(this.settings.expressions)
    )
      this.settings.expressions = {};
    const draft = this.read("draft");
    this.el("message").value = typeof draft.content === "string" ? draft.content : "";
    this.mentions = new Set(Array.isArray(draft.mentions) ? draft.mentions.filter((id) => typeof id === "string") : []);
    this.pending =
      typeof draft.pending?.id === "string" &&
      draft.pending.id.length > 0 &&
      draft.pending.id.length <= 512 &&
      draft.pending.content === draft.content &&
      Array.isArray(draft.pending.mentions) &&
      draft.pending.mentions.every((id) => typeof id === "string")
        ? draft.pending
        : null;
    this.sending = false;
    this.applySettings();
    this.renderMessages();
    this.stage.members = [];
    this.stage.render();
    this.renderMentions();
    if (this.context.teamConnection === "connecting") this.status(this.copy.loading);
    else await this.refresh();
  }
  async refresh(beforeSeq) {
    const generation = this.generation,
      departmentId = this.department;
    if (!departmentId) return;
    this.status(this.copy.loading);
    const revision = this.eventRevision;
    try {
      const result = await this.host.teamChat.request({
        operation: "history",
        departmentId,
        ...(beforeSeq ? { beforeSeq } : {}),
      });
      if (generation !== this.generation) return;
      if (!result.ok) {
        this.status(result.error || this.copy.error, true);
        return;
      }
      if (!this.sceneLoaded && this.host.teamChat.scene) {
        const revision = this.settingsRevision;
        const settings = await this.host.teamChat.scene({ departmentId });
        if (generation !== this.generation) return;
        if (revision === this.settingsRevision) {
          this.settings = settings;
          this.write("settings", settings);
          this.applySettings();
        }
        this.sceneLoaded = true;
      }
      this.members = result.members;
      this.el("members").replaceChildren(new window.Option(this.copy.nobody, ""));
      for (const member of this.members)
        this.el("members").add(new window.Option(`${member.name} · ${member.path.join(" / ")}`, member.id));
      const groups = result.departments || [
        { id: this.context.projectId, name: this.copy.root },
        ...(departmentId === this.context.projectId ? [] : [{ id: departmentId, name: departmentId }]),
      ];
      this.el("department").replaceChildren();
      for (const { id, name } of groups) this.el("department").add(new window.Option(name, id));
      this.el("department").value = departmentId;
      for (const message of result.messages) this.messages.set(message.id, message);
      for (const delivery of result.deliveries)
        if ((this.deliveryRevisions.get(delivery.id) || 0) <= revision) this.updateDelivery(delivery);
      if (this.pending && this.messages.has(this.pending.id)) this.acknowledged();
      this.el("older").hidden = result.messages.length === 0 || Math.min(...result.messages.map((row) => row.seq)) <= 1;
      this.stage.setMembers(this.members);
      this.renderMessages();
      this.renderMentions();
      this.status(this.copy.ready);
    } catch (error) {
      if (generation === this.generation) this.status(`${this.copy.error} ${error.message || ""}`, true);
    }
  }
  toggleMention(id) {
    if (!id || this.pending || !this.members.some((member) => member.id === id)) return;
    if (this.mentions.has(id)) this.mentions.delete(id);
    else this.mentions.add(id);
    this.saveDraft();
    this.renderMentions();
  }
  renderMentions() {
    this.el("mentions").replaceChildren();
    for (const id of this.mentions) {
      const name = this.members.find((row) => row.id === id)?.name || id;
      const chip = this.stage.button(`@${name} ×`, () => this.toggleMention(id));
      chip.title = this.copy.remove;
      chip.disabled = !!this.pending;
      this.el("mentions").append(chip);
    }
    this.el("message").readOnly = !!this.pending;
    this.el("send").textContent = this.pending ? this.copy.retry : this.copy.send;
    this.el("send").disabled = !!this.sending;
    this.el("add-member").disabled = !!this.pending;
    this.stage.update();
  }
  acknowledged() {
    this.pending = null;
    this.el("message").value = "";
    this.mentions.clear();
    this.saveDraft();
    this.renderMentions();
  }
  async send() {
    if (this.sending || !this.department || !this.el("message").value.trim()) return;
    const generation = this.generation,
      departmentId = this.department;
    this.pending ||= {
      id: window.crypto.randomUUID(),
      content: this.el("message").value,
      mentions: [...this.mentions],
    };
    const sent = this.pending;
    this.saveDraft();
    this.sending = true;
    this.renderMentions();
    try {
      const result = await this.host.teamChat.request({
        operation: "send",
        departmentId,
        messageId: sent.id,
        content: sent.content,
        mentions: sent.mentions,
      });
      if (generation !== this.generation) {
        this.write("draft", result.ok ? {} : { content: sent.content, mentions: sent.mentions }, departmentId);
        return;
      }
      if (!result.ok) {
        this.pending = null;
        this.saveDraft();
        this.status(result.error || this.copy.error, true);
        return;
      }
      if (result.message) this.messages.set(result.message.id, result.message);
      if (this.pending?.id === sent.id) this.acknowledged();
      this.renderMessages();
      this.status(this.copy.ready);
    } catch (error) {
      if (generation === this.generation) this.status(`${this.copy.error} ${error.message || ""}`, true);
    } finally {
      if (generation === this.generation) {
        this.sending = false;
        this.renderMentions();
      }
    }
  }
  updateDelivery(delivery) {
    this.deliveries.set(delivery.id, delivery);
    if (delivery.state === "completed" || delivery.state === "failed") this.streams.delete(delivery.turnId);
  }
  receive(frame) {
    if (frame.kind === "gap") {
      void this.refresh();
      return;
    }
    if (frame.kind !== "department_chat" || frame.payload.department_id !== this.department) return;
    const event = frame.payload;
    if (event.kind === "assistant_delta") {
      this.streams.set(event.turn_id, event);
      this.renderStreams();
      this.stage.update();
      return;
    }
    if (event.message) {
      this.messages.set(event.message.id, event.message);
      if (event.message.id === this.pending?.id) this.acknowledged();
    }
    if (event.delivery) {
      this.deliveryRevisions.set(event.delivery.id, ++this.eventRevision);
      this.updateDelivery(event.delivery);
    }
    this.renderMessages();
  }
  renderMessages() {
    const list = this.el("messages"),
      nearBottom = list.scrollHeight - list.scrollTop - list.clientHeight < 100;
    list.replaceChildren();
    for (const message of [...this.messages.values()].sort((a, b) => a.seq - b.seq)) {
      const row = this.doc.createElement("article");
      row.className = "message";
      row.dataset.message = message.id;
      const header = this.doc.createElement("header"),
        name = this.doc.createElement("span"),
        time = this.doc.createElement("time");
      name.textContent = message.authorId === "user" ? this.copy.you : message.authorName;
      time.textContent = new Date(message.createdAt).toLocaleTimeString(this.context.locale, {
        hour: "2-digit",
        minute: "2-digit",
      });
      header.append(name, time);
      const text = this.doc.createElement("p");
      text.textContent = message.content;
      row.append(header, text);
      for (const delivery of this.deliveries.values())
        if (delivery.throughSeq === message.seq) {
          const member = this.members.find((item) => item.id === delivery.memberId)?.name || delivery.memberId;
          const status = this.stage.button(`${member} · ${this.copy[delivery.state]}`, () => {
            void this.retry(delivery.id);
          });
          status.className = "delivery";
          status.disabled = delivery.state !== "failed";
          status.title = delivery.error || "";
          row.append(status);
        }
      list.append(row);
    }
    this.renderStreams();
    if (nearBottom) list.scrollTop = list.scrollHeight;
    this.stage.update();
  }
  renderStreams() {
    const list = this.el("messages"),
      nearBottom = list.scrollHeight - list.scrollTop - list.clientHeight < 100;
    const rows = new Map([...list.querySelectorAll(".stream")].map((row) => [row.dataset.turn, row]));
    for (const [id, row] of rows) if (!this.streams.has(id)) row.remove();
    for (const [id, stream] of this.streams) {
      let row = rows.get(id);
      if (!row) {
        row = this.doc.createElement("article");
        row.className = "message stream";
        row.dataset.turn = id;
        row.append(this.doc.createElement("header"), this.doc.createElement("p"));
        list.append(row);
      }
      row.querySelector("header").textContent =
        this.members.find((item) => item.id === stream.entity_id)?.name || stream.entity_id;
      row.querySelector("p").textContent = stream.content_so_far;
    }
    if (nearBottom) list.scrollTop = list.scrollHeight;
  }
  async retry(deliveryId) {
    const generation = this.generation;
    try {
      const result = await this.host.teamChat.request({
        operation: "retry",
        departmentId: this.department,
        deliveryId,
      });
      if (generation !== this.generation) return;
      if (!result.ok) this.status(result.error, true);
      else await this.refresh();
    } catch {
      if (generation === this.generation) this.status(this.copy.error, true);
    }
  }
  destroy() {
    this.generation++;
    for (const unsubscribe of this.unsubscribers) unsubscribe();
  }
}
window.addEventListener(
  "DOMContentLoaded",
  () => {
    if (window.autoseek) void new TeamScene(document, window.autoseek).start();
  },
  { once: true },
);

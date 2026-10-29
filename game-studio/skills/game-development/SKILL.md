---
name: game-development
description: Develop and verify playable games with the Game Development Team. Covers Godot, Unity or Unreal projects, focused member collaboration, AutoSeek media generation and asset integration, actual playtesting and runnable delivery. Use for game work; a small question does not require a production workflow.
---

# Game development

## Start from the project

Inspect the relevant files and current Git state. Preserve existing work and the
chosen engine: `project.godot`, Unity `ProjectSettings/ProjectVersion.txt` and
`Packages/manifest.json`, or an Unreal `.uproject` identify the project/version.
For a new project infer scope, platform and controls from the request. If no engine
is specified, propose Godot for a small 2D prototype; do not migrate an existing
project or decide a major product constraint silently. Ask only for missing choices
that materially block work, while completing independent authorized work.

Use the installed `godot-engine`, `unity-engine` or `unreal-engine` skill for the
selected engine. Check the editor's actual version, canonical project path and
live MCP tool schemas before mutations. Plugin installation alone does not start
or verify an editor. If MCP is unavailable, use a supported engine CLI/file workflow
when appropriate and report that boundary. Do not fabricate tool names or install
all three engines. Serialize editor writes and avoid file/editor writes to the same
scene concurrently. Preserve Godot UIDs, Unity `.meta`/GUIDs and Unreal `.uasset`/
`.umap` files; change binary engine assets through supported editor operations.

## Build a playable loop

1. Write a short brief: player goal, controls, challenge, outcome, platform and
   acceptance cases. Reuse project documentation; avoid an unnecessary large GDD.
2. Implement the smallest playable start, challenge and resolution. Make failure
   and restart usable. Validate the risky mechanic before producing bulk content.
3. Integrate a representative visual and audio set, then expand content only within
   the requested scope. A representative playable slice is evidence for that slice,
   not proof of a full game or all supported platforms.
4. Run the actual game and the relevant engine checks; fix observed failures.
   Deliver the requested source/build and reproducible launch instructions.

The producer owns scope and integration. Designer owns rules; engineer owns code
and scene integration; artist owns visual assets; audio owns sound; QA independently
checks the playable result. Delegate bounded tasks with input paths, owned output
paths and acceptance criteria. Use existing team members and explicit task
completion; do not mandate every role for a small fix or create recursive teams.

## Generate and integrate assets

Before generation define each asset's purpose, size/duration, style/reference,
transparency/loop requirements, engine format and destination. Reuse authorized
project/account assets first. Do not infer a usable sprite atlas, alpha channel,
seamless tile, loop, sound effect, 3D mesh or rig from a provider's general label.

Use the current schemas for `generate_autoseek_image`, `edit_autoseek_image`,
`get_autoseek_image`, `generate_autoseek_video`, `get_autoseek_video`,
`generate_music` and `get_music`. Discover actual account access, supported inputs,
output constraints and prices through the tools. A resolution in a schema is not
proof that its server price or model is enabled. Do not hardcode old trial prices,
provider models, download lifetimes or the old silent five-second video limit.
Preserve native video sound when present and avoid duplicate sound layers.

Follow the tool's quote and authorization flow and any user budget. A quote,
submission receipt or queued job is not generated output. If submission fails or
its outcome is unknown, recover the original task/request key; never automatically
resubmit, switch providers or purchase a replacement. Record a denied/unavailable
capability accurately and continue independent work. Temporary prototype assets
must be clearly labeled and must not be presented as completed generated content.

Use `list_autoseek_media_assets` and `get_autoseek_media_asset` to recover owned
cloud assets without credentials or generation. Preserve returned asset IDs.
Export images with `export_image({blob, path})` and audio/video with
`export_media({blob, path})`, using a workspace-relative .mp3/.mp4 path matching
the original MIME. Both preserve original bytes and use the authorized worktree
when one is active; neither generates or converts media. Do not fetch private caches or credentials with shell commands to bypass a
missing export tool or denial. Report a missing export path as an integration gap.
Make engine-ready derivatives separately with available local tools. Inspect
actual MIME, dimensions/duration and SHA-256; changing an extension is not conversion.
Check the selected engine/version's codec and importer support before conversion.

Keep a small asset manifest in the project's established format. If none exists,
use `docs/game-assets.json` with entries containing:

- `id`, purpose, source/license/attribution and original path/SHA-256;
- cloud asset ID, generation task/request key and quote/billing receipt when present;
- derivative path, transformation and import settings;
- scene/event use and validation evidence, with unperformed checks explicit.

Do not store tokens, signed URLs or credentials. Missing provenance or unclear
rights must stay visible; generated content is not automatically licensed for every
use. Keep originals and references when regenerating or changing imports.

## Acceptance and delivery

Run relevant compile/import checks and launch the game. Exercise controls, a full
success/failure/restart cycle, saved state when applicable, intended resolution,
asset appearance and audio playback. Record concrete steps and observed results
with screenshots/logs or captures. Headless success does not establish visual or
audio quality; a screenshot does not establish input behavior. Listen when sound
quality matters, and report listening unavailable if it was not performed.

For Godot check imported resources, scene references and errors during play; for
Unity use applicable EditMode/PlayMode checks and the target build; for Unreal use
PIE plus the applicable packaged-build checks. Engine adapters being present does
not establish Unity or Unreal editor acceptance. Do not certify fun, performance
on other hardware, store readiness or a release build without matching evidence.

Hand over launch/build commands, controls, delivered paths, asset manifest, actual
verification and unresolved limitations. Distinguish code complete, local engine
verification, packaged delivery and target-platform acceptance. Continue authorized
work until the requested outcome is met; do not stop at a plan or an asset gallery.

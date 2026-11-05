---
name: game-development
description: Develop, replicate and verify playable games and visual scenes with the Game Development Team. Covers Godot, Unity or Unreal projects, quantitative reference scene replication and technical art, focused member collaboration, AutoSeek media generation and asset integration, actual playtesting and runnable delivery. Use for game and technical-art work; a small question does not require a production workflow.
---

# Game development

## Start from the project

Inspect the relevant files and current Git state. Preserve existing work and the
chosen engine: `project.godot`, Unity `ProjectSettings/ProjectVersion.txt` and
`Packages/manifest.json`, or an Unreal `.uproject` identify the project/version.
For a new project infer scope, platform and controls from the request. If no engine
is specified, propose Godot when text-based scenes (`.tscn`), shaders (`.gdshader`),
and headless/CLI screenshot capture speed up iteration; do not migrate an existing
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

The producer coordinates scope and integration; members build. Designer owns rules;
engineer owns code, CLI capture harnesses and scene integration; artist owns
technical art, shaders, look-dev and visual assets; audio owns sound; QA checks the
playable and visual result and did not build what it checks. For a new game, a new
playable build or a change across rules, code, art and sound, split the work by role
and run independent assignments in parallel; the producer works directly only on
questions, small fixes to an existing build and integration no member owns. Delegate
bounded tasks with the user's references, input paths, owned output paths,
acceptance criteria and budget, and finish them with explicit task completion. A
build is delivered only after QA reports a pass with evidence. Do not involve every
role for a small fix or create recursive teams.

## Replicate a reference scene and technical art

When asked to replicate a reference frame, build a stylized look, or match a target
visual scene, do not rely on uncalibrated visual guessing or single-pass coding:

1. **Set up an automated CLI render-and-capture loop first**:
   Prefer text-addressable scenes, scripts and shaders paired with command-line frame
   capture at the reference's exact aspect ratio and resolution (with fixed random
   seeds and deterministic camera transforms) so every change can be rendered and
   inspected automatically without manual editor interaction.
2. **Decompose and measure the reference before writing scene or shader code**:
   - **Crop and zoom**: Trim black bars or borders, then slice zoomed regional crops
     (sky/background, ground/foliage, shadow boundaries, key props, contact zones)
     to inspect stroke structure, edge treatment and local lighting before modeling.
   - **Measure with scripts instead of eyeballing**: Run small pixel/geometry scripts
     on the reference image to extract quantitative parameters:
     - _Camera & layout_: Fit repeating landmarks (such as fence posts along an arc
       or architectural lines) from pixel coordinates to solve camera pitch, FOV and
       height, then back-project ground positions from the reference into world space.
     - _Lighting & shadow ratio_: Solve sun/light azimuth and elevation from cast
       shadow direction and length; sample pixel luminance across shadow boundaries
       to measure the exact shadow-to-lit ratio (for example, `0.45x`).
     - _Palette & channel dominance_: Compute regional RGB/HSV distributions and
       channel variance (such as foliage hue shifts driven primarily by the red
       channel, or warm/cool ground zones) and back-project color masks onto terrain.
3. **Align strictly layer by layer**:
   Do not tune downstream details while upstream layers are wrong. Lock in order:
   `Camera & ground layout -> Primary lighting -> Dominant surface/foliage (palette, geometry, wind) -> Shadow stylization -> Props & localized features -> Post-processing`.
4. **Iterate with side-by-side, zoomed-crop and color-stat comparisons**:
   In every pass, render at matching resolution, compare full side-by-side frames,
   zoomed regional crops and channel statistics, and fix the largest gap first. The
   cases below come from a foliage-heavy painterly scene; adapt them to the reference:
   - _Foliage reads as noisy carpet_: Match base grass/foliage closely to the ground
     color and let only a sparse subset of longer, brighter instances form strokes.
   - _Shadows look blurry or broken up by grass tips_: Sample shadow attenuation at
     each instance's root position (`root-sampled shadow`) so the whole blade or tuft
     darkens coherently as a single stroke.
   - _Feature bands appear everywhere_: Restrict tall grass clusters, moss or rim
     accents with spatial arc/region masks or shadow-cast zones.
   - _Warm/cool patches sit in the wrong places_: Back-project reference warm/cool
     regions onto the ground plane as placeable dry/wet or sunlit/shaded masks.
   - _Frame looks overly "CG" or filter erases thin lines_: Apply a painterly or oil
     post-process filter paired with high-contrast edge preservation so thin lines
     (such as straps, wires or silhouettes) stay sharp.
5. **Verify dynamic motion, physics stability and determinism**:
   - Record video or multi-frame sequences and compute frame-to-frame pixel diffs to
     confirm wind sway, character footsteps and interactive elements actually move.
   - Exercise gameplay collisions (such as doors sweeping past the player or NPC
     avoidance) to verify physics interactions do not nudge the camera rig.
   - Confirm the scene loads in the editor/CLI with zero errors and reproduces
     identically under fixed parameters.

## Generate and integrate assets

When the user supplies a sketch or reference image, base the assets on it and pass
it as a generation reference within the budget; fall back to procedural drawing only
when generation is unavailable or over budget, and say which. Before generation
define each asset's purpose, size/duration, style/reference, transparency/loop
requirements, engine format and destination. Reuse authorized project/account
assets first. Do not infer a usable sprite atlas, alpha channel,
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
when one is active; neither generates or converts media. Do not fetch private caches
or credentials with shell commands to bypass a missing export tool or denial. Report
a missing export path as an integration gap.
Make engine-ready derivatives separately with available local tools. Inspect actual
MIME and dimensions/duration; changing an extension is not conversion. Check the
selected engine/version's codec and importer support before conversion.

Keep original files, cloud asset IDs, task/request keys, derivative paths and
license/attribution notes in the project's existing documentation or asset layout.
Do not store tokens, signed URLs or credentials. Missing provenance or unclear
rights must stay visible; generated content is not automatically licensed for every
use. Keep originals and references when regenerating or changing imports.

## Let the user play

To hand a build to the user, start it with `bash` and `run_in_background: true`, using
a command that stays attached until the game window closes: run the engine or exported
binary directly (for example `godot --path .`), or use `open -W` on macOS; a plain
`open` returns at once. Tell the user the game is running and end the turn. When the
window closes, its exit status and the tail of its output arrive as a background result
and start your next turn: read the log for errors, ask how it went and continue. Do not
wait in a loop or poll `background_output` while the user plays.
When the game should report events during play, such as a crash, a level change or a
test log line, start a `monitor` on that output instead; each event wakes you.

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

Hand over launch/build commands, controls, delivered paths, asset provenance, actual
verification and unresolved limitations. Distinguish code complete, local engine
verification, packaged delivery and target-platform acceptance. Continue authorized
work until the requested outcome is met; do not stop at a plan or an asset gallery.

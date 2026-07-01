import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const iconDir = join(root, "node_modules", "@fluentui", "svg-icons", "icons");

const icons = {
  activity: "alert_20_regular.svg",
  chat: "chat_20_regular.svg",
  teamsRail: { fileName: "people_team_24_color.svg", preserveColor: true },
  teams: "people_team_20_regular.svg",
  calendar: "calendar_ltr_20_regular.svg",
  calls: "call_20_regular.svg",
  files: "document_20_regular.svg",
  apps: "apps_20_regular.svg",
  addApps: "add_square_multiple_20_regular.svg",
  search: "search_20_regular.svg",
  filter: "filter_20_regular.svg",
  settings: "settings_20_regular.svg",
  people: "people_20_regular.svg",
  popout: "open_20_regular.svg",
  panel: "panel_right_20_regular.svg",
  close: "dismiss_20_regular.svg",
  more: "more_horizontal_20_regular.svg",
  link: "link_20_regular.svg",
  format: "text_font_20_regular.svg",
  component: "app_folder_20_regular.svg",
  attach: "attach_20_regular.svg",
  important: "important_20_regular.svg",
  emoji: "emoji_20_regular.svg",
  gif: "gif_20_regular.svg",
  sticker: "sticker_20_regular.svg",
  send: "send_20_regular.svg",
  chevronLeft: "arrow_left_20_regular.svg",
  chevronRight: "arrow_right_20_regular.svg",
  chevronDown: "chevron_down_20_regular.svg",
  square: "square_20_regular.svg",
  minimize: "subtract_20_regular.svg",
  newChat: "compose_20_regular.svg",
  copilot: "sparkle_20_regular.svg",
  compass: "compass_northwest_20_regular.svg",
  draft: "drafts_20_regular.svg",
  plusBox: "add_square_20_regular.svg",
  channel: "people_team_20_regular.svg",
  checkmarkCircle: "checkmark_circle_20_filled.svg",
  bold: "text_bold_20_regular.svg",
  italic: "text_italic_20_regular.svg",
  strikethrough: "text_strikethrough_20_regular.svg",
  numberList: "text_number_list_ltr_20_regular.svg",
  bulletList: "text_bullet_list_ltr_20_regular.svg",
  code: "code_20_regular.svg"
};

const entries = [];

for (const [name, fileName] of Object.entries(icons)) {
  const config = typeof fileName === "string" ? { fileName, preserveColor: false } : fileName;
  const source = await readFile(join(iconDir, config.fileName), "utf8");
  const svg = (config.preserveColor
    ? source.replace("<svg ", '<svg aria-hidden="true" ')
    : source.replace("<svg ", '<svg fill="currentColor" aria-hidden="true" '))
      .replace(/\s+xmlns="[^"]+"/, "")
      .trim();
  entries.push(`  ${JSON.stringify(name)}: ${JSON.stringify(svg)}`);
}

const output = `// Generated from @fluentui/svg-icons. Run npm run build-icons to refresh.
export const fluentIcons = {
${entries.join(",\n")}
};
`;

await writeFile(join(root, "icons.generated.js"), output);

import { fluentIcons } from "./icons.generated.js?v=filled-ms-source-icons";

const stackIconSrc = "./assets/stack-internal-icon.svg?v=teams-icon-mask";
const stackIcon = `<img src="${stackIconSrc}" alt="" />`;

const avatars = {
  giamir: { initials: "GB", background: "#c5e0ff", color: "#1f3a5f" },
  alex: { initials: "AC", background: "#d8d6ff", color: "#3b3486" },
  rina: { initials: "RP", background: "#d1f4e0", color: "#0f5132" },
  marco: { initials: "ML", background: "#ffdfbf", color: "#6f3a00" },
  stack: stackIconSrc
};

const sources = {
  yak: [
    { type: "docs", title: "Team Next: Check-in meeting", meta: "Giamir Buoncristiani · May 6, 2026" },
    { type: "teams", title: "Cloud Infra sync thread", meta: "Microsoft Teams · Today at 10:47 AM" }
  ],
  mesh: [
    { type: "docs", title: "Service mesh timeout remediation notes", meta: "Google Docs · Jun. 2, 2026" },
    { type: "teams", title: "Retry approach discussion in Infra", meta: "Microsoft Teams · Today at 10:21 AM" },
    { type: "docs", title: "Timeout budget standards", meta: "Google Docs · May 28, 2026" },
    { type: "teams", title: "Connection pool incident note", meta: "Microsoft Teams · Today at 12:02 PM" },
    { type: "docs", title: "Circuit breaker configuration guide", meta: "Google Docs · May 17, 2026" },
    { type: "teams", title: "Runbook entry follow-up", meta: "Microsoft Teams · Today at 12:08 PM" }
  ],
  alert: [
    { type: "docs", title: "Cloud Infra alert pipeline migration plan", meta: "Google Docs · Jun. 1, 2026" },
    { type: "teams", title: "Alert migration review request", meta: "Microsoft Teams · Today at 10:24 AM" },
    { type: "docs", title: "PagerDuty routing export checklist", meta: "Google Docs · May 29, 2026" },
    { type: "docs", title: "Alert shadow mode validation template", meta: "Google Docs · May 30, 2026" },
    { type: "teams", title: "Rollback plan question", meta: "Microsoft Teams · Today at 3:35 PM" }
  ]
};

const projectYakQuestion = "Based on the shared Project Yak chat history, can you confirm whether engineering has begun, whether the alpha environment is already stood up, and whether the team is still on track for the May 7 discovery deadline?";
const projectYakResponse = "It appears so. The most recent check-in note mentions that the alpha environment is stood up, the team has completed two internal demos, and they're on track for the May 7 discovery deadline. Since I can't cross-reference this with other docs yet, you might want to confirm with the team directly.";

const smeMessages = [
  {
    id: "intro",
    text: "Hey Giamir — you've been selected as a Subject Matter Expert for a few areas where your experience can help the company keep its internal knowledge accurate.",
    card: {
      title: "Subject Matter Experts and Topics",
      body: "You may receive questions in these areas. Your answers help Stack Internal build better, human-validated knowledge that the company can trust.",
      sources: [],
      noAnswer: true
    }
  },
  {
    id: "structure",
    text: "Hey Giamir — @Alex Chen has a question I think you can answer. Can you help?",
    asker: "Alex Chen",
    card: {
      title: "What is the latest team structure for the Cloud Infra department?",
      body: "Based on only one source from a while back, Cloud Infra is organized into a flat structure consisting of 15 generalist engineers. It would be good to double check.",
      autoForwardTo: "Priya Kapoor",
      sources: [{ type: "docs", title: "Cloud Infra org structure overview", meta: "Alex Chen · Dec. 5, 2025" }]
    }
  },
  {
    id: "capacity",
    text: "Hey Giamir — @Rina Patel has a question, but I couldn't find an answer. Can you help?",
    asker: "Rina Patel",
    card: {
      title: "Where is the Cloud Infra weekly capacity plan documented?",
      body: "I could not find anything related to your question.",
      answerUnavailable: true,
      autoForwardTo: "Drew Reese",
      sources: [{ type: "teams", title: "Capacity plan request", meta: "Microsoft Teams · Today at 10:17 AM" }]
    }
  },
  {
    id: "mesh",
    text: "From @Alex Chen: I am trying to figure out how to resolve this issue, but I cannot figure out if this is the right approach. Can you please review it and confirm?",
    asker: "Alex Chen",
    card: {
      title: "Should we resolve the service mesh timeout issue by increasing retries?",
      body: "Increasing retries can help with short transient failures, but it should not be the only fix. The safer approach is to validate timeout budgets, add circuit breaker limits, and only raise retries after confirming the upstream service can absorb the extra load.",
      autoForwardTo: "Maya Ortiz",
      sources: sources.mesh
    }
  },
  {
    id: "alert",
    text: "From @Marco Lin: I need a review on this rollout plan before I share it with the incident response group. Does this look like the right sequence?",
    asker: "Marco Lin",
    card: {
      title: "What is the recommended plan for migrating the Cloud Infra alert pipeline without missing critical pages?",
      body: "Use a staged migration: freeze alert rule edits, export current PagerDuty routing rules, run the new pipeline in shadow mode, compare parity for two business days, and cut over during a staffed support window.",
      autoForwardTo: "Brandon Rogers",
      sources: sources.alert
    }
  },
  {
    id: "yak",
    text: "From @Alex Chen: Hey Giamir — can you help verify this response?",
    asker: "Alex Chen",
    card: {
      titleLabel: "Question:",
      title: projectYakQuestion,
      bodyLabel: "Response:",
      body: projectYakResponse,
      autoForwardTo: "Alex Chen",
      sources: sources.yak
    }
  }
];

const channels = [
  { id: "general", name: "General" },
  { id: "infra", name: "Infra" },
  { id: "engineering", name: "Engineering" },
  { id: "platform", name: "Platform" }
];

const state = {
  persona: "sme",
  area: "chat",
  activeChat: "stack",
  appTab: "messages",
  activeChannel: "general",
  openSources: new Set(),
  forwardMenu: null,
  modalMessageId: null,
  threadMessage: null,
  directAnswers: {},
  directCorrect: new Set(),
  forwarded: {},
  channelPosts: {
    general: [
      { id: "g1", author: "Priya Kapoor", avatar: avatars.rina, text: "Morning! The API review notes are in the shared folder. I’ll post the updated owners after standup.", replies: [] },
      { id: "g2", author: "Tom Okafor", avatar: avatars.alex, text: "Can someone sanity-check the service mesh dashboard before the incident review?", replies: [] }
    ],
    infra: [],
    engineering: [],
    platform: []
  },
  activity: [],
  activitySeen: false
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function withMentions(value) {
  return escapeHtml(value).replace(/@([A-Za-z]+(?:\s[A-Za-z]+)?)/g, '<span class="mention">@$1</span>');
}

function avatarElement(avatar, className = "avatar", label = "") {
  if (typeof avatar === "string") {
    return `<img class="${className}" src="${avatar}" alt="${escapeHtml(label)}" />`;
  }

  return `<span class="${className} avatar--initials" style="--avatar-bg: ${avatar.background}; --avatar-fg: ${avatar.color};" aria-label="${escapeHtml(label)}">${escapeHtml(avatar.initials)}</span>`;
}

function currentMessages() {
  if (state.persona === "sme") return smeMessages;
  const base = [
    {
      id: "asker-mesh",
      text: "By you: I am trying to figure out how to resolve this issue, but I cannot figure out if this is the right approach. Can you please review it and confirm?",
      card: {
        title: "Should we resolve the service mesh timeout issue by increasing retries?",
        body: "Increasing retries can help with short transient failures, but it should not be the only fix. The safer approach is to validate timeout budgets, add circuit breaker limits, and only raise retries after confirming the upstream service can absorb the extra load.",
        sources: sources.mesh,
        status: "Answered by Giamir",
        answer: "No, we should not just increase retries as a standalone fix. Validate timeout budgets first, add circuit breakers, then adjust retries with exponential backoff and jitter."
      }
    },
    {
      id: "asker-alert",
      text: "By you: I need a review on this rollout plan before I share it with the incident response group. Does this look like the right sequence?",
      card: {
        title: "What is the recommended plan for migrating the Cloud Infra alert pipeline without missing critical pages?",
        body: "Use a staged migration: freeze alert rule edits before the window, export the current PagerDuty routing rules and service ownership map, run the new pipeline in shadow mode, compare events for at least two business days, and only cut over after confirming parity with the incident response leads.",
        sources: sources.alert,
        status: "Giamir marked this answer as correct",
        check: true
      }
    }
  ];

  if (state.directAnswers.yak) {
    base.push({
      id: "asker-yak-direct",
      text: `By you: ${projectYakQuestion}`,
      card: {
        titleLabel: "Question:",
        title: projectYakQuestion,
        bodyLabel: "Response:",
        body: projectYakResponse,
        sources: sources.yak,
        status: "Answered by Giamir",
        answer: state.directAnswers.yak
      }
    });
  } else if (state.directCorrect.has("yak")) {
    base.push({
      id: "asker-yak-correct",
      text: `By you: ${projectYakQuestion}`,
      card: {
        titleLabel: "Question:",
        title: projectYakQuestion,
        bodyLabel: "Response:",
        body: projectYakResponse,
        sources: sources.yak,
        status: "Giamir marked this answer as correct",
        check: true
      }
    });
  }

  return base;
}

function render() {
  document.getElementById("app").innerHTML = `
    <div class="teams-app ${state.threadMessage ? "has-thread" : ""}">
      ${renderRail()}
      ${renderAppChrome()}
      ${renderSidebar()}
      <main class="main">
        ${renderHeader()}
        ${renderMainContent()}
      </main>
      ${state.threadMessage ? renderThreadPanel() : ""}
    </div>
    ${state.modalMessageId ? renderAnswerModal() : ""}
  `;
}

function renderAppChrome() {
  return `
    <header class="app-chrome">
      <div class="chrome-nav">
        <button class="chrome-icon" aria-label="Back">${chevronLeftIcon()}</button>
        <button class="chrome-icon" aria-label="Forward">${chevronRightIcon()}</button>
      </div>
      <label class="search-box">
        ${searchIcon()}
        <input type="search" placeholder="Search" aria-label="Search" />
      </label>
      <div class="chrome-actions">
        <button class="chrome-icon" aria-label="More">${moreIcon()}</button>
        <div class="profile-avatar">
          ${avatarElement(avatars.giamir, "profile-avatar-initials", "Giamir Buoncristiani")}
          <span class="profile-status"></span>
        </div>
        <button class="chrome-icon" aria-label="Minimize">${minimizeIcon()}</button>
        <button class="chrome-icon" aria-label="Maximize">${squareIcon()}</button>
        <button class="chrome-icon" aria-label="Close">${closeIcon()}</button>
      </div>
    </header>
  `;
}

function renderRail() {
  const activityBadge = state.persona === "asker" && !state.activitySeen ? state.activity.length : 0;
  return `
    <nav class="app-rail" aria-label="Microsoft Teams rail">
      <div class="teams-logo">${teamsLogoIcon()}</div>
      ${railButton("activity", "Activity", activityBadge, activityIcon())}
      ${railButton("chat", "Chat", 0, chatIcon())}
      ${railButton("calendar", "Calendar", 0, calendarIcon(), true)}
      ${railButton("calls", "Calls", 0, callsIcon(), true)}
      ${railButton("files", "Files", 0, filesIcon(), true)}
      ${railButton("more", "More", 0, moreIcon(), true)}
      ${railButton("apps", "Apps", 0, addAppsIcon(), true)}
    </nav>
  `;
}

function railButton(area, label, badge, icon, disabled = false) {
  const isCurrent = area === "chat" ? state.area === "chat" || state.area === "teams" : state.area === area;
  return `
    <button class="rail-item" aria-current="${isCurrent}" ${disabled ? 'data-action="noop"' : 'data-action="select-area"'} data-area="${area}">
      ${badge ? `<span class="badge">${badge}</span>` : ""}
      <span class="rail-icon">${icon}</span>
      <span class="rail-label">${label}</span>
    </button>
  `;
}

function stackUnread() {
  return state.directAnswers.yak || state.directCorrect.has("yak") ? 1 : 0;
}

function renderSidebar() {
  if (state.area === "chat" || state.area === "teams") return renderChatSidebar();
  return renderTeamsSidebar();
}

function renderChatSidebar() {
  return `
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-title-row">
          <div class="org-name">Chat</div>
          <div class="sidebar-actions">
            <button class="sidebar-tool" aria-label="More">${moreIcon()}</button>
            <button class="sidebar-tool" aria-label="Search">${searchIcon()}</button>
            <button class="sidebar-tool" aria-label="New chat">${newChatIcon()}</button>
            <button class="sidebar-tool" aria-label="More options">${chevronDownIcon()}</button>
          </div>
        </div>
        <div class="chat-filters" role="group" aria-label="Chat filters">
          <button data-action="noop">Unread</button>
          <button data-action="noop">Channels</button>
          <button data-action="noop">Chats</button>
          <button class="chat-filter-caret" data-action="noop" aria-label="More filters">${chevronDownIcon()}</button>
        </div>
        <div class="perspective-toggle" role="group" aria-label="Perspective">
          <button class="${state.persona === "sme" ? "is-active" : ""}" data-action="persona" data-persona="sme">SME</button>
          <button class="${state.persona === "asker" ? "is-active" : ""}" data-action="persona" data-persona="asker">Asker</button>
        </div>
      </div>
      <div class="chat-sidebar-scroll">
        <div class="chat-list-item muted" data-action="noop">
          <span class="chat-list-icon">${copilotIcon()}</span>
          <span>Copilot</span>
        </div>
        <div class="chat-section">
          <div class="chat-section-title"><span class="section-caret">${chevronDownIcon()}</span> Quick views</div>
          <button class="chat-list-item" data-action="noop">
            <span class="chat-list-icon">${compassIcon()}</span>
            <span>Discover</span>
          </button>
          <button class="chat-list-item" data-action="noop">
            <span class="chat-list-icon">${draftIcon()}</span>
            <span>Drafts</span>
          </button>
        </div>
        <div class="chat-divider"></div>
        <div class="chat-section">
          <div class="chat-section-title"><span class="section-caret">${chevronDownIcon()}</span> Favorites</div>
          <button class="chat-list-item" data-action="noop">
            <span class="initial-avatar initial-avatar--jose">JS<span></span></span>
            <span>Jose Santiago (You)</span>
          </button>
        </div>
        <div class="chat-section">
          <div class="chat-section-title"><span class="section-caret">${chevronDownIcon()}</span> Chats</div>
          ${chatButton("stack", "Stack Internal", `<span class="app-icon">${stackIcon}</span>`, state.persona === "sme" ? 5 : stackUnread())}
          <button class="chat-list-item" data-action="noop">
            <span class="chat-list-icon">${componentIcon()}</span>
            <span>Jira Cloud</span>
          </button>
        </div>
        <div class="chat-section">
          <div class="chat-section-title"><span class="section-caret">${chevronDownIcon()}</span> Teams and channels</div>
          ${channels.map((channel) => navButton(`channel:${channel.id}`, channel.name, '<span class="channel-indent"></span>', 0)).join("")}
          <button class="see-all chat-link" data-action="noop">See all channels</button>
          <button class="see-all chat-link" data-action="noop">See all your teams</button>
        </div>
      </div>
    </aside>
  `;
}

function renderTeamsSidebar() {
  return `
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-title-row">
          <div class="org-name">Teams</div>
          <button class="sidebar-tool" aria-label="Filter">${filterIcon()}</button>
        </div>
      </div>
      <div class="sidebar-section">
        <div class="section-label"><span class="section-caret">${chevronDownIcon()}</span> Pinned</div>
        ${navButton("channel:general", "General", '<span class="team-icon team-icon--orange">T</span>', 0, "Cloud Infra")}
      </div>
      <div class="sidebar-section">
        <div class="section-label"><span class="section-caret">${chevronDownIcon()}</span> Your teams</div>
        <div class="team-heading"><span class="team-icon team-icon--orange">T</span><strong>Cloud Infra</strong></div>
        ${channels.map((channel) => navButton(`channel:${channel.id}`, channel.name, '<span class="channel-indent"></span>', 0)).join("")}
        <button class="see-all" data-action="noop">See all channels</button>
        <div class="team-heading team-heading--muted"><span class="team-icon team-icon--blue">✣</span><span>Engineering</span></div>
        <div class="muted-channel">Platform</div>
        <div class="muted-channel">Security</div>
      </div>
      <div class="sidebar-footer">
        <span>${peopleIcon()}</span>
        <span>Acme Demo</span>
        <button class="sidebar-tool" aria-label="Settings">${settingsIcon()}</button>
      </div>
    </aside>
  `;
}

function chatButton(chatId, title, icon, badge) {
  const isActive = state.area === "chat" && state.activeChat === chatId;
  return `
    <button class="chat-list-item ${isActive ? "is-active" : ""}" data-action="chat-target" data-chat="${chatId}">
      ${icon}
      <span>${title}</span>
      ${badge ? `<span class="badge">${badge}</span>` : ""}
    </button>
  `;
}

function navButton(target, title, icon, badge, subtitle = "") {
  const isChannel = target.startsWith("channel:");
  const isActive = isChannel ? state.area === "teams" && state.activeChannel === target.split(":")[1] : state.area === target;
  return `
    <button class="nav-button ${isActive ? "is-active" : ""}" data-action="nav" data-target="${target}">
      ${icon}
      <span class="nav-copy">
        <span class="nav-title">${title}</span>
        ${subtitle ? `<span class="nav-subtitle">${subtitle}</span>` : ""}
      </span>
      ${badge ? `<span class="badge">${badge}</span>` : ""}
    </button>
  `;
}

function renderHeader() {
  const title =
    isStackChat() ? "Stack Internal" :
    state.area === "activity" ? "Activity" :
    state.area === "chat" ? "Chat" :
    channels.find((c) => c.id === state.activeChannel)?.name ?? "General";

  const showTabs = isStackChat() || state.area === "teams";
  return `
    <header class="topbar">
      <div class="topbar-left">
        <div class="topbar-title">
          ${isStackChat() ? `<span class="app-icon app-icon--header">${stackIcon}</span>` : ""}
          ${state.area === "teams" ? `<span class="team-icon team-icon--header">T</span>` : ""}
          <span>${title}</span>
        </div>
        ${showTabs ? renderHeaderTabs() : ""}
      </div>
      <div class="topbar-actions">
        ${state.area === "teams" ? '<span class="sensitivity-label">Confidential</span>' : ""}
        <button class="header-icon" aria-label="Search">${searchIcon()}</button>
        <button class="header-icon" aria-label="Pop out">${popoutIcon()}</button>
        <button class="header-icon" aria-label="More">${moreIcon()}</button>
      </div>
    </header>
  `;
}

function renderHeaderTabs() {
  if (state.area === "teams") {
    return `
      <div class="tabs tabs--inline" role="tablist" aria-label="Channel tabs">
        <button class="tab ${state.appTab === "messages" ? "is-active" : ""}" role="tab" aria-selected="${state.appTab === "messages"}" data-action="tab" data-tab="messages">Posts</button>
        <button class="tab ${state.appTab === "chat" ? "is-active" : ""}" role="tab" aria-selected="${state.appTab === "chat"}" data-action="tab" data-tab="chat">Files</button>
        <button class="tab" role="tab" aria-selected="false" data-action="noop">OneNote</button>
        <button class="tab tab-icon" role="tab" aria-selected="false" data-action="noop" aria-label="Add tab">${plusBoxIcon()}</button>
      </div>
    `;
  }

  return `
    <div class="tabs tabs--inline" role="tablist" aria-label="Stack Internal tabs">
      <button class="tab ${state.appTab === "messages" ? "is-active" : ""}" role="tab" aria-selected="${state.appTab === "messages"}" data-action="tab" data-tab="messages">Messages</button>
      <button class="tab ${state.appTab === "chat" ? "is-active" : ""}" role="tab" aria-selected="${state.appTab === "chat"}" data-action="tab" data-tab="chat">Chat</button>
    </div>
  `;
}

function renderMainContent() {
  if (state.area === "activity") return renderActivity();
  if (state.area === "teams") return renderChannel();
  if (state.area === "chat" && !isStackChat()) return `<section class="content"><div class="chat-placeholder">Select a chat to continue the conversation.</div></section>`;
  if (state.appTab === "chat") return `<section class="content"><div class="chat-placeholder">Ask Stack Internal anything. In Teams, this app chat is where the bot can answer freely outside the SME validation channel.</div></section>`;

  return `
    <section class="content channel-surface">
      <div class="content-inner message-stream">
        ${currentMessages().map(renderPost).join("")}
      </div>
    </section>
  `;
}

function isStackChat() {
  return state.area === "chat" && state.activeChat === "stack";
}

function renderPost(message) {
  return `
    <article class="teams-post teams-post--app" data-message-id="${message.id}">
      ${avatarElement(avatars.stack, "avatar avatar--app", "Stack Internal")}
      <div class="post-body">
        <div class="post-header">
          <span class="author">Stack Internal</span>
          <span class="time">${message.timestamp ?? "10:47 AM"}</span>
        </div>
        ${message.card ? renderAdaptiveCard(message) : ""}
      </div>
    </article>
  `;
}

function renderAdaptiveCard(message) {
  const card = message.card;
  const answered = state.directAnswers[message.id];
  const confirmed = state.directCorrect.has(message.id);
  const forwarded = state.forwarded[message.id];
  const status = card.status ?? (answered ? "Answered by Giamir" : confirmed ? "Giamir marked this answer as correct" : "");
  const answer = card.answer ?? answered;
  return `
    <section class="adaptive-card" role="group" aria-label="Stack Internal adaptive card">
      <p class="card-intro">${withMentions(message.text)}</p>
      <div class="adaptive-card-body">
        <p class="card-title">${card.titleLabel ? `<span class="card-label">${card.titleLabel}</span> ` : ""}${escapeHtml(card.title)}</p>
        <p class="card-text">${card.bodyLabel ? `<span class="card-label">${card.bodyLabel}</span> ` : ""}${escapeHtml(card.body)}</p>
      </div>
      ${status ? renderStatus(status, card.check || confirmed) : ""}
      ${answer ? `<button class="reply-link" data-action="open-reply-thread" data-message-id="${message.id}">1 reply · Today at 10:50 AM</button>` : ""}
      ${card.sources?.length ? renderSources(card.sources) : ""}
      ${!status && !forwarded && !card.noAnswer ? renderActions(message) : ""}
      ${forwarded && !status ? `
        <div class="forwarded-state">
          <div class="status">Forwarded to ${forwarded}</div>
          <button class="btn" data-action="go-channel" data-channel="${forwarded.toLowerCase()}">Open channel post</button>
        </div>
      ` : ""}
      ${!status && !forwarded && card.autoForwardTo ? renderAutoForwardNote(card.autoForwardTo) : ""}
    </section>
  `;
}

function renderAutoForwardNote(username) {
  return `
    <div class="auto-forward-note">
      ${clockIcon()}
      <span>Auto-forwards to ${escapeHtml(username)} in 2 hours if unverified.</span>
    </div>
  `;
}

function renderSources(rows) {
  return `
    <div class="sources-section">
      <div class="sources-heading">${rows.length} ${rows.length === 1 ? "source" : "sources"}</div>
      <div class="source-list">
        ${rows.map((row) => `
          <div class="source-row">
            <span class="source-icon ${row.type}">${sourceIcon(row.type)}</span>
            <span>
              <a class="source-title" href="${sourceHref(row)}" target="_blank" rel="noopener noreferrer">${escapeHtml(row.title)}</a>
              <span> · ${escapeHtml(row.meta)}</span>
            </span>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function sourceHref(row) {
  const slug = row.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return row.type === "teams"
    ? `https://teams.microsoft.com/l/message/${slug || "source"}`
    : `https://www.microsoft365.com/launch/word?source=${encodeURIComponent(slug || "source")}`;
}

function renderStatus(text, check) {
  return `
    <div class="status">
      ${check ? checkmarkCircleIcon() : ""}
      <span>${escapeHtml(text)}</span>
    </div>
  `;
}

function renderActions(message) {
  const showCorrect = !message.card.answerUnavailable;
  return `
    <div class="card-actions">
      <button class="btn btn-primary is-hidden-for-now" data-action="answer" data-message-id="${message.id}">${message.card.answerUnavailable ? "Answer" : "Answer"}</button>
      ${showCorrect ? `<button class="btn" data-action="mark-correct" data-message-id="${message.id}">This is correct</button>` : ""}
      <span class="forward-menu is-hidden-for-now">
        <button class="btn" data-action="toggle-forward" data-message-id="${message.id}">Forward to channel</button>
        ${state.forwardMenu === message.id ? renderForwardMenu(message.id) : ""}
      </span>
      <button class="btn is-hidden-for-now" data-action="view-context">View full context</button>
    </div>
  `;
}

function renderForwardMenu(messageId) {
  return `
    <div class="forward-popover">
      ${channels.filter((c) => c.id !== "general").map((channel) => `
        <button data-action="forward-channel" data-message-id="${messageId}" data-channel="${channel.id}">
          <span class="channel-menu-icon">${channelIcon()}</span><span>${channel.name}</span>
        </button>
      `).join("")}
    </div>
  `;
}

function renderChannel() {
  const posts = state.channelPosts[state.activeChannel] ?? [];
  return `
    <section class="content channel-surface">
      <div class="content-inner message-stream">
        ${posts.length ? posts.map(renderChannelPost).join("") : `<div class="empty-state">No posts in this channel yet.</div>`}
      </div>
      ${renderComposer(`Type a new message in ${channels.find((c) => c.id === state.activeChannel)?.name ?? "General"}`)}
    </section>
  `;
}

function renderChannelPost(post) {
  const isAppPost = post.author === "Stack Internal";
  return `
    <article class="teams-post ${isAppPost ? "teams-post--app" : ""}" data-message-id="${post.id}">
      ${avatarElement(post.avatar ?? avatars.stack, `avatar ${isAppPost ? "avatar--app" : ""}`, isAppPost ? "Stack Internal" : post.author)}
      <div class="post-body">
        <div class="post-header">
          <span class="author">${escapeHtml(post.author)}</span>
          <span class="time">${post.timestamp ?? "10:50 AM"}</span>
        </div>
        ${isAppPost ? "" : `<div class="post-text">${withMentions(post.text)}</div>`}
        ${post.card ? renderChannelCard(post) : ""}
        ${!isAppPost && post.replies?.length ? `<button class="reply-link" data-action="open-channel-thread" data-post-id="${post.id}">${post.replies.length} ${post.replies.length === 1 ? "reply" : "replies"} · Today at 10:52 AM</button>` : ""}
      </div>
    </article>
  `;
}

function renderChannelCard(post) {
  const card = post.card;
  return `
    <section class="adaptive-card" role="group" aria-label="Stack Internal adaptive card">
      <p class="card-intro">${withMentions(post.text)}</p>
      <div class="adaptive-card-body">
        <p class="card-title">${card.titleLabel ? `<span class="card-label">${card.titleLabel}</span> ` : ""}${escapeHtml(card.title)}</p>
        <p class="card-text">${card.bodyLabel ? `<span class="card-label">${card.bodyLabel}</span> ` : ""}${escapeHtml(card.body)}</p>
      </div>
      ${post.answered ? renderStatus("Answered by Giamir", false) : ""}
      ${post.replies?.length ? `<button class="reply-link" data-action="open-channel-thread" data-post-id="${post.id}">${post.replies.length} ${post.replies.length === 1 ? "reply" : "replies"} · Today at 10:52 AM</button>` : ""}
      ${card.sources?.length ? renderSources(card.sources) : ""}
      ${!post.answered ? `
        <div class="card-actions">
          <button class="btn btn-primary" data-action="open-channel-thread" data-post-id="${post.id}">Answer in replies</button>
          ${card.answerUnavailable ? "" : `<button class="btn" data-action="channel-correct" data-post-id="${post.id}">This is correct</button>`}
        </div>
      ` : ""}
      ${!post.answered && card.autoForwardTo ? renderAutoForwardNote(card.autoForwardTo) : ""}
    </section>
  `;
}

function renderThreadPanel() {
  const thread = state.threadMessage;
  const replies = thread.replies ?? [];
  return `
    <aside class="thread-panel">
      <header class="thread-header">
        <div class="thread-title">Thread</div>
        <button class="icon-button" data-action="close-thread" aria-label="Close">${closeIcon()}</button>
      </header>
      <div class="thread-content">
        <div class="thread-card">
          ${renderThreadPost(thread)}
          ${replies.map((reply) => `
            <div class="reply">
              ${avatarElement(reply.avatar, "avatar", reply.author)}
              <div>
                <div class="post-header"><span class="author">${escapeHtml(reply.author)}</span><span class="time">${reply.timestamp}</span></div>
                <div class="reply-text">${escapeHtml(reply.text)}</div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
      <div class="reply-composer">
        <div class="mini-toolbar">
          <button aria-label="Bold">${boldIcon()}</button>
          <button aria-label="Italic">${italicIcon()}</button>
          <button aria-label="Strikethrough">${strikethroughIcon()}</button>
          <button aria-label="Link">${linkIcon()}</button>
          <button aria-label="Numbered list">${numberListIcon()}</button>
          <button aria-label="Bulleted list">${bulletListIcon()}</button>
          <button aria-label="Code">${codeIcon()}</button>
        </div>
        <textarea id="reply-input" placeholder="Type a reply"></textarea>
        <div class="reply-composer-actions">
          <button class="send-button" data-action="send-reply" aria-label="Send">${sendIcon()}</button>
        </div>
      </div>
    </aside>
  `;
}

function renderThreadPost(thread) {
  const hasReplies = thread.replies?.length;
  const isAppPost = thread.author === "Stack Internal";
  return `
    <article class="thread-post ${isAppPost ? "teams-post--app" : ""}" data-message-id="${thread.id}">
      ${avatarElement(thread.avatar ?? avatars.stack, `avatar ${isAppPost ? "avatar--app" : ""}`, isAppPost ? "Stack Internal" : thread.author)}
      <div class="thread-post-body">
        <div class="post-header">
          <span class="author">${escapeHtml(thread.author)}</span>
          <span class="time">${thread.timestamp ?? "10:50 AM"}</span>
        </div>
        ${isAppPost ? "" : `<div class="post-text">${withMentions(thread.text)}</div>`}
        ${thread.card ? renderThreadCard(thread) : ""}
        ${!isAppPost && hasReplies ? `<div class="thread-reply-count">${thread.replies.length} ${thread.replies.length === 1 ? "reply" : "replies"} · Today at ${thread.replies[0].timestamp.replace(" AM", "").replace(" PM", "")}</div>` : ""}
      </div>
    </article>
  `;
}

function renderThreadCard(thread) {
  const card = thread.card;
  return `
    <section class="thread-summary-card" role="group" aria-label="Stack Internal adaptive card">
      <p class="card-intro">${withMentions(thread.text)}</p>
      <div class="adaptive-card-body">
        <p class="card-title">${card.titleLabel ? `<span class="card-label">${card.titleLabel}</span> ` : ""}${escapeHtml(card.title)}</p>
        <p class="card-text">${card.bodyLabel ? `<span class="card-label">${card.bodyLabel}</span> ` : ""}${escapeHtml(card.body)}</p>
      </div>
      ${thread.answered ? renderStatus("Answered by Giamir", false) : ""}
      ${card.sources?.length ? renderSources(card.sources) : ""}
      ${thread.replies?.length ? `<div class="thread-reply-count">${thread.replies.length} ${thread.replies.length === 1 ? "reply" : "replies"} · Today at ${thread.replies[0].timestamp.replace(" AM", "").replace(" PM", "")}</div>` : ""}
    </section>
  `;
}

function renderComposer(placeholder) {
  return `
    <div class="composer" aria-label="Message composer">
      <input type="text" placeholder="${escapeHtml(placeholder)}" />
      <div class="composer-toolbar">
        <button aria-label="Format">${formatIcon()}</button>
        <button aria-label="Urgent">${importantIcon()}</button>
        <button aria-label="Loop components">${componentIcon()}</button>
        <button aria-label="Attach">${paperclipIcon()}</button>
        <button aria-label="Emoji">${emojiIcon()}</button>
        <button aria-label="GIF">${gifIcon()}</button>
        <button aria-label="Sticker">${stickerIcon()}</button>
        <button aria-label="Add apps">${appsIcon()}</button>
        <button aria-label="More">${moreIcon()}</button>
        <button class="send-button" aria-label="Send">${sendIcon()}</button>
      </div>
    </div>
  `;
}

function renderAnswerModal() {
  const message = smeMessages.find((item) => item.id === state.modalMessageId);
  return `
    <div class="modal-backdrop">
      <div class="modal" role="dialog" aria-modal="true" aria-label="Answer question">
        <div class="modal-header">
          <h2 class="modal-title">${message.id === "yak" ? "Verify response" : "Answer question"}</h2>
          <div class="time">${message.asker ?? "The asker"} will receive this in Stack Internal.</div>
        </div>
        <div class="modal-body">
          <p><strong>${message.card.titleLabel ?? "Question:"}</strong> ${escapeHtml(message.card.title)}</p>
          <p><strong>${message.card.bodyLabel ?? "Suggested answer:"}</strong> ${escapeHtml(message.card.body)}</p>
          <label for="answer-input"><strong>Answer</strong></label>
          <textarea id="answer-input" class="answer-input" placeholder="Write your answer"></textarea>
        </div>
        <div class="modal-footer">
          <button class="btn" data-action="close-modal">Cancel</button>
          <button class="btn btn-primary" data-action="send-direct-answer" data-message-id="${message.id}">Send answer</button>
        </div>
      </div>
    </div>
  `;
}

function renderActivity() {
  const rows = state.persona === "asker" ? state.activity : [];
  return `
    <section class="content">
      <div class="content-inner">
        <div class="activity-list">
          ${rows.length ? rows.map((item) => `
            <button class="activity-item" data-action="open-activity" data-activity-id="${item.id}">
              <span class="activity-icon">${activityIcon()}</span>
              <span>
                <strong>${escapeHtml(item.title)}</strong><br />
                <span class="time">${escapeHtml(item.subtitle)}</span>
              </span>
            </button>
          `).join("") : `<div class="empty-state">No new activity.</div>`}
        </div>
      </div>
    </section>
  `;
}

function forwardMessage(messageId, channelId) {
  const source = smeMessages.find((message) => message.id === messageId);
  const channel = channels.find((item) => item.id === channelId);
  const post = {
    id: `forwarded-${messageId}`,
    originalId: messageId,
    author: "Stack Internal",
    avatar: avatars.stack,
    timestamp: "10:51 AM",
    text: `This question from @${source.asker ?? "Alex Chen"} was forwarded for anyone in this channel to answer.`,
    card: { ...source.card },
    replies: []
  };
  state.channelPosts[channelId] = [...(state.channelPosts[channelId] ?? []), post];
  state.forwarded[messageId] = channel.name;
  state.forwardMenu = null;
}

function sendDirectAnswer(messageId, answer) {
  if (!answer.trim()) return;
  state.directAnswers[messageId] = answer.trim();
  state.modalMessageId = null;
}

function sendThreadReply() {
  const input = document.getElementById("reply-input");
  const value = input?.value.trim();
  if (!value || !state.threadMessage) return;
  const reply = {
    author: "Giamir Buoncristiani",
    avatar: avatars.giamir,
    timestamp: "10:52 AM",
    text: value
  };
  state.threadMessage.replies.push(reply);
  state.threadMessage.answered = true;
  if (state.threadMessage.originalId) {
    addActivityNotification(state.threadMessage, reply);
  }
  render();
}

function addActivityNotification(post, reply) {
  if (post.originalId !== "yak") return;
  const notification = {
    id: `activity-${post.originalId}`,
    title: "Giamir answered your forwarded question in Infra",
    subtitle: "Stack Internal · Reply in thread",
    post: {
      id: `activity-thread-${post.originalId}`,
      author: "Stack Internal",
      avatar: avatars.stack,
      timestamp: "10:52 AM",
      text: `By you: ${projectYakQuestion}`,
      card: {
        titleLabel: "Question:",
        title: projectYakQuestion,
        bodyLabel: "Response:",
        body: projectYakResponse,
        sources: sources.yak
      },
      replies: [reply],
      answered: true
    }
  };
  state.activity = [notification, ...state.activity.filter((item) => item.id !== notification.id)];
  state.activitySeen = state.area === "activity" && state.persona === "asker";
}

function fluentIcon(name) {
  return fluentIcons[name] ?? "";
}

function teamsLogoIcon() {
  return fluentIcon("teamsRail");
}

function activityIcon() {
  return fluentIcon("activity");
}

function chatIcon() {
  return fluentIcon("chat");
}

function sourceIcon(type) {
  if (type === "docs") return fluentIcon("filesFilled") || filesIcon();
  return fluentIcon("chatFilled") || chatIcon();
}

function teamsIcon() {
  return fluentIcon("teams");
}

function calendarIcon() {
  return fluentIcon("calendar");
}

function clockIcon() {
  return `
    <svg fill="currentColor" aria-hidden="true" width="20" height="20" viewBox="0 0 20 20">
      <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 1a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm.5 3.5a.5.5 0 0 0-1 0v4c0 .17.09.33.22.42l3 2a.5.5 0 1 0 .56-.84L10.5 10.23V6.5Z"/>
    </svg>
  `;
}

function callsIcon() {
  return fluentIcon("calls");
}

function filesIcon() {
  return fluentIcon("files");
}

function appsIcon() {
  return fluentIcon("apps");
}

function addAppsIcon() {
  return fluentIcon("addApps");
}

function searchIcon() {
  return fluentIcon("search");
}

function filterIcon() {
  return fluentIcon("filter");
}

function settingsIcon() {
  return fluentIcon("settings");
}

function peopleIcon() {
  return fluentIcon("people");
}

function popoutIcon() {
  return fluentIcon("popout");
}

function panelIcon() {
  return fluentIcon("panel");
}

function closeIcon() {
  return fluentIcon("close");
}

function moreIcon() {
  return fluentIcon("more");
}

function linkIcon() {
  return fluentIcon("link");
}

function formatIcon() {
  return fluentIcon("format");
}

function componentIcon() {
  return fluentIcon("component");
}

function paperclipIcon() {
  return fluentIcon("attach");
}

function importantIcon() {
  return fluentIcon("important");
}

function emojiIcon() {
  return fluentIcon("emoji");
}

function gifIcon() {
  return fluentIcon("gif");
}

function stickerIcon() {
  return fluentIcon("sticker");
}

function sendIcon() {
  return fluentIcon("send");
}

function chevronLeftIcon() {
  return fluentIcon("chevronLeft");
}

function chevronRightIcon() {
  return fluentIcon("chevronRight");
}

function chevronDownIcon() {
  return fluentIcon("chevronDown");
}

function squareIcon() {
  return fluentIcon("square");
}

function minimizeIcon() {
  return fluentIcon("minimize");
}

function newChatIcon() {
  return fluentIcon("newChat");
}

function copilotIcon() {
  return fluentIcon("copilot");
}

function compassIcon() {
  return fluentIcon("compass");
}

function draftIcon() {
  return fluentIcon("draft");
}

function plusBoxIcon() {
  return fluentIcon("plusBox");
}

function channelIcon() {
  return fluentIcon("channel");
}

function checkmarkCircleIcon() {
  return fluentIcon("checkmarkCircle");
}

function boldIcon() {
  return fluentIcon("bold");
}

function italicIcon() {
  return fluentIcon("italic");
}

function strikethroughIcon() {
  return fluentIcon("strikethrough");
}

function numberListIcon() {
  return fluentIcon("numberList");
}

function bulletListIcon() {
  return fluentIcon("bulletList");
}

function codeIcon() {
  return fluentIcon("code");
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  const messageId = target.dataset.messageId;

  if (action === "select-area") {
    state.area = target.dataset.area;
    if (state.area === "chat") state.activeChat = "stack";
    if (state.area === "teams") state.appTab = "messages";
    if (state.area === "activity") state.activitySeen = true;
    state.threadMessage = null;
  }
  if (action === "chat-target") {
    state.area = "chat";
    state.activeChat = target.dataset.chat;
    state.threadMessage = null;
  }
  if (action === "nav") {
    const navTarget = target.dataset.target;
    if (navTarget.startsWith("channel:")) {
      state.area = "teams";
      state.activeChannel = navTarget.split(":")[1];
      state.appTab = "messages";
    } else {
      state.area = navTarget;
    }
    if (state.area === "activity") state.activitySeen = true;
    state.threadMessage = null;
  }
  if (action === "persona") {
    state.persona = target.dataset.persona;
    state.area = "chat";
    state.activeChat = "stack";
    state.threadMessage = null;
  }
  if (action === "tab") state.appTab = target.dataset.tab;
  if (action === "toggle-sources") {
    state.openSources.has(messageId) ? state.openSources.delete(messageId) : state.openSources.add(messageId);
  }
  if (action === "answer") state.modalMessageId = messageId;
  if (action === "close-modal") state.modalMessageId = null;
  if (action === "send-direct-answer") {
    sendDirectAnswer(messageId, document.getElementById("answer-input")?.value ?? "");
  }
  if (action === "mark-correct") state.directCorrect.add(messageId);
  if (action === "toggle-forward") state.forwardMenu = state.forwardMenu === messageId ? null : messageId;
  if (action === "forward-channel") forwardMessage(messageId, target.dataset.channel);
  if (action === "go-channel") {
    state.area = "teams";
    state.activeChannel = target.dataset.channel;
  }
  if (action === "open-channel-thread") {
    const postId = target.dataset.postId;
    const posts = state.channelPosts[state.activeChannel] ?? [];
    state.threadMessage = posts.find((post) => post.id === postId);
  }
  if (action === "send-reply") sendThreadReply();
  if (action === "close-thread") state.threadMessage = null;
  if (action === "open-activity") {
    const item = state.activity.find((row) => row.id === target.dataset.activityId);
    if (item) state.threadMessage = item.post;
  }
  if (action === "open-reply-thread") {
    const message = currentMessages().find((item) => item.id === messageId);
    const answer = message?.card?.answer ?? state.directAnswers[messageId];
    if (answer) {
      state.threadMessage = {
        id: `reply-${messageId}`,
        author: "Stack Internal",
        avatar: avatars.stack,
        text: message.text,
        card: message.card,
        replies: [{ author: "Giamir Buoncristiani", avatar: avatars.giamir, timestamp: "10:50 AM", text: answer }]
      };
    }
  }

  render();
});

render();

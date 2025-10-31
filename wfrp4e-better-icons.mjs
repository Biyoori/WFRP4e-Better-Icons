import { loadSkillIcon, LoadTalentIcon } from "./src/load-icons.mjs";
import { registerSettings} from "./src/settings.mjs";

Hooks.once('init', async () => {
    await registerSettings();
});

Hooks.once('ready', async () => {
    console.log("Better Icons | WFRP4E Better Icons is ready!");
    const corePack = game.packs.get("wfrp4e-core.items");
    if (!corePack) {
        console.error("WFRP4E Better Icons | Could not find wfrp4e-core compendium packs.");
        return;
    }
});

Hooks.on('createItem', async (item, options, userId) => {
    const source = item._stats.compendiumSource;

    if (!source || !source.startsWith("Compendium.wfrp4e-core.items")) {
        if (!options.career) return;
    }

    if (item.type === "skill") {
        loadSkillIcon(item);
    }
    
    if (item.type === "talent") {
        LoadTalentIcon(item);
    }
});

Hooks.on('createActor', async (actor, options, userId) => {
    if (actor.type !== "character" && actor.type !== "npc") return;

    for (const item of actor.items) {
        if (item.type !== "skill") continue;

        loadSkillIcon(item);
    }
});

Hooks.on('renderActorSheetV2', async (app, html, context, options) => {
    app.options.actions.refreshSkillIcons = async () => {
        console.log("Refreshing skill icons");
        for (const item of app.actor.items) {
            if (item.type !== "skill") continue;
            loadSkillIcon(item);
        }
    };

    if (!game.settings.get("wfrp4e-better-icons", "enableSkillIcons")) return;
    if (context.actor.type !== "character" && context.actor.type !== "npc") return;

    let skillLists
    if (context.actor.type === "character") {
        skillLists = $(html).find('.window-content section[data-tab="skills"] .skill-lists');
    } else if (context.actor.type === "npc") {
        skillLists = $(html).find('.window-content section[data-tab="main"] .skill-lists');
    } else return;
    
    for (const skillList of skillLists.children()) {
        const skillElements = $(skillList).children(".list-content");

        for (const skillElement of skillElements.children()) {
            if (!$(skillElement).hasClass('list-row') || $(skillElement).hasClass('inactive')) continue;
            
            const $skill = $(skillElement);
            const uuid = $skill.data('uuid');

            const match = uuid.match(/Item\.([a-zA-Z0-9]+)$/);
            if (!match) continue;

            const itemId = match[1];
            const skill = context.actor.items.get(itemId);
            if (!skill) continue;

            const icon = $(`<img class="skill-icon" src="${skill.img}" alt=""
                style="width:24px; height:24px; flex:0 0 0">`);

            const skillName = $skill.find('.list-name')
            if (skillName.length > 0) {
                skillName.prepend(icon);
            }
        }
    }
});

Hooks.on("getHeaderControlsApplicationV2", (app, buttons) => {
    buttons.unshift({
        label: "Refresh Skill Icons",
        icon: "fas fa-sync",
        class: "refresh-skill-icons",
        action: "refreshSkillIcons"
    });
});
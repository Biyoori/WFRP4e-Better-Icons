export async function registerSettings() {
    await game.settings.register("wfrp4e-better-icons", "enableSkillIcons", {
        name: "Show skill icons",
        hint: "Display icons next to skills on character sheets.",
        scope: "client",
        config: true,
        type: Boolean,
        default: true
    });
}
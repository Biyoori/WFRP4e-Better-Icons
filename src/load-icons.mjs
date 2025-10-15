export async function loadSkillIcon(item) {
    const nameNormalized = item.name.toLowerCase().replace(/\s+/g, "");
    const iconPath = `modules/wfrp4e-better-icons/icons/skills/${nameNormalized}.svg`;

    await loadIcon(item, iconPath);
}

export async function LoadTalentIcon(item) {
    const nameNormalized = item.name.toLowerCase()
    .split("(")[0]
    .trim()
    .replace(/\s+/g, "-")
    .replace(/\/+/g, "")
    .replace(/\'+/g, "");
    const iconPath = `modules/wfrp4e-better-icons/icons/talents/${nameNormalized}.png`;

    console.log(nameNormalized, iconPath);
    await loadIcon(item, iconPath);
}

async function loadIcon(item, iconPath) {
    let iconExists = false;
    try {
           iconExists = await foundry.utils.srcExists(iconPath);
    } catch (e) {
        (console.warn(`WFRP4E Better Icons | Error checking icon for skill: ${item.name}`, e));
    }
    if (!iconPath || !iconExists) {
        console.warn(`WFRP4E Better Icons | No icon found for skill: ${item.name}`);
        return;
    }

    if (item.img !== iconPath) { 
        await item.update({ img: iconPath });
        console.log(`WFRP4E Better Icons | Set icon for skill: ${item.name}`);
    }
}
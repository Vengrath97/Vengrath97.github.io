function normalizeState(raw) {
  const defaults = {
    schemaVersion: 2, step: 0, name:"", player:"", campaign:"", alignment:"", level:1,
    race:"", subrace:"", racialMode:"2014", tashaMode:"2+1", tasha:{}, racialSkills:[], racialLanguages:[],
    className:"", subclass:"", classSkills:[], expertise:[], background:"", backgroundSkills:[], backgroundLanguages:[], assign:{}, notes:""
  };
  const next = { ...defaults, ...(raw || {}) };
  next.schemaVersion = 3;
  next.step = Math.max(0, Math.min(6, Number(next.step) || 0));
  next.level = Math.max(1, Math.min(20, Number(next.level) || 1));
  ["racialSkills","racialLanguages","classSkills","expertise","backgroundSkills","backgroundLanguages"].forEach(k => {
    if (!Array.isArray(next[k])) next[k] = [];
  });
  if (!next.tasha || typeof next.tasha !== "object") next.tasha = {};
  if (!next.assign || typeof next.assign !== "object") next.assign = {};
  return next;
}

document.addEventListener("click", (e) => {
  const control = e.target.closest("[data-type]");
  if (control) {
    const type = control.dataset.type;
    const value = control.dataset.value;

    if (type === "race") {
      S.race = value; S.subrace = ""; S.racialSkills = []; S.racialLanguages = [];
      S.tasha = {};
    } else if (type === "className") {
      S.className = value; S.subclass = ""; S.classSkills = []; S.expertise = [];
    } else if (type === "background") {
      S.background = value; S.backgroundSkills = []; S.backgroundLanguages = [];
    } else if (type === "backgroundSkill") {
      toggleLimited(S.backgroundSkills, value, 2);
    } else if (type === "racialLanguage") {
      toggleLimited(S.racialLanguages, value, R.race()?.languageChoices || 0);
    } else if (type === "backgroundLanguage") {
      toggleLimited(S.backgroundLanguages, value, DATA.backgroundLanguages[S.background]?.choices || 0);
    } else if (type === "classSkill") {
      toggleLimited(S.classSkills, value, Number(R.cls()?.n || 0));
    } else if (type === "expertise") {
      toggleLimited(S.expertise, value, 2);
    } else if (type === "racialMode") {
      if (value === "2014") {
        S.racialMode = "2014";
      } else {
        const nextMode = value === "tasha2+1" ? "2+1" : "1+1+1";
        if (S.racialMode !== "tasha" || S.tashaMode !== nextMode) S.tasha = {};
        S.racialMode = "tasha";
        S.tashaMode = nextMode;
      }
    } else if (type === "tashaMode") {
      if (S.tashaMode !== value) { S.tashaMode = value; S.tasha = {}; }
    } else if (type === "level") {
      S.level = Math.max(1, Math.min(20, Number(value) || 1));
    } else {
      S[type] = value;
    }
    render(); return;
  }

  const stepControl = e.target.closest("[data-step]");
  if (stepControl) {
    const target = +stepControl.dataset.step;
    // Review is always accessible. Only the final Character Sheet is gated
    // behind completion of every required choice.
    if (target === 6 && !R.isComplete()) {
      S.step = 5;
      render();
      return;
    }
    S.step = target; render(); return;
  }

  if (e.target.closest("[data-next]")) {
    const next = S.step + 1;
    // Let the user reach and inspect Review even with incomplete choices.
    // The Character Sheet is the only step that requires full completion.
    if (next === 6) {
      if (R.isComplete()) S.step = 6;
    } else if (next <= 5) {
      S.step = next;
    }
    render(); return;
  }
  if (e.target.closest("[data-prev]")) { S.step = Math.max(0, S.step - 1); render(); return; }
  if (e.target.closest("[data-reset-tasha]")) { S.tasha = {}; render(); return; }
  if (e.target.closest("[data-clear-score]")) { delete S.assign[e.target.closest("[data-clear-score]").dataset.clearScore]; render(); return; }
  if (e.target.closest("[data-clear-tasha]")) { delete S.tasha[e.target.closest("[data-clear-tasha]").dataset.clearTasha]; render(); return; }
  if (e.target.closest("[data-save]")) { save(); return; }
  if (e.target.closest("[data-load]")) { $("#file").click(); return; }
});

function toggleLimited(array, value, limit) {
  const index = array.indexOf(value);
  if (index >= 0) array.splice(index, 1);
  else if (array.length < limit) array.push(value);
}

document.addEventListener("input", (e) => {
  if (!e.target.dataset.field) return;
  const key = e.target.dataset.field;
  if (key === "level") S.level = Math.max(1, Math.min(20, Number(e.target.value) || 1));
  else S[key] = e.target.value;
  if (e.target.dataset.live === "true") render();
});

document.addEventListener("dragstart", (e) => {
  const target = e.target.closest("[data-ability],[data-token]");
  if (target) e.dataTransfer.setData("text/plain", target.dataset.ability || target.dataset.token);
});
document.addEventListener("dragover", (e) => {
  if (e.target.closest("[data-ability-slot],[data-slot]")) e.preventDefault();
});
document.addEventListener("drop", (e) => {
  const abilitySlot = e.target.closest("[data-ability-slot]");
  const slot = e.target.closest("[data-slot]");
  if (!abilitySlot && !slot) return;
  e.preventDefault();
  const value = e.dataTransfer.getData("text/plain");

  if (abilitySlot) {
    const score = Number(value);
    if (!R.scoreArray.includes(score)) return;
    const destination = abilitySlot.dataset.abilitySlot;
    const oldAbility = Object.keys(S.assign).find(a => Number(S.assign[a]) === score);
    if (oldAbility && oldAbility !== destination) delete S.assign[oldAbility];
    const occupiedScore = S.assign[destination];
    if (occupiedScore && Number(occupiedScore) !== score) {
      const otherAbility = Object.keys(S.assign).find(a => a !== destination && Number(S.assign[a]) === score);
      if (otherAbility) delete S.assign[otherAbility];
    }
    S.assign[destination] = score;
  } else {
    const amount = value === "+2" ? 2 : 1;
    const ability = slot.dataset.slot;
    if (S.tasha[ability]) return;
    const max = S.tashaMode === "2+1" ? 2 : 3;
    if (Object.keys(S.tasha).length < max) S.tasha[ability] = amount;
  }
  render();
});

function buildSaveData() {
  const scores = R.scores();
  const race = R.race() || {};
  const cls = R.cls() || {};
  const background = DATA.backgroundReference[S.background] || {};
  const proficiencyBonus = R.proficiencyBonus();
  const skills = R.proficientSkills();
  const expertise = R.expertiseSkills();
  const languages = languageSummary();
  const saves = R.saves();
  const modifiers = {};
  DATA.abilities.forEach(a => { modifiers[a] = R.modifier(scores[a]); });

  const skillDetails = DATA.skills.map(skill => ({
    name: skill,
    ability: R.skillAbility(skill),
    proficient: skills.includes(skill),
    expertise: expertise.includes(skill),
    modifier: R.skillModifier(skill)
  }));

  const savingThrows = DATA.abilities.map(ability => ({
    ability,
    proficient: saves.includes(ability),
    modifier: R.savingThrowModifier(ability)
  }));

  const dex = Number(scores.DEX || 0);
  const wis = Number(scores.WIS || 0);
  const con = Number(scores.CON || 0);
  const hitDie = (DATA.classReference[S.className] || {}).hitDie || null;

  return {
    fileType: "heartwell-character",
    schemaVersion: 3,
    exportedAt: new Date().toISOString(),
    state: JSON.parse(JSON.stringify(S)),
    characterSheet: {
      identity: {
        name: S.name,
        player: S.player,
        campaign: S.campaign,
        alignment: S.alignment,
        level: Number(S.level) || 1
      },
      lineage: {
        race: S.race,
        subrace: S.subrace,
        racialMode: S.racialMode,
        tashaMode: S.racialMode === "tasha" ? S.tashaMode : null,
        tashaBonuses: S.racialMode === "tasha" ? { ...S.tasha } : {},
        fixedRacialBonuses: S.racialMode === "2014" ? { ...(race.fixed || {}) } : {},
        subraceBonuses: S.racialMode === "2014" ? { ...((race.subs || {})[S.subrace] || {}) } : {},
        racialSkills: [...(race.skills || [])],
        racialSkillChoices: [...(S.racialSkills || [])],
        racialLanguages: [...(race.languages || [])],
        racialLanguageChoices: [...(S.racialLanguages || [])]
      },
      class: {
        name: S.className,
        subclass: S.subclass,
        skillChoices: [...(S.classSkills || [])],
        expertise: [...expertise],
        savingThrowProficiencies: [...saves],
        armorProficiencies: [...((DATA.classReference[S.className] || {}).armor || [])],
        weaponProficiencies: [...((DATA.classReference[S.className] || {}).weapons || [])],
        toolProficiencies: [...((DATA.classReference[S.className] || {}).tools || [])],
        hitDie: hitDie,
        featureSummary: (DATA.classReference[S.className] || {}).feature || ""
      },
      background: {
        name: S.background,
        skillProficiencies: S.background === "Custom" ? [...(S.backgroundSkills || [])] : [...(DATA.backgroundSkills[S.background] || [])],
        languageChoices: [...(S.backgroundLanguages || [])],
        languageRule: { ...(DATA.backgroundLanguages[S.background] || {}) },
        feature: background.feature || "",
        toolProficiencies: [...(background.tools || [])],
        startingEquipment: background.equipment || ""
      },
      abilities: {
        baseScores: { ...R.baseScores() },
        racialOrTashaBonuses: { ...R.bonus() },
        finalScores: { ...scores },
        modifiers,
        assignments: { ...S.assign }
      },
      proficiencies: {
        proficiencyBonus,
        skills: skillDetails,
        savingThrows,
        passivePerception: 10 + Math.floor((wis - 10) / 2) + (skills.includes("Perception") ? 2 : 0) + (expertise.includes("Perception") ? 2 : 0),
        initiative: R.modifier(dex),
        languages: [...languages]
      },
      combat: {
        armorClassUnarmored: 10 + Math.floor((dex - 10) / 2),
        initiative: R.modifier(dex),
        speed: "30 ft",
        hitPointsLevel1: hitDie ? hitDie + Math.floor((con - 10) / 2) : null,
        hitDie: hitDie ? `d${hitDie}` : null
      },
      notes: S.notes || ""
    }
  };
}

function save() {
  const payload = buildSaveData();
  S.schemaVersion = 3;
  localStorage.setItem("heartwell-character", JSON.stringify(payload));
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], {type:"application/json"}));
  link.download = (S.name || "character") + ".json";
  link.click();
  URL.revokeObjectURL(link.href);
}

document.addEventListener("change", (e) => {
  if (e.target.id !== "file" || !e.target.files[0]) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      const rawState = parsed && parsed.fileType === "heartwell-character" && parsed.state ? parsed.state : parsed;
      S = normalizeState(rawState);
      render();
    } catch { alert("Invalid character file"); }
  };
  reader.readAsText(e.target.files[0]);
});

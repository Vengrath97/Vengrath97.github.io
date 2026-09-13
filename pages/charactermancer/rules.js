// Shared rules and derived character values.
window.R = (() => {
  const SCORE_ARRAY = [15, 14, 13, 12, 10, 8];

  function addBonuses(target, source) {
    for (const [ability, value] of Object.entries(source || {})) {
      target[ability] = (target[ability] || 0) + Number(value || 0);
    }
  }

  function normalizeAssignments() {
    const out = {};
    for (const ability of DATA.abilities) {
      const value = Number(S.assign?.[ability]);
      if (SCORE_ARRAY.includes(value)) out[ability] = value;
    }
    return out;
  }

  function racialBonuses() {
    const race = rules.race();
    if (!race) return {};
    const bonuses = {};
    if (S.racialMode === "tasha") addBonuses(bonuses, S.tasha);
    else {
      addBonuses(bonuses, race.fixed);
      addBonuses(bonuses, (race.subs || {})[S.subrace]);
    }
    return bonuses;
  }

  const rules = {
    scoreArray: SCORE_ARRAY,
    race() { return DATA.races[S.race]; },
    cls() { return DATA.classes[S.className]; },
    background() { return S.background; },
    bonus() { return racialBonuses(); },
    baseScores() { return normalizeAssignments(); },
    scores() {
      const scores = {};
      const bonuses = racialBonuses();
      for (const ability of DATA.abilities) {
        scores[ability] = Number(S.assign?.[ability] || 0) + Number(bonuses[ability] || 0);
      }
      return scores;
    },
    modifier(score) {
      const n = Number(score || 0);
      const value = Math.floor((n - 10) / 2);
      return value >= 0 ? `+${value}` : `${value}`;
    },
    proficiencyBonus() {
      const level = Math.max(1, Math.min(20, Number(S.level) || 1));
      return `+${2 + Math.floor((level - 1) / 4)}`;
    },
    skillAbility(skill) { return DATA.skillAbilities[skill] || "—"; },
    skillModifier(skill) {
      const ability = rules.skillAbility(skill);
      let value = Number(rules.scores()[ability] || 0);
      value = Math.floor((value - 10) / 2);
      const proficient = rules.proficientSkills().includes(skill);
      const expert = (S.expertise || []).includes(skill);
      if (proficient) value += 2 * (expert ? 2 : 1);
      return value >= 0 ? `+${value}` : `${value}`;
    },
    proficientSkills() {
      const race = rules.race();
      const cls = rules.cls();
      const bg = S.background === "Custom" ? (S.backgroundSkills || []) : (DATA.backgroundSkills[S.background] || []);
      return [...new Set([...(race?.skills || []), ...(cls ? (S.classSkills || []) : []), ...bg])];
    },
    expertiseSkills() { return [...new Set(S.expertise || [])]; },
    saves() { return this.cls()?.saves || []; },
    savingThrowModifier(ability) {
      let value = Number(this.scores()[ability] || 0);
      value = Math.floor((value - 10) / 2);
      if (this.saves().includes(ability)) value += 2 + Math.floor(((Number(S.level) || 1) - 1) / 4);
      return value >= 0 ? `+${value}` : `${value}`;
    },
    isComplete() { return validation().every(item => item.ok); }
  };

  function validation() {
    const cls = rules.cls();
    const race = rules.race();
    const bg = S.background;
    const checks = [
      { key: "name", label: "Character name", ok: !!String(S.name || "").trim() },
      { key: "race", label: "Race", ok: !!race },
      { key: "subrace", label: "Race variant", ok: !!(race && S.subrace && Object.prototype.hasOwnProperty.call(race.subs || {}, S.subrace)) },
      { key: "class", label: "Class", ok: !!cls },
      { key: "subclass", label: "Subclass", ok: !!(cls && S.subclass && cls.subs.includes(S.subclass)) },
      { key: "scores", label: "Ability scores", ok: DATA.abilities.every(a => Number.isFinite(Number(S.assign?.[a]))) && new Set(DATA.abilities.map(a => Number(S.assign?.[a]))).size === 6 && DATA.abilities.every(a => SCORE_ARRAY.includes(Number(S.assign?.[a]))) },
      { key: "classSkills", label: "Class skills", ok: !!cls && (S.classSkills || []).length === Number(cls.n || 0) },
      { key: "background", label: "Background", ok: !!bg },
      { key: "backgroundSkills", label: "Background skills", ok: bg === "Custom" ? (S.backgroundSkills || []).length === 2 : true },
      { key: "tasha", label: "Tasha's allocation", ok: S.racialMode !== "tasha" || tashaComplete() },
    ];
    return checks;
  }

  function tashaComplete() {
    const vals = Object.values(S.tasha || {}).map(Number).filter(Boolean);
    return S.tashaMode === "2+1"
      ? vals.length === 2 && vals.includes(2) && vals.includes(1)
      : vals.length === 3 && vals.every(v => v === 1);
  }

  rules.validation = validation;
  rules.tashaComplete = tashaComplete;
  return rules;
})();

/*
===========================================================
 RACIAL CHOICES
===========================================================

Adds interactive 2014 race choices without replacing the main
Charactermancer renderer.

Supported choices:
- Half-Elf: 2 skills + two different +1 ability choices,
  added to fixed CHA +2.
- Variant Human: 1 skill + two different +1 ability choices,
  replacing the standard Human +1 to every ability.
===========================================================
*/

const RACIAL_CHOICE_RULES = {
  halfElf: {
    skillCount: 2,
    abilityCount: 2,
    abilityBonus: 1
  },
  variantHuman: {
    skillCount: 1,
    abilityCount: 2,
    abilityBonus: 1
  }
};

function racialChoiceRule() {
  if (S.race === "Half-Elf" && S.racialMode === "2014") {
    return RACIAL_CHOICE_RULES.halfElf;
  }

  if (S.race === "Human" && S.subrace === "Variant Human" && S.racialMode === "2014") {
    return RACIAL_CHOICE_RULES.variantHuman;
  }

  return null;
}

function isHalfElf() {
  return S.race === "Half-Elf" && S.racialMode === "2014";
}

function isVariantHuman() {
  return S.race === "Human" && S.subrace === "Variant Human" && S.racialMode === "2014";
}

function ensureRacialChoiceState() {
  if (!Array.isArray(S.racialSkills)) S.racialSkills = [];
  if (!S.racialAbilityChoices || typeof S.racialAbilityChoices !== "object") {
    S.racialAbilityChoices = {};
  }

  const rule = racialChoiceRule();

  if (!rule) {
    S.racialSkills = [];
    S.racialAbilityChoices = {};
    return;
  }

  S.racialSkills = S.racialSkills
    .filter(skill => DATA.skills.includes(skill))
    .slice(0, rule.skillCount);

  const selectedAbilities = Object.keys(S.racialAbilityChoices)
    .filter(ability => DATA.abilities.includes(ability))
    .slice(0, rule.abilityCount);

  S.racialAbilityChoices = Object.fromEntries(
    selectedAbilities.map(ability => [ability, rule.abilityBonus])
  );
}

function findRacePorthole() {
  const portholes = document.querySelectorAll(".porthole");

  for (const porthole of portholes) {
    const heading = [...porthole.querySelectorAll("b")]
      .find(node => node.textContent.trim() === "Ability Modifiers");

    if (heading) return porthole;
  }

  return null;
}

function findLabel(porthole, text) {
  return [...porthole.children]
    .find(node => node.matches("b") && node.textContent.trim() === text);
}

function replaceAdjacentParagraph(label, replacement) {
  if (!label) return;

  const next = label.nextElementSibling;
  if (next) next.replaceWith(replacement);
  else label.after(replacement);
}

function createChoiceRack(type, values, selected) {
  const rack = document.createElement("div");
  rack.className = "specimen-rack racial-choice-rack";

  for (const value of values) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = choice(type, value, value, selected.includes(value));
    rack.append(wrapper.firstElementChild);
  }

  return rack;
}

function enhanceRaceUI() {
  const rule = racialChoiceRule();
  const porthole = findRacePorthole();

  if (!rule || !porthole) return;
  if (porthole.dataset.racialChoicesEnhanced === "true") return;

  ensureRacialChoiceState();

  const abilityLabel = findLabel(porthole, "Ability Modifiers");
  const existingAbilityParagraph = abilityLabel?.nextElementSibling;

  if (existingAbilityParagraph) {
    if (isHalfElf()) {
      const fixedBonuses = ["CHA +2"];
      const selected = Object.keys(S.racialAbilityChoices);
      existingAbilityParagraph.innerHTML = [
        ...fixedBonuses,
        ...selected.map(ability => `${ability} +1`)
      ].map(value => `<i>${escapeHtml(value)}</i>`).join("");
    } else if (isVariantHuman()) {
      const selected = Object.keys(S.racialAbilityChoices);
      existingAbilityParagraph.innerHTML = selected.length
        ? selected.map(ability => `<i>${escapeHtml(ability)} +1</i>`).join("")
        : "None";
    }
  }

  const proficiencyLabel = findLabel(porthole, "Innate Proficiencies");
  if (proficiencyLabel) {
    const oldParagraph = proficiencyLabel.nextElementSibling;
    if (oldParagraph) oldParagraph.remove();

    const skillLabel = document.createElement("label");
    skillLabel.className = "field-label";
    skillLabel.textContent = `Skill Proficiencies — choose exactly ${rule.skillCount}`;
    proficiencyLabel.after(skillLabel);

    const rack = createChoiceRack(
      "racialSkill",
      DATA.skills,
      S.racialSkills
    );

    skillLabel.after(rack);

    const hint = document.createElement("p");
    hint.className = "panel-sub";
    hint.textContent = isHalfElf()
      ? "Half-Elf: choose any two skill proficiencies."
      : "Variant Human: choose one skill proficiency.";
    rack.after(hint);

    if (isHalfElf() || isVariantHuman()) {
      const abilityLabel2 = document.createElement("label");
      abilityLabel2.className = "field-label";
      abilityLabel2.textContent = "Ability Score Increase — choose two abilities (+1 each)";
      hint.after(abilityLabel2);

      const abilityRack = createChoiceRack(
        "racialAbility",
        DATA.abilities,
        Object.keys(S.racialAbilityChoices)
      );
      abilityLabel2.after(abilityRack);

      const abilityHint = document.createElement("p");
      abilityHint.className = "panel-sub";
      abilityHint.textContent = isHalfElf()
        ? "These +1 bonuses are added to the fixed Half-Elf CHA +2."
        : "These +1 bonuses replace the standard Human +1 to every ability.";
      abilityRack.after(abilityHint);
    }
  }

  porthole.dataset.racialChoicesEnhanced = "true";
}

const baseRacialBonuses = R.bonus;
R.bonus = function () {
  ensureRacialChoiceState();

  const rule = racialChoiceRule();
  if (!rule) return baseRacialBonuses.call(R);

  const bonuses = {};
  const race = R.race();
  const subrace = (race?.subs || {})[S.subrace] || {};

  if (isHalfElf()) {
    for (const [ability, value] of Object.entries(race?.fixed || {})) {
      bonuses[ability] = (bonuses[ability] || 0) + Number(value || 0);
    }
  }

  for (const [ability, value] of Object.entries(subrace)) {
    bonuses[ability] = (bonuses[ability] || 0) + Number(value || 0);
  }

  for (const [ability, value] of Object.entries(S.racialAbilityChoices)) {
    bonuses[ability] = (bonuses[ability] || 0) + Number(value || 0);
  }

  return bonuses;
};

const baseProficientSkills = R.proficientSkills;
R.proficientSkills = function () {
  ensureRacialChoiceState();

  const rule = racialChoiceRule();
  const skills = baseProficientSkills.call(R)
    .filter(skill => skill !== "2 CHOICE");

  if (!rule) return skills;

  return [...new Set([...skills, ...S.racialSkills])];
};

const baseValidation = R.validation;
R.validation = function () {
  ensureRacialChoiceState();

  const checks = baseValidation.call(R);
  const rule = racialChoiceRule();

  if (!rule) return checks;

  checks.push({
    key: "racialSkills",
    label: `${isHalfElf() ? "Half-Elf" : "Variant Human"} skill proficiencies`,
    ok: S.racialSkills.length === rule.skillCount
  });

  checks.push({
    key: "racialAbilityChoices",
    label: `${isHalfElf() ? "Half-Elf" : "Variant Human"} ability bonuses`,
    ok: Object.keys(S.racialAbilityChoices).length === rule.abilityCount
  });

  return checks;
};

R.isComplete = function () {
  return R.validation().every(item => item.ok);
};

document.addEventListener("click", event => {
  const control = event.target.closest('[data-type="racialSkill"],[data-type="racialAbility"]');
  if (!control || !racialChoiceRule()) return;

  event.preventDefault();
  event.stopImmediatePropagation();

  const rule = racialChoiceRule();
  const value = control.dataset.value;

  if (control.dataset.type === "racialSkill") {
    const index = S.racialSkills.indexOf(value);

    if (index >= 0) {
      S.racialSkills.splice(index, 1);
    } else if (S.racialSkills.length < rule.skillCount) {
      S.racialSkills.push(value);
    }
  } else {
    if (S.racialAbilityChoices[value]) {
      delete S.racialAbilityChoices[value];
    } else if (Object.keys(S.racialAbilityChoices).length < rule.abilityCount) {
      S.racialAbilityChoices[value] = rule.abilityBonus;
    }
  }

  render();
});

document.addEventListener("click", event => {
  if (!event.target.closest("[data-type=\"race\"],[data-type=\"subrace\"],[data-type=\"racialMode\"]")) {
    return;
  }

  queueMicrotask(ensureRacialChoiceState);
});

const observer = new MutationObserver(() => {
  const porthole = findRacePorthole();
  if (!porthole) return;
  if (porthole.dataset.racialChoicesEnhanced === "true") return;
  enhanceRaceUI();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

queueMicrotask(enhanceRaceUI);

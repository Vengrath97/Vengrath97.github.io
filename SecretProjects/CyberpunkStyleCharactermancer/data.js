/*
===========================================================
 CHARACTERMANCER CONTENT FILE
===========================================================

THIS IS THE MAIN FILE TO EDIT.

Normally, you only need to edit this file when adding or
changing game content.

The application reads window.DATA automatically.

-----------------------------------------------------------
 RACE FORMAT
-----------------------------------------------------------

"Race Name": {
    fixed: {
        DEX: 2
    },

    subs: {
        "Subrace Name": {
            WIS: 1
        }
    },

    skills: [
        "Perception"
    ]
}

-----------------------------------------------------------
 CLASS FORMAT
-----------------------------------------------------------

"Class Name": {
    subs: [
        "Subclass One",
        "Subclass Two"
    ],

    skills: [
        "Athletics",
        "Perception"
    ],

    n: 2,

    saves: [
        "STR",
        "CON"
    ],

    expertise: true
}

'expertise: true' enables the Expertise selector.

-----------------------------------------------------------
 BACKGROUNDS
-----------------------------------------------------------

Add background names to BACKGROUNDS.

"Custom" is special-cased by the application and provides
selectable skills.

===========================================================
*/


/* =========================================================
   ABILITIES
========================================================= */

const ABILITIES = [
    "STR",
    "DEX",
    "CON",
    "INT",
    "WIS",
    "CHA"
];


/* =========================================================
   SKILLS
========================================================= */

const SKILLS = [
    "Acrobatics",
    "Animal Handling",
    "Arcana",
    "Athletics",
    "Deception",
    "History",
    "Insight",
    "Intimidation",
    "Investigation",
    "Medicine",
    "Nature",
    "Perception",
    "Performance",
    "Persuasion",
    "Religion",
    "Sleight of Hand",
    "Stealth",
    "Survival"
];


/* =========================================================
   ALIGNMENTS
========================================================= */

const ALIGNMENTS = [
    "Lawful Good",
    "Neutral Good",
    "Chaotic Good",

    "Lawful Neutral",
    "True Neutral",
    "Chaotic Neutral",

    "Lawful Evil",
    "Neutral Evil",
    "Chaotic Evil"
];


/* =========================================================
   RACES
========================================================= */

const RACES = {

    /* -----------------------------------------------------
       DWARF
    ----------------------------------------------------- */

    "Dwarf": {
        languages: ["Common", "Dwarvish"],
        fixed: {
            CON: 2
        },

        subs: {

            "Hill Dwarf": {
                WIS: 1
            },

            "Mountain Dwarf": {
                STR: 2
            },

            "Duergar": {
                STR: 1
            }

        },

        skills: []
    },


    /* -----------------------------------------------------
       ELF
    ----------------------------------------------------- */

    "Elf": {
        languages: ["Common", "Elvish"],
        fixed: {
            DEX: 2
        },

        subs: {

            "High Elf": {
                INT: 1
            },

            "Wood Elf": {
                WIS: 1
            },

            "Drow": {
                CHA: 1
            }

        },

        skills: [
            "Perception"
        ]
    },


    /* -----------------------------------------------------
       HALFLING
    ----------------------------------------------------- */

    "Halfling": {
        languages: ["Common", "Halfling"],
        fixed: {
            DEX: 2
        },

        subs: {

            "Lightfoot Halfling": {
                CHA: 1
            },

            "Stout Halfling": {
                CON: 1
            }

        },

        skills: []
    },


    /* -----------------------------------------------------
       HUMAN
    ----------------------------------------------------- */

    "Human": {
        languages: ["Common"],
        languageChoices: 1,
        fixed: {
            STR: 1,
            DEX: 1,
            CON: 1,
            INT: 1,
            WIS: 1,
            CHA: 1
        },

        subs: {

            "Human": {},

            "Variant Human": {}

        },

        skills: []
    },


    /* -----------------------------------------------------
       DRAGONBORN

       All Dragonborn variants are intentionally grouped
       under one race and exposed as subraces/variants.

       The base 2014 Dragonborn retains:
           STR +2
           CHA +1

       Fizban variants:
           Chromatic Dragonborn
           Metallic Dragonborn
           Gem Dragonborn
    ----------------------------------------------------- */

    "Dragonborn": {
        languages: ["Common", "Draconic"],
        fixed: {
            STR: 2,
            CHA: 1
        },

        subs: {

            "Dragonborn": {},

            "Chromatic Dragonborn": {},

            "Metallic Dragonborn": {},

            "Gem Dragonborn": {}

        },

        skills: []
    },


    /* -----------------------------------------------------
       GNOME
    ----------------------------------------------------- */

    "Gnome": {
        languages: ["Common", "Gnomish"],
        fixed: {
            INT: 2
        },

        subs: {

            "Forest Gnome": {
                DEX: 1
            },

            "Rock Gnome": {
                CON: 1
            },

            "Svirfneblin": {
                DEX: 1
            }

        },

        skills: []
    },


    /* -----------------------------------------------------
       HALF-ELF
    ----------------------------------------------------- */

    "Half-Elf": {
        languages: ["Common", "Elvish"],
        languageChoices: 1,
        fixed: {
            CHA: 2
        },

        subs: {

            "Half-Elf": {}

        },

        skills: [
            "2 CHOICE"
        ]
    },


    /* -----------------------------------------------------
       HALF-ORC
    ----------------------------------------------------- */

    "Half-Orc": {
        languages: ["Common", "Orc"],
        fixed: {
            STR: 2,
            CON: 1
        },

        subs: {

            "Half-Orc": {}

        },

        skills: [
            "Intimidation"
        ]
    },


    /* -----------------------------------------------------
       TIEFLING
    ----------------------------------------------------- */

    "Tiefling": {
        languages: ["Common", "Infernal"],
        fixed: {
            INT: 1,
            CHA: 2
        },

        subs: {

            "Tiefling": {}

        },

        skills: []
    },


    /* -----------------------------------------------------
       GOLIATH
    ----------------------------------------------------- */

    "Goliath": {
        languages: ["Common", "Giant"],
        fixed: {
            STR: 2,
            CON: 1
        },

        subs: {

            "Goliath": {}

        },

        skills: []
    },


    /* -----------------------------------------------------
       GENASI
    ----------------------------------------------------- */

    "Genasi": {
        languages: ["Common", "Primordial"],
        fixed: {
            CON: 2
        },

        subs: {

            "Air Genasi": {
                DEX: 1
            },

            "Earth Genasi": {
                STR: 1
            },

            "Fire Genasi": {
                INT: 1
            },

            "Water Genasi": {
                WIS: 1
            }

        },

        skills: []
    },


    /* -----------------------------------------------------
       AASIMAR
    ----------------------------------------------------- */

    "Aasimar": {
        languages: ["Common", "Celestial"],
        fixed: {
            CHA: 2
        },

        subs: {

            "Protector Aasimar": {
                WIS: 1
            },

            "Scourge Aasimar": {
                CON: 1
            },

            "Fallen Aasimar": {
                STR: 1
            }

        },

        skills: []
    },


    /* -----------------------------------------------------
       GITH
    ----------------------------------------------------- */

    "Gith": {
        languages: ["Common", "Gith"],
        fixed: {
            INT: 1
        },

        subs: {

            "Githyanki": {
                STR: 2
            },

            "Githzerai": {
                WIS: 2
            }

        },

        skills: []
    },


    /* -----------------------------------------------------
       TABAXI
    ----------------------------------------------------- */

    "Tabaxi": {
        languages: ["Common"],
        fixed: {
            DEX: 2,
            CHA: 1
        },

        subs: {

            "Tabaxi": {}

        },

        skills: []
    },


    /* -----------------------------------------------------
       KOBOLD
    ----------------------------------------------------- */

    "Kobold": {
        languages: ["Common", "Draconic"],
        fixed: {
            DEX: 2
        },

        subs: {

            "Kobold": {}

        },

        skills: []
    }

};


/* =========================================================
   CLASSES
========================================================= */

const CLASSES = {


    /* =====================================================
       BARBARIAN
    ===================================================== */

    "Barbarian": {

        subs: [

            /* Player's Handbook */

            "Path of the Berserker",
            "Path of the Totem Warrior",

            /* Xanathar's Guide to Everything */

            "Path of the Ancestral Guardian",
            "Path of the Storm Herald",
            "Path of the Zealot",

            /* Tasha's Cauldron of Everything */

            "Path of the Beast",
            "Path of Wild Magic",

            /* Bigby Presents: Glory of the Giants */

            "Path of the Giant"

        ],

        skills: [
            "Animal Handling",
            "Athletics",
            "Intimidation",
            "Nature",
            "Perception",
            "Survival"
        ],

        n: 2,

        saves: [
            "STR",
            "CON"
        ]
    },


    /* =====================================================
       BARD
    ===================================================== */

    "Bard": {

        subs: [

            /* Player's Handbook */

            "College of Lore",
            "College of Valor",

            /* Xanathar's Guide to Everything */

            "College of Glamour",
            "College of Swords",
            "College of Whispers",

            /* Tasha's Cauldron of Everything */

            "College of Creation",
            "College of Eloquence",

            /* The Book of Many Things */

            "College of Dance"

        ],

        skills: [
        "Acrobatics",
        "Animal Handling",
        "Arcana",
        "Athletics",
        "Deception",
        "History",
        "Insight",
        "Intimidation",
        "Investigation",
        "Medicine",
        "Nature",
        "Perception",
        "Performance",
        "Persuasion",
        "Religion",
        "Sleight of Hand",
        "Stealth",
        "Survival",
        ],

        n: 3,

        saves: [
            "DEX",
            "CHA"
        ]
    },


    /* =====================================================
       CLERIC
    ===================================================== */

    "Cleric": {

        subs: [

            /* Player's Handbook */

            "Knowledge Domain",
            "Life Domain",
            "Light Domain",
            "Nature Domain",
            "Tempest Domain",
            "Trickery Domain",
            "War Domain",

            /* Xanathar's Guide to Everything */

            "Forge Domain",
            "Grave Domain",

            /* Tasha's Cauldron of Everything */

            "Order Domain",
            "Peace Domain",
            "Twilight Domain"

        ],

        skills: [
            "History",
            "Insight",
            "Medicine",
            "Persuasion",
            "Religion"
        ],

        n: 2,

        saves: [
            "WIS",
            "CHA"
        ]
    },


    /* =====================================================
       DRUID
    ===================================================== */

    "Druid": {

        subs: [

            /* Player's Handbook */

            "Circle of the Land",
            "Circle of the Moon",

            /* Xanathar's Guide to Everything */

            "Circle of Dreams",
            "Circle of the Shepherd",

            /* Tasha's Cauldron of Everything */

            "Circle of Spores",
            "Circle of Stars",
            "Circle of Wildfire"

        ],

        skills: [
            "Arcana",
            "Animal Handling",
            "Insight",
            "Medicine",
            "Nature",
            "Perception",
            "Religion",
            "Survival"
        ],

        n: 2,

        saves: [
            "INT",
            "WIS"
        ]
    },


    /* =====================================================
       FIGHTER
    ===================================================== */

    "Fighter": {

        subs: [

            /* Player's Handbook */

            "Champion",
            "Battle Master",
            "Eldritch Knight",

            /* Xanathar's Guide to Everything */

            "Arcane Archer",
            "Cavalier",
            "Samurai",

            /* Tasha's Cauldron of Everything */

            "Rune Knight"

        ],

        skills: [
            "Acrobatics",
            "Animal Handling",
            "Athletics",
            "History",
            "Insight",
            "Intimidation",
            "Perception",
            "Survival"
        ],

        n: 2,

        saves: [
            "STR",
            "CON"
        ]
    },


    /* =====================================================
       MONK
    ===================================================== */

    "Monk": {

        subs: [

            /* Player's Handbook */

            "Way of the Open Hand",
            "Way of Shadow",
            "Way of the Four Elements",

            /* Xanathar's Guide to Everything */

            "Way of the Drunken Master",
            "Way of the Kensei",
            "Way of the Sun Soul",

            /* Tasha's Cauldron of Everything */

            "Way of Mercy",
            "Way of the Astral Self",

            /* Fizban's Treasury of Dragons */

            "Way of the Ascendant Dragon"

        ],

        skills: [
            "Acrobatics",
            "Athletics",
            "History",
            "Insight",
            "Religion",
            "Stealth"
        ],

        n: 2,

        saves: [
            "STR",
            "DEX"
        ]
    },


    /* =====================================================
       PALADIN
    ===================================================== */

    "Paladin": {

        subs: [

            /* Player's Handbook */

            "Oath of Devotion",
            "Oath of the Ancients",
            "Oath of Vengeance",

            /* Xanathar's Guide to Everything */

            "Oath of Conquest",
            "Oath of Redemption",

            /* Tasha's Cauldron of Everything */

            "Oath of Glory",
            "Oath of the Watchers"

        ],

        skills: [
            "Athletics",
            "Insight",
            "Intimidation",
            "Medicine",
            "Persuasion",
            "Religion"
        ],

        n: 2,

        saves: [
            "WIS",
            "CHA"
        ]
    },


    /* =====================================================
       RANGER
    ===================================================== */

    "Ranger": {

        subs: [

            /* Player's Handbook */

            "Hunter",
            "Beast Master",

            /* Xanathar's Guide to Everything */

            "Gloom Stalker",
            "Horizon Walker",
            "Monster Slayer",

            /* Tasha's Cauldron of Everything */

            "Fey Wanderer",
            "Swarmkeeper",

            /* Fizban's Treasury of Dragons */

            "Drakewarden"

        ],

        skills: [
            "Animal Handling",
            "Athletics",
            "Insight",
            "Investigation",
            "Nature",
            "Perception",
            "Stealth",
            "Survival"
        ],

        n: 3,

        saves: [
            "STR",
            "DEX"
        ]
    },


    /* =====================================================
       ROGUE
    ===================================================== */

    "Rogue": {

        subs: [

            /* Player's Handbook */

            "Thief",
            "Assassin",
            "Arcane Trickster",

            /* Xanathar's Guide to Everything */

            "Inquisitive",
            "Mastermind",
            "Scout",
            "Swashbuckler",

            /* Tasha's Cauldron of Everything */

            "Phantom",
            "Soulknife"

        ],

        skills: [
            "Acrobatics",
            "Athletics",
            "Deception",
            "Insight",
            "Intimidation",
            "Investigation",
            "Perception",
            "Performance",
            "Persuasion",
            "Sleight of Hand",
            "Stealth"
        ],

        n: 4,

        saves: [
            "DEX",
            "INT"
        ],

        expertise: true
    },


    /* =====================================================
       SORCERER
    ===================================================== */

    "Sorcerer": {

        subs: [

            /* Player's Handbook */

            "Draconic Bloodline",
            "Wild Magic",

            /* Xanathar's Guide to Everything */

            "Divine Soul",
            "Shadow Magic",
            "Storm Sorcery",

            /* Tasha's Cauldron of Everything */

            "Aberrant Mind",
            "Clockwork Soul"

        ],

        skills: [
            "Arcana",
            "Deception",
            "Insight",
            "Intimidation",
            "Persuasion",
            "Religion"
        ],

        n: 2,

        saves: [
            "CON",
            "CHA"
        ]
    },


    /* =====================================================
       WARLOCK
    ===================================================== */

    "Warlock": {

        subs: [

            /* Player's Handbook */

            "Archfey",
            "Fiend",
            "Great Old One",

            /* Xanathar's Guide to Everything */

            "The Celestial",
            "The Hexblade",

            /* Tasha's Cauldron of Everything */

            "The Fathomless",
            "The Genie"

        ],

        skills: [
            "Arcana",
            "Deception",
            "History",
            "Intimidation",
            "Investigation",
            "Nature",
            "Religion"
        ],

        n: 2,

        saves: [
            "WIS",
            "CHA"
        ]
    },


    /* =====================================================
       WIZARD
    ===================================================== */

    "Wizard": {

        subs: [

            /* Player's Handbook */

            "School of Abjuration",
            "School of Conjuration",
            "School of Divination",
            "School of Enchantment",
            "School of Evocation",
            "School of Illusion",
            "School of Necromancy",
            "School of Transmutation",

            /* Xanathar's Guide to Everything */

            "War Magic",

            /* Tasha's Cauldron of Everything */

            "Bladesinging",
            "Order of Scribes"

        ],

        skills: [
            "Arcana",
            "History",
            "Insight",
            "Investigation",
            "Medicine",
            "Religion"
        ],

        n: 2,

        saves: [
            "INT",
            "WIS"
        ]
    }

};


/* =========================================================
   BACKGROUND SKILL PROFICIENCIES
========================================================= */

const BACKGROUND_SKILLS = {

    "Acolyte": [
        "Insight",
        "Religion"
    ],

    "Charlatan": [
        "Deception",
        "Sleight of Hand"
    ],

    "Criminal": [
        "Deception",
        "Stealth"
    ],

    "Entertainer": [
        "Acrobatics",
        "Performance"
    ],

    "Folk Hero": [
        "Animal Handling",
        "Survival"
    ],

    "Guild Artisan": [
        "Insight",
        "Persuasion"
    ],

    "Hermit": [
        "Medicine",
        "Religion"
    ],

    "Noble": [
        "History",
        "Persuasion"
    ],

    "Outlander": [
        "Athletics",
        "Survival"
    ],

    "Sage": [
        "Arcana",
        "History"
    ],

    "Sailor": [
        "Athletics",
        "Perception"
    ],

    "Soldier": [
        "Athletics",
        "Intimidation"
    ],

    "Urchin": [
        "Sleight of Hand",
        "Stealth"
    ]

};


/* =========================================================
   BACKGROUNDS
========================================================= */

const BACKGROUNDS = [

    /* Player's Handbook */
    "Acolyte",
    "Charlatan",
    "Criminal",
    "Entertainer",
    "Folk Hero",
    "Guild Artisan",
    "Hermit",
    "Noble",
    "Outlander",
    "Sage",
    "Sailor",
    "Soldier",
    "Urchin",
    /* Custom */
    "Custom"
];


/* =========================================================
   BACKGROUND LANGUAGES
   Only standard languages are offered as choices.
========================================================= */

const BACKGROUND_LANGUAGES = {
    "Acolyte": { choices: 2 },
    "Charlatan": { choices: 1 },
    "Criminal": { choices: 1 },
    "Entertainer": { choices: 1 },
    "Folk Hero": { choices: 1 },
    "Guild Artisan": { choices: 1 },
    "Hermit": { choices: 1 },
    "Noble": { choices: 1 },
    "Outlander": { choices: 1 },
    "Sage": { choices: 2 },
    "Sailor": { choices: 0 },
    "Soldier": { choices: 0 },
    "Urchin": { choices: 0 },
    "Custom": { choices: 2 }
};

const STANDARD_LANGUAGES = [
    "Common",
    "Dwarvish",
    "Elvish",
    "Giant",
    "Gnomish",
    "Goblin",
    "Halfling",
    "Orc"
];

/* =========================================================
   APPLICATION DATA EXPORT
========================================================= */

window.DATA = {
    abilities: ABILITIES,
    skills: SKILLS,
    alignments: ALIGNMENTS,
    races: RACES,
    classes: CLASSES,
    backgrounds: BACKGROUNDS,
    backgroundSkills: BACKGROUND_SKILLS,
    backgroundLanguages: BACKGROUND_LANGUAGES,
    standardLanguages: STANDARD_LANGUAGES

};
/* =========================================================
   DERIVED 5E REFERENCE DATA
   Kept separate from the selectable content above so the
   content tables remain easy to edit.
========================================================= */

const SKILL_ABILITIES = {
  "Acrobatics":"DEX", "Animal Handling":"WIS", "Arcana":"INT",
  "Athletics":"STR", "Deception":"CHA", "History":"INT",
  "Insight":"WIS", "Intimidation":"CHA", "Investigation":"INT",
  "Medicine":"WIS", "Nature":"INT", "Perception":"WIS",
  "Performance":"CHA", "Persuasion":"CHA", "Religion":"INT",
  "Sleight of Hand":"DEX", "Stealth":"DEX", "Survival":"WIS"
};

const CLASS_REFERENCE = {
  Barbarian: { hitDie:12, armor:["Light armor","Medium armor","Shields"], weapons:["Simple weapons","Martial weapons"], tools:[], feature:"Rage, Unarmored Defense" },
  Bard: { hitDie:8, armor:["Light armor"], weapons:["Simple weapons","Hand crossbows","Longswords","Rapiers","Shortswords"], tools:["Three musical instruments"], feature:"Bardic Inspiration, Spellcasting" },
  Cleric: { hitDie:8, armor:["Light armor","Medium armor","Shields"], weapons:["Simple weapons"], tools:[], feature:"Spellcasting, Divine Domain" },
  Druid: { hitDie:8, armor:["Light armor (nonmetal)","Medium armor (nonmetal)"], weapons:["Clubs","Daggers","Darts","Javelins","Maces","Quarterstaffs","Scimitars","Sickles","Slings","Spears"], tools:["Herbalism kit"], feature:"Druidic, Spellcasting" },
  Fighter: { hitDie:10, armor:["All armor","Shields"], weapons:["Simple weapons","Martial weapons"], tools:[], feature:"Fighting Style, Second Wind" },
  Monk: { hitDie:8, armor:[], weapons:["Simple weapons","Shortswords"], tools:["One artisan's tool or musical instrument"], feature:"Unarmored Defense, Martial Arts" },
  Paladin: { hitDie:10, armor:["All armor","Shields"], weapons:["Simple weapons","Martial weapons"], tools:[], feature:"Divine Sense, Lay on Hands" },
  Ranger: { hitDie:10, armor:["Light armor","Medium armor","Shields"], weapons:["Simple weapons","Martial weapons"], tools:[], feature:"Favored Enemy, Natural Explorer" },
  Rogue: { hitDie:8, armor:["Light armor"], weapons:["Simple weapons","Hand crossbows","Longswords","Rapiers","Shortswords"], tools:["Thieves' tools"], feature:"Expertise, Sneak Attack, Thieves' Cant" },
  Sorcerer: { hitDie:6, armor:[], weapons:["Daggers","Darts","Slings","Quarterstaffs","Light crossbows"], tools:[], feature:"Spellcasting, Sorcerous Origin" },
  Warlock: { hitDie:8, armor:["Light armor"], weapons:["Simple weapons"], tools:[], feature:"Otherworldly Patron, Pact Magic" },
  Wizard: { hitDie:6, armor:[], weapons:["Daggers","Darts","Slings","Quarterstaffs","Light crossbows"], tools:[], feature:"Spellcasting, Arcane Recovery" }
};

const BACKGROUND_REFERENCE = {
  Acolyte:{ feature:"Shelter of the Faithful", tools:[], equipment:"Holy symbol, prayer book or prayer wheel, vestments, common clothes, pouch" },
  Charlatan:{ feature:"False Identity", tools:["Disguise kit","Forgery kit"], equipment:"Fine clothes, disguise kit, tools of the con, belt pouch" },
  Criminal:{ feature:"Criminal Contact", tools:["Thieves' tools","One gaming set"], equipment:"Crowbar, dark common clothes, hood, pouch" },
  Entertainer:{ feature:"By Popular Demand", tools:["Disguise kit","One musical instrument"], equipment:"Musical instrument, favor of an admirer, costume, pouch" },
  "Folk Hero":{ feature:"Rustic Hospitality", tools:["One artisan's tools","Vehicles (land)"], equipment:"Artisan's tools, shovel, iron pot, common clothes, pouch" },
  "Guild Artisan":{ feature:"Guild Membership", tools:["One artisan's tools"], equipment:"Artisan's tools, letter of introduction, traveler's clothes, pouch" },
  Hermit:{ feature:"Discovery", tools:["Herbalism kit"], equipment:"Scroll case, winter blanket, common clothes, herbalism kit, 5 gp" },
  Noble:{ feature:"Position of Privilege", tools:["One gaming set"], equipment:"Fine clothes, signet ring, scroll of pedigree, purse" },
  Outlander:{ feature:"Wanderer", tools:["One musical instrument"], equipment:"Staff, hunting trap, trophy, traveler's clothes, pouch" },
  Sage:{ feature:"Researcher", tools:[], equipment:"Bottle of black ink, quill, small knife, letter from dead colleague, common clothes, pouch" },
  Sailor:{ feature:"Ship's Passage", tools:["Navigator's tools","Vehicles (water)"], equipment:"Belaying pin, 50 feet of silk rope, lucky charm, common clothes, pouch" },
  Soldier:{ feature:"Military Rank", tools:["One gaming set","Vehicles (land)"], equipment:"Insignia of rank, trophy, bone dice or deck, common clothes, pouch" },
  Urchin:{ feature:"City Secrets", tools:["Disguise kit","Thieves' tools"], equipment:"Small knife, city map, pet mouse, token of parents, common clothes, pouch" },
  Custom:{ feature:"Custom Background", tools:[], equipment:"Customize starting equipment to match the background concept" }
};

DATA.skillAbilities = SKILL_ABILITIES;
DATA.classReference = CLASS_REFERENCE;
DATA.backgroundReference = BACKGROUND_REFERENCE;

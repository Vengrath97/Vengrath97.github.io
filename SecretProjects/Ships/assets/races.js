const RACE_NAMING=Object.freeze({
Race1:{name:"Terran",pattern:"[Project/Program] + [tactical or aspirational codename]",examples:["Aegis", "Vanguard", "Pinnacle"]},
Race2:{name:"Turian",pattern:"[military designation] + [rank/formation/fortification term]",examples:["Legion", "Bulwark", "Centurion"]},
Race3:{name:"Aasari",pattern:"[single evocative word from a poetic/natural concept]",examples:["Aurora", "Elysian", "Seraph"]},
Race4:{name:"Quarian",pattern:"[technical/system term] + [functional identifier]",examples:["Q-Vector", "Relay", "Patchwork"]},
Race5:{name:"Hanar",pattern:"[simple concrete noun]",examples:["Wisp", "Hammer", "Crown"]}
});
const RACES=Object.freeze(Object.fromEntries(Object.entries(RACE_NAMING).map(([id,v])=>[id,v.name])));
const RACE_PHILOSOPHY=Object.freeze({Race1:"Duże, lecz wolniej regenerujące się osłony; jedna główna broń większa od standardu i kilka mniejszych. Mocna faza alpha strike, słabsza wydajność w długim starciu.",Race2:"Twardy kadłub, małe osłony i wiele dział o standardowym rozmiarze. Generator pozwala pracować przy około 95–100% nominalnej wydajności.",Race3:"Bardzo słaby kadłub, bardzo mocne osłony. Zwykle jeden typ uzbrojenia oraz niewiele, ale bardzo dobrych modułów wsparcia.",Race4:"Słaby kadłub, przeciętne osłony i znakomita regeneracja. Bardzo dobre systemy wsparcia, lecz poniżej średniej siła ognia.",Race5:"Bardzo mocny kadłub, przeciętne osłony o powolnej regeneracji i wiele małych dział. Wysoka łączna siła ognia, słabe wsparcie."});
function raceName(id){return RACES[id]||id;}
function raceNaming(id){return RACE_NAMING[id]||null;}

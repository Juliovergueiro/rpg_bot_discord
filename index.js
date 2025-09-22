import 'dotenv/config';

import Discord from "discord.js";
import { readFileSync, writeFileSync } from "fs";
const db = loadDB();
const skills = loadSkills()
const token = ;
const rpgBot = new Discord.Client();
rpgBot.login(token)

import { Client, MessageAttachment } from 'discord.js';
import { drawBattleCard } from './battleCard.js';
import { deflateRaw } from 'zlib';

rpgBot.on("ready", () => {
  console.log("Pronto!");
});

function loadDB() {
  return JSON.parse(readFileSync('./data/usuarios.json', 'utf8'));
}

function loadSkills() {
  return JSON.parse(readFileSync('./data/skills.json', "utf8"));
}

function customStringify(db) {
  return '[\n' + db.map(obj => {
    const entries = Object.entries(obj).map(([k, v]) => {
      if (Array.isArray(v)) {
        return `"${k}": [\n${v.map(item => `    "${item}"`).join(',\n')}\n  ]`;
      } else {
        return `"${k}": ${JSON.stringify(v)}`;
      }
    });
    return '  {\n    ' + entries.join(', ') + '\n  }';
  }).join(',\n') + '\n]';
}

function saveDB(db) {
  writeFileSync('./data/usuarios.json', customStringify(db));
  writeFileSync('./data/skills.json', customStringify(skills));
}

function critSystem(a) {

return a += Math.ceil(a / 2);

}

function messageDamage(msg) {

msg.channel.send(`${critSystem(5)}`)

}

function rollDice(min, max) {

return min + Math.floor(Math.random() * (max - min + 1));

}

rpgBot.on("message", (msg) => {

let inicioComando = msg.content.toUpperCase().split(" ")[0];
let nomePersonagem = msg.content.split(" ").splice(1, 5).join(" ");
nomePersonagem = nomePersonagem.charAt(0).toUpperCase() + nomePersonagem.slice(1).toLowerCase();
let idMember = msg.member.id;

let Skill = skills.find(s => s.Cmd === inicioComando) || 0;
let Enemy = db.find(u => u.Name === nomePersonagem) || db.find(u => u.Name === "Targeta certo KRL"); // Personagem sendo alvo
let ownChar = personagemLogado(idMember) || 0;
let Attacker = db.find(u => u.Name === ownChar.enemyName) || 0;

let Atk = ownChar[Skill.atkMod];
let Def = Skill.Type === "Dodge" ? ownChar.Spd : ownChar.Rfx

let Per = ownChar.Int;

let attackRoll = rollDice(1, 12);
let defenseRoll = rollDice(1, 12);

let Diff = attackRoll - defenseRoll;

let advText = "";

let dmgRoll = rollDice(Skill.Dices, Skill.Value)
let Dmg = ownChar[Skill.dmgMod];
let enemyDmg = ownChar.enemyDmg
let Reduc = 0;

function personagemLogado (idMember) {
let personagem = db.find(u => u.idMembro === idMember);
return personagem ? personagem : false;
}

async function loadEffects() {

// tabela de efeitos

// cria um único pra cada

}

function resetTemps() {

// Resets some Temporary modifiers

if(ownChar.Name !== Enemy.Name){



}

if(Enemy.Name !== ownChar.Name){



}

}

async function battleTurn() {

  const buffer = await drawBattleCard(ownChar, Enemy);

  const attachment = new MessageAttachment(buffer, './img/battle.png');
  await msg.channel.send({ files: [attachment] });
}

async function actionRoll() {

loadEffects()

Enemy.enemyName = ownChar.Name; Enemy.enemyAtkDmg = Skill.atkDmg + Dmg; Enemy.enemyAtk = Atk + attackRoll; Enemy.enemyDmg = Dmg + dmgRoll; Enemy.enemySkill = Skill.Cmd;

ownChar.Ap -= Skill.apCost;

let endTurnText = ""

if(ownChar.Ap === 0){

endTurnText = `O Turno de **${ownChar.Name} acabou.`

}

if(ownChar.Ap < 0) {

ownChar.Ap += Skill.ApCost

msg.channel.send(`Insufficient AP.`)

} else {

await battleTurn()

msg.channel.send(`
\u200B        **${ownChar.Name}** attacked **${Enemy.Name}** with: **${Skill.Name}**!

        **${ownChar.Name}** Attack Roll: ${Atk} + **${attackRoll}** = ${Atk + attackRoll}, Damage Roll: ${Dmg} + **${dmgRoll}** = ${Dmg + dmgRoll}
${endTurnText}
`)

}
}

function reactionRoll() {

loadEffects()

let defTry = (Def + defenseRoll) - ownChar.enemyAtk

let dmgForm = (enemyDmg - Reduc) < 0 ? 0 : (enemyDmg - Reduc);

let defType = Skill.Type

let defDmg = defType === "Dodge" ? `**${dmgForm}** Vitality` : `**${Math.floor(ownChar.enemyAtkDmg / 2)}** Posture`

//if enemyname effects direct hit, defdmg é sobreescrito

let defText = "";

defTry >= 0 ? defText = `**${ownChar.Name}** reaction was a **Success**!` : defText = `**${ownChar.Name}** took ${defDmg} Damage [${ownChar.Post} / ].`

if(defTry < 0){

//if ! enemyname effects direct hit, pd prosseguir com o dano abaixo

defType === "Dodge" ? ownChar.Vit -= dmgForm : ownChar.Post -= Math.floor(ownChar.enemyAtkDmg / 2);

// else, dá o dano de direct hit

}

msg.channel.send(`**${ownChar.Name}** used **${Skill.Name}** and Rolled: ${Def} + ${defenseRoll} = **${Def + defenseRoll}** 🎲🎲🎲

${defText}
`)

// perde vitality se a def for dodge, perde posture se a def for parry, perde os dois se o ataque tiver sido direct hit (lê nos perks do oponente, os perks é o lugar de coisa temporária tb)

ownChar.enemyName = ""; ownChar.enemyAtk = 0; ownChar.enemyAtkDmg = 0; ownChar.enemyDmg = 0; ownChar.enemySkill = "";

}

function fatalRoll() {

}

function loadTypes() {

if(Skill.Category === "LOGIN"){

let user1 = db.find(u => u.idPersonagem === Enemy.idPersonagem);
if (user1) user1.idMembro = idMember;

let user2 = db.find(u => u.idPersonagem === ownChar.idPersonagem);
if (user2) user2.idMembro = null;

msg.channel.send(`Logged in: **${Enemy.Name}**!`)
}

if(Skill.Category === "UPDATE"){

if(Skill.Cmd === "VIG"){

ownChar.Vig = Number(nomePersonagem)

}

if(Skill.Cmd === "STR"){

ownChar.Str = Number(nomePersonagem)

}

if(Skill.Cmd === "DEX"){

ownChar.Dex = Number(nomePersonagem)

}

if(Skill.Cmd === "SPD"){

ownChar.Spd = Number(nomePersonagem)

}

if(Skill.Cmd === "RFX"){

ownChar.Rfx = Number(nomePersonagem)

}

if(Skill.Cmd === "INT"){

ownChar.Int = Number(nomePersonagem)

}

ownChar.maxHp = ownChar.Vig*10;
ownChar.Hp = ownChar.Vig*10;
ownChar.maxMp = ownChar.Int*5;
ownChar.Mp = ownChar.Int*5;
ownChar.maxAp = Math.floor(ownChar.Spd * 0.2) + 1;
ownChar.Ap = Math.floor(ownChar.Spd * 0.2) + 1;
ownChar.maxRp = Math.floor(ownChar.Rfx * 0.2) + 1
ownChar.Rp = Math.floor(ownChar.Rfx * 0.2) + 1

}

if(Skill.Category === "START"){

// faz uma lista baseado na ini (spd * 0.33) so pra ter ordem de rodar dados msm, vai rodando p kd um com loop

}

if(Skill.Category === "FULLHEAL"){

Enemy.Hp = Enemy.maxHp;
Enemy.Mp = Enemy.maxMp;

}

if(Skill.Category === "ATTACK"){

actionRoll()

}

if(Skill.Category === "DEFENSE"){

reactionRoll()

}

if(Skill.Category === "MANEUVER"){

}

if(Skill.Category === "REACTION"){
}

}

if (inicioComando === Skill.Cmd) {

loadTypes()

}

saveDB(db);

}

);
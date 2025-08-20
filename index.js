import 'dotenv/config';

import Discord from "discord.js";
import { readFileSync, writeFileSync } from "fs";
const db = loadDB();
const skills = loadSkills()

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
let idMember = msg.member.id;

let Skill = skills.find(s => s.Cmd === inicioComando) || 0;
let Enemy = db.find(u => u.Name === nomePersonagem) || db.find(u => u.Name === "Dummy"); // Personagem sendo alvo
let ownChar = personagemLogado(idMember) || 0;

let PS = Math.floor(ownChar.Str * 1 + ownChar.Vig * 0.33); // Physical Strength
let MS = Math.floor(ownChar.Int * 0.5) // Magical Strength

let Ini = Math.floor(ownChar.Spd * 0.33); // Initiative, Bonus de atk a curta dist
let Prec = Math.floor(ownChar.Dex * 0.33); // Precision, Bonus de atk a longa dist

let Atk = Math.floor(ownChar.Dex * 0.5);
let Def = Math.floor(Enemy.Rfx * 0.5 + Enemy.Spd * 0.33);

let DR = Math.floor(Enemy.Vig * 0.5); // Damage Reduction
let Prof = Math.floor(ownChar.Int * 0.33);
let Per = Math.floor(ownChar.Int * 0.5);

let attackRoll = rollDice(1, 12) + Atk;
let defenseRoll = rollDice(1, 12) + Def;

let Diff = attackRoll - defenseRoll;

let advText = "";

function personagemLogado (idMember) {
let personagem = db.find(u => u.idMembro === idMember);
return personagem ? personagem : false;
}

function damageCalc() {

let RS = 0; // Relevant Strength

if (Skill.Factor === "Physical") { RS += PS };

//if (Skill.Factor === "Physical"){

//RS += PS;

//}

if (Skill.Factor === "Magical") { RS += MS };

let Dmg = rollDice(Skill.Dices, Skill.Value) + RS
let Reduc = DR;

let dmgForm = (Dmg - Reduc) < 0 ? 0 : (Dmg - Reduc);

Enemy.Hp -= dmgForm

return dmgForm;

}

function loadEffects() {

// tabela de efeitos

// cria um único pra cada

}

function actionRoll() {

loadEffects() // já vai receber o damagecalc

// Adv e Disadv tem um Valor: 1 é Small, 2 é Medium, 3 é High e 4 é Critical.

if(Diff >= 1 && Diff <= 4) {

ownChar.Adv = 1;
Enemy.Disadv = -1;

ownChar.Disadv = 0;
Enemy.Adv = 0;

advText = "Small";

}

if(Diff >= 5 && Diff <= 8) {

ownChar.Adv = 2;
Enemy.Disadv = -2;

ownChar.Disadv = 0;
Enemy.Adv = 0;

advText = "Medium";

}

if(Diff >= 9 && Diff <= 11) {

ownChar.Adv = 3;
Enemy.Disadv = -3;

ownChar.Disadv = 0;
Enemy.Adv = 0;

advText = "High";

}

if(Diff >= 12) {

ownChar.Adv = 4;
Enemy.Disadv = -4;

ownChar.Disadv = 0;
Enemy.Adv = 0;

advText = "Critical";

}

if (Diff <= 0 && Diff >= -4) {

Enemy.Adv = 1;
ownChar.Disadv = -1;

ownChar.Adv = 0;
Enemy.Disadv = 0;

advText = "Small";

}

if (Diff <= -5 && Diff >= -8) {

Enemy.Adv = 2;
ownChar.Disadv = -2;

ownChar.Adv = 0;
Enemy.Disadv = 0;

advText = "Medium";

}

if (Diff <= -9 && Diff >= -11) {

Enemy.Adv = 3;
ownChar.Disadv = -3;

ownChar.Adv = 0;
Enemy.Disadv = 0;

advText = "High";

}

if (Diff <= -12) {

Enemy.Adv = 4;
ownChar.Disadv = -4;

ownChar.Adv = 0;
Enemy.Disadv = 0;

advText = "Critical";

}

// if skill ?effect??style? maneuver

if (Diff > 0){

const Dmg = damageCalc();

msg.channel.send(`**${ownChar.Name}** attacked **${Enemy.Name}** with: **Basic Attack**!

**${ownChar.Name}** rolled Attack: ${Atk} + **${attackRoll - Atk}** = __**${attackRoll}**__

**${Enemy.Name}** rolled Defense: ${Def} + **${defenseRoll - Def}** = __**${defenseRoll}**__

**${ownChar.Name}** hit with a **${advText} Advantage**! **${ownChar.Name}** dealt **${Dmg}** Damage, reducing **${Enemy.Name}** to **${Enemy.Hp}** Health Points!`)

}

if (Diff <= 0){

msg.channel.send(`**${ownChar.Name}** attacked **${Enemy.Name}** with: **Basic Attack**!

Attack Roll: ${Atk} + **${attackRoll - Atk}** X. **${defenseRoll - Def}** + ${Def}

**${ownChar.Name}** missed with a **${advText} Disadvantage**.`)

}

}

function loadTypes() {

if(Skill.Type === "LOGIN"){

let user1 = db.find(u => u.idPersonagem === Enemy.idPersonagem);
if (user1) user1.idMembro = idMember;

let user2 = db.find(u => u.idPersonagem === ownChar.idPersonagem);
if (user2) user2.idMembro = null;

msg.channel.send(`Logged in: **${Enemy.Name}**!`)
}

if(Skill.Type === "UPDATE"){

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

if(Skill.Type === "START"){

// faz uma lista baseado na ini (spd * 0.33) so pra ter ordem de rodar dados msm, vai rodando p kd um com loop

}

if(Skill.Type === "FULLHEAL"){

Enemy.Hp = Enemy.maxHp;
Enemy.Mp = Enemy.maxMp;

}

if(Skill.Type === "ATTACK"){

actionRoll()

}

if(Skill.Type === "MANEUVER"){

}

if(Skill.Type === "REACTION"){
}

}

if (inicioComando === Skill.Cmd) {

loadTypes()

}

saveDB(db);

}

);

//fs.readFile("./usuarios.json", "utf8", (err, data) => {
//  if (err) {
//    console.error(err);
//    return;
//  }
//  usuarios = JSON.parse(data).usuarios;
  // console.log(usuarios[0].nome)
//});

/*

rpgBot.on("message", (msg) => {
  let inicio_comando = msg.content.toUpperCase().split(" ")[0];
  if (inicio_comando == "LOGIN") {
    let nome_personagem = msg.content.split(" ");
    nome_personagem = nome_personagem.splice(1, 5);
    nome_personagem = nome_personagem.join(" ");

    let char = db.get("usuarios").find({ Nome: nome_personagem }).value();
    let id_member = msg.member.id;
    let deslogando = personagem_logado(id_member);
    let atualizar = null;

    db.get("usuarios")
      .find({ id_personagem: char.id_personagem })
      .assign({ id_membro: id_member })
      .value();
    db.get("usuarios")
      .find({ id_personagem: deslogando.id_personagem })
      .assign({ id_membro: atualizar })
      .value();
    db.write();
    msg.delete();
  }
});

// Command to log in a character

rpgBot.on("message", (msg) => {
  let inicio_comando = msg.content.toUpperCase().split(" ")[0];
  if (inicio_comando == "LOGIN") {
    let nome_personagem = msg.content.split(" ");
    nome_personagem = nome_personagem.splice(1, 5);
    nome_personagem = nome_personagem.join(" ");

    let char = db.get("usuarios").find({ Nome: nome_personagem }).value();
    let id_member = msg.member.id;
    let deslogando = personagem_logado(id_member);
    let atualizar = null;

    db.get("usuarios")
      .find({ id_personagem: char.id_personagem })
      .assign({ id_membro: id_member })
      .value();
    db.get("usuarios")
      .find({ id_personagem: deslogando.id_personagem })
      .assign({ id_membro: atualizar })
      .value();
    db.write();
    msg.delete();
  }
});

// How our commands will reach our characters

function personagem_existe(nome_personagem) {
  let usuario_existente = db
    .get("usuarios")
    .find({ nome: nome_personagem })
    .value();
  return usuario_existente ? true : false;
}

// Used when i want the person to target its own character

function personagem_logado(id_member) {
  let personagem = db.get("usuarios").find({ id_membro: id_member }).value();
  return personagem ? personagem : false;
}

/* Players spreadsheets, they manually chose the major attributes (força = strength, agilidade = agility...), i updated the values here for them and let the system calculate
the attributes minor values and do a final count of every attribute so they could know if they had more Level than Max Attributes. If they had more Level, they could
manually Level Up and choose more attributes


rpgBot.on("message", (msg) => {
  let inicio_comando = msg.content.toUpperCase().split(" ")[0];
  if (inicio_comando == "TABELAMODS") {
    let nome_personagem = msg.content.split(" ");
    nome_personagem = nome_personagem.splice(1, 5);
    nome_personagem = nome_personagem.join(" ");

    let char = db.get("usuarios").find({ Nome: nome_personagem }).value();
    char.Dist = "Curta";
    char.Arena = "N";
    char.Condicao = "N";
    char.Estado = "N";
    char.Fisico = "N";
    char.SobGenjutsu = "N";
    char.Terreno = "N";
    char.Campo = "N";
    char.Voo = "N";
    char.Confronto = "N";
    char.Furtivo = "N";
    char.AtkFurtivo = "N";
    char.Arma = ".";
    char.Acessorio = ".";
    char.TipoBunshin = ".";
    char.Bunshins = 0;
    char.Disfarce = ".";
    char.HP_Ativacao = 0;
    char.MP_Ativacao = 0;
    char.NomeAtivacao = ".";
    char.ElementoAtivacao = ".";
    char.Dojutsu = ".";
    char.JutsuDefensivo = 0;
    char.ValorConfronto = 0;
    char.TipoTecnica = ".";
    char.ElementoConfronto = ".";
    char.Chakurato = ".";
    char.Kuchiyose = ".";
    char.DificuldadeArena = 0;
    char.DanoCondicao = 0;
    char.ControleCondicao = 0;
    char.ControleGenjutsu = 0;
    char.Peso = 0;
    char.Protegido = "N";
    char.Protetor = "N";
    char.Argila = 0;
    char.C3Countdown = 0;
    char.C4Countdown = 0;
    char.CargasJinton = 0;
    char.KuroiKaminari = "N";
    char.AcoesBuff = 0;
    char.AcoesDebuff = 0;
    char.FATecnica = 0;
    char.FDTecnica = 0;
    char.FETecnica = 0;
    char.ACTecnica = 0;
    char.ESTecnica = 0;
    char.IniTecnica = 0;
    char.FurTecnica = 0;
    db.write();

    msg.reply("Mods Feitos!");
  }
});

// Cria um NPC com os Modificadores ideais

rpgBot.on("message", (msg) => {
  let inicio_comando = msg.content.toUpperCase().split(" ")[0];
  if (inicio_comando == "NPCCREATE") {
    let nome_personagem = msg.content.split(" ");
    nome_personagem = nome_personagem.splice(1, 5);
    nome_personagem = nome_personagem.join(" ");

    let char = db.get("usuarios").find({ nome: nome_personagem }).value();
    char.nome = nome_personagem;
    char.Max_HP = 50;
    char.HP = 50;
    char.Vig = 0;
    char.Ref = 0;
    char.Des = 0;
    char.Int = 0;
    char.Car = 0;
    char.Fri = 0;
    char.Armor = 0;
    char.Ini = 0;
    char.Fur = 0;
    char.Letalidade = 0;
    char.Precisao = 0;
    db.write();

    msg.reply("NPC Criado!");
  }
});

// My players could type this to check the character they were logged in

rpgBot.on("message", (msg) => {
  let inicio_comando = msg.content.toUpperCase().split(" ")[0];
  if (inicio_comando == "CHECK") {
    let id_member = msg.member.id;
    let ver = personagem_logado(id_member);
    msg.reply(`Vendo informações de ${ver.Nome} ${ver.Foto}

        **HP Max:** ${ver.Max_HP}, **HP Atual:** ${ver.HP}

        **MP Max:** ${ver.Max_MP}, **MP Atual:** ${ver.MP}

        **Distância Atual:** ${ver.Dist}

        **Condição:** ${ver.Condicao}, **Arena:** ${ver.Arena}

        **XP:** ${ver.XP}, **Nivel:** ${ver.Nivel}, **Pts de Atributo:** ${ver.Pts_Atributo}

        **FA:** ${ver.FA}, **Res:** ${ver.Res}, **FE:** ${ver.FE}

        **AC:** ${ver.AC}, **ES:** ${ver.ES}, **Ini:** ${ver.Ini}

        **Vigor:** ${ver.Vig}, **Destreza:** ${ver.Des}, **Vigor:** ${ver.Vig}

        **Intelecto:** ${ver.Int}, **Carisma:** ${ver.Car}, **Vontade:** ${ver.Von}`);
    msg.delete();
  }
});

rpgBot.on("message", (msg) => {
  let inicio_comando = msg.content.toUpperCase().split(" ")[0];
  if (inicio_comando == "MODS") {
    let id_member = msg.member.id;
    let ver = personagem_logado(id_member);
    msg.reply(`Vendo informações de ${ver.nome} ${ver.foto}

        **Ativação:** ${ver.MP_Ativacao}

        **Jutsu Defensivo:** ${ver.JutsuDefensivo}, **Kuchiyose:** ${ver.Kuchiyose}

        **Bunshins:** ${ver.Bunshins}

        **Peso:** ${ver.Peso}, **Voo:** ${ver.Voo}, **Chakurato:** ${ver.Chakurato}

        **FA Tecnica:** ${ver.FATecnica}, **FD Tecnica:** ${ver.FDTecnica}, **FE Tecnica:** ${ver.FETecnica}

        **AC Tecnica:** ${ver.ATArmado}, **ES Tecnica:** ${ver.DEArmado}, **AC Armado:** ${ver.ACArmado}, **ES Armado:** ${ver.ESArmado}`);
    msg.delete();
  }
});

function ConsultaFicha(nome_personagem) {
  let Ficha = db.get("usuarios").find({ nome: nome_personagem }).value();

  if (Ficha.ativo) {
    console.log("if");
    let Ativo = db.get("Ativos").find({ nome: Ficha.ativo }).value();
    console.log(Ativo);
    // db.get("usuarios").find({ nome : nome_personagem }).assign({ mp: mp_gasta}).value()
  } else {
    console.log("else");
    return Ficha;
  }
}

*/

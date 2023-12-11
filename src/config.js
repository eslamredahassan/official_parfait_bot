module.exports = {
  //------------| Bot Token |------------//
  token: process.env.token,
  clientID: process.env.clientID,
  //--------------------------------------//

  //----------| Apply embed room |---------//
  applyChannel: process.env.applyChannel,
  //--------------------------------------//

  //---------| review embed room |--------//
  finishChannel: process.env.finishChannel,
  //--------------------------------------//

  //------| Accepted member roles |-------//
  staffSun: process.env.staffSun,
  SquadSUN: process.env.SquadSUN,
  SunTest: process.env.SunTest,
  TeamSun: process.env.TeamSun,
  //--------------------------------------//

  //----| Banned member from app role |----//
  banRole: process.env.banRole,
  coolDown: process.env.coolDown,
  //--------------------------------------//

  //---------| Discord server id |--------//
  guildID: process.env.guildID,
  //--------------------------------------//

  //---| Applied member waiting role |----//
  waitRole: process.env.waitRole,
  //--------------------------------------//

  //------| Languages Roles |------//
  en_eu: process.env.en_eu,
  en_na: process.env.en_na,
  fr: process.env.fr,
  //--------------------------------------//,

  //---| accepted embed messages rooms |---//
  recruitmentChannel: process.env.recruitmentChannel,
  announcesChannel: process.env.announcesChannel,
  tryOut: process.env.tryOut,
  //--------------------------------------//

  //------| Members counter channel |------//
  channelID: process.env.channelID,
  reportBugChannel: process.env.reportBugChannel,
  dmDevChannel: process.env.dmDevChannel,
  parfaitInbox: process.env.parfaitInbox,
  log: process.env.log,
  //--------------------------------------//,

  //-----------| Developer Log |-----------//
  Dev_Log: process.env.dev_log,
  devRole: process.env.devRole,
  devRoleTest: process.env.devRoleTest,
  devID: process.env.devID,
  commandID: process.env.commandID,
  //--------------------------------------//,

  //-------------| Database |-------------//
  database: process.env.db,
  //--------------------------------------//,

  //-------------| API Keys |-------------//
  OpenAI_key: process.env.OpenAI_Key,
  Lang: process.env.Lang_Key,
  //--------------------------------------//,
};

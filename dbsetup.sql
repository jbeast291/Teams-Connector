CREATE TABLE IF NOT EXISTS verification (
    MinecraftUUID VARCHAR(50) NOT NULL,
    TeamsName TINYTEXT NOT NULL,
    LinkCode TINYTEXT NOT NULL,
    LinkDate DATETIME NOT NULL,
    PRIMARY KEY (MinecraftUUID)
);

CREATE TABLE IF NOT EXISTS minecraftCodes (
    MinecraftUUID TINYTEXT NOT NULL,
    LinkCode TINYTEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS blacklistedTeamsNames (
    TeamsName BIGINT NOT NULL,
    BlacklistReason VARCHAR(100) NOT NULL,
    PRIMARY KEY (TeamsName)
);

CREATE TABLE IF NOT EXISTS minecraftTempBanList(
   StartDate BIGINT NOT NULL,
   BanLengthDays SMALLINT NOT NULL,
   MinecraftUUID VARCHAR(50) NOT NULL,
   TempBanReason VARCHAR(100) NOT NULL,
   PRIMARY KEY (MinecraftUUID)
);
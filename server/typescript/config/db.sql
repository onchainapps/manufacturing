CREATE TABLE IF NOT EXISTS Account
(
    id INTEGER PRIMARY KEY autoincrement,
    userName CHAR(50) NOT NULL,
    password CHAR(256) NOT NULL,
    accountType CHAR(50),
    sessionType CHAR(50) NOT NULL UNIQUE,
    timeCreated TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Wallets
(
    id INTEGER PRIMARY KEY autoincrement,
    walletID CHAR(50) NOT NULL UNIQUE,
    walletName CHAR(50) NOT NULL UNIQUE,
    walletType TEXT NOT NULL,
    walletRootKey TEXT NOT NULL UNIQUE,
    timeCreated TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS WalletAccounts
(
    id INTEGER PRIMARY KEY autoincrement,
    walletID CHAR(50) NOT NULL,
    accountName CHAR(50) NOT NULL,
    accountIndex INTEGER NOT NULL,
    accountKeyPrv TEXT NOT NULL UNIQUE,
    baseAddr TEXT NOT NULL UNIQUE,
    enterpriseAddr TEXT NOT NULL UNIQUE,
    pointerAddr TEXT NOT NULL UNIQUE,
    rewardAddr TEXT NOT NULL UNIQUE,
    network TEXT NOT NULL,
    timeCreated TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Config
(
    id INTEGER PRIMARY KEY autoincrement,
    rootDir TEXT,
    serial  TEXT,
    baud TEXT,
    network TEXT,
    testNetMagic TEXT,
    autoStartSlicer TEXT,
    blockfrostApiKey CHAR(100)
);
 // insert into Config (rootDir, serial, baud, network, testNetMagic, autoStartSlicer,) values ("/home/printer/.spaceprinter/", "/dev/ttyUSB0", "115200", "testnet", "--testnet-magic 1097911063", "0")
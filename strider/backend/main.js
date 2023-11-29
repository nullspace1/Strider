const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const url = require('url');
const {ipcMain} = require('electron')

let mainWindow;

const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './backend/db/dev.sqlite'
    },
    useNullAsDefault: true
})

knex.schema.hasTable('athletes').then(exists => {
    if (!exists) {
        return knex.schema.createTable('athletes', table => {
            table.increments('id').primary();
            table.string('name');
            table.date('birthday');
            table.double('weight');
            table.string('gender');
            table.string('location');
            table.double('height')
        })
    }
})



function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    const startUrl = isDev ? 'http://localhost:3000' : url.format({
        pathname: path.join(__dirname, '../build/index.html'),
        protocol: 'file:',
        slashes: true
    });

    mainWindow.loadURL(startUrl);

    mainWindow.on('closed', function () {
        mainWindow = null;
    });


    
}

ipcMain.handle('get:athlete_identifiers', async (event,params) => {
    const athlete_values = await knex('athletes').select('id').select('name')
    return athlete_values;
})

ipcMain.handle('save:athlete', async(event,athlete) => {
    await knex('athletes').insert(athlete).onConflict('id').merge()
})

ipcMain.handle('get:athlete_full_info', async (event, athlete)  => {
    const athlete_full =await knex('athletes').select().where('id',athlete.id).first()
    return athlete_full
})






app.removeAllListeners('ready');

app.whenReady().then(createWindow);


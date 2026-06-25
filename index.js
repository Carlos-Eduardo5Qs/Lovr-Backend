require('dotenv').config();

const database = require('./src/config/Database');
const app = require('./src/config/setupServer');

function StartServer() {};

StartServer.prototype.init = async function() {
    await this.testConnectionWithDatabase();
};

StartServer.prototype.testConnectionWithDatabase = async function() {
     try {
        console.log('🔄 Aguardando banco de dados...');
        await database.testConnection();
        this.start();
    } catch (error) {
        console.error('🚨 O servidor não foi iniciado devido a falhas no banco de dados.');
        console.error(error);
        process.exit(1);
    }
};

StartServer.prototype.start = function() {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
    });
};

const server = new StartServer();
server.init();

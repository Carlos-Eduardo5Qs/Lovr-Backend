require('dotenv').config();

const mysql = require('mysql2/promise');

function Database() {
    this.pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
}

Database.prototype.testConnection = async function() {
    try {
        const conection = await this.pool.getConnection();
        await conection.query('SELECT 1');
        conection.release();
        console.log('✅ Conexão com o servidor MySQL foi estabelecida!');
        return true;
    } catch (error) {
        console.error('❌ Erro crítico: Não foi possível conectar ao banco de dados!');
        console.error(error.message);
        throw error;
    }
};

Database.prototype.execute = async function (query, params) {
    const [rows] = await this.pool.execute(query, params);
    return rows;
};

//Observação
Database.prototype.query = async function (query, params) {
    const [result] = await this.pool.query(query, params);
    return result;
};

module.exports = new Database();
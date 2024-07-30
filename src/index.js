const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const middleMan = new Sequelize(
    'acro_website',
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mariadb',
        dialectModule: require('mariadb'),
    }
)

const liveDB = new Sequelize(
    'live',
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mariadb',
        dialectModule: require('mariadb'),
    }
)

const middlemanRecord = middleMan.define('website_bans', {
    ban_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    banned_steamid: {
        type: DataTypes.STRING,
        allowNull: false
    },
    admin_steamid: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false
    },
    banned_date: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    unban_date: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ban_data: {
        type: DataTypes.TEXT('long'),
        defaultValue: "No extra data provided by the admin"
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            isIn: [[0, 1, 2, 3]]
        }
    },
    status_data: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "No extra information provided"
    },
    developer_notes: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    replicated: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: false
    }
}, {
    timestamps: false,
});

const liveRecord = liveDB.define('website_bans', {
    ban_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    banned_steamid: {
        type: DataTypes.STRING,
        allowNull: false
    },
    admin_steamid: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false
    },
    banned_date: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    unban_date: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ban_data: {
        type: DataTypes.TEXT('long'),
        defaultValue: "No extra data provided by the admin"
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            isIn: [[0, 1, 2, 3]]
        }
    },
    status_data: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "No extra information provided"
    },
    developer_notes: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    }
}, {
    timestamps: false,
});

(async () => {
    await middleMan.sync({ force: false });
    await liveDB.sync({ force: false });
})();

const replicator = async () => {
    try {
        const date = new Date();
        const time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        console.log('-------==============[ DATA REPLICATION BEGIN ]==============-------');
        console.log(`-------==============[ ${time} ]==============-------`);

        const entries = await middlemanRecord.findAll();
        for (const entry of entries) {
            await liveRecord.create({
                ban_id: entry.ban_id,
                banned_steamid: entry.banned_steamid,
                admin_steamid: entry.admin_steamid,
                reason: entry.reason,
                banned_date: entry.banned_date,
                unban_date: entry.unban_date,
                ban_data: entry.ban_data,
                status: entry.status,
                status_data: entry.status_data,
                developer_notes: entry.developer_notes
            });
        }

        middlemanRecord.destroy({ where: {} });

        await middlemanRecord.update({ replicated: true }, { where: { replicated: false } });
        console.log('-------==============[ DATA REPLICATION END ]==============-------');
        console.log('Replication complete for ' + entries.length + ' entries');
    } catch (error) {
        console.error('[FATAL] Error replicating data: ', error);
    }
}

setInterval(replicator, (5 * 60000));
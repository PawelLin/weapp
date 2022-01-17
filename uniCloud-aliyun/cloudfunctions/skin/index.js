'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
    const dbCmd = db.command
	const collection = db.collection('skin')
    const list = []
    if (event.keys) {
        const keys = event.keys.map(key => {
            key = key.toString()
            return { number: key.substr(0, 3), order: key.substr(3) }
        })
        const { total } = await collection.where(dbCmd.or(keys)).count()
        for (let i = 0; i < total; i += 100) {
            const { data } = await collection.where(dbCmd.or(keys)).skip(i).get()
            list.push(...data)
        }
    } else {
        const { total } = await collection.count()
        for (let i = 0; i < total; i += 100) {
            const { data } = await collection.skip(i).get()
            list.push(...data)
        }
    }
    return { data: list }
};

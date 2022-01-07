'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	const collection = db.collection('image')
    if (event.name) {
        const res = await collection.where({ name: event.name }).get()
        return { ...res, isExist: !!res.data.length }
    }
    if (event.type) {
        const res = await collection.where({ type: event.type }).get()
        return res
    }
    const res = await collection.get()
    return res
};

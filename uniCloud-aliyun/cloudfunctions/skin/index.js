'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	const collection = db.collection('skin')
    const res = await collection.get()
    return res
};

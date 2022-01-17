'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const collection = db.collection('skin')
    const { data } = await collection.where({ name: event.name }).get()
    if (data.length) {
        const id = data[0]._id
        const res = await collection.doc(id).set(event)
        console.log(res)
        return res
    } else {
        const res = await collection.add(event)
        return res
    }
};

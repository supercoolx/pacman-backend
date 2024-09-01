const Pay = require('../models/Pay');

module.exports.pay = async (req, res) => {
	const { tgId, wallet, txHash } = req.body;

    new Pay({ tgId, wallet, txHash }).save()
        .then(pay => {
            res.status(200).send({ pay });
            console.log('New pay:', pay);
        })
        .catch(err => res.status(401).send({ err }));
}
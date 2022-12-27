'use strict';

const prisma = require('../prismaClient');

exports.get = (req, res) =>{

    prisma.tbl_dia_semana.findMany()
    .then(
        (data) => {
            res.status(200).json(data);
        }
    )
    .catch(
        (error) => {
            res.status(500).json({ "message": error })
        }
    )
}
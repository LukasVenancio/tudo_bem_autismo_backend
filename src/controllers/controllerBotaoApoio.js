'use strict';

const prisma = require('../prismaClient');
const firebase = require('../../services/firebase')

exports.post = async (req, res) => {

    try {

        const id = parseInt(req.body.id_crianca)
        const files = req.files

        const uploads = files.map((file) => {
            return firebase.uploadFiles(file)
        })

        const types = await prisma.tbl_tipo_midia.findMany()

        const media = uploads.map(

            (upload) => {

                const type = types.find(

                    (type) => type.mimetype == upload.mimetype

                )

                return {
                    id_crianca: id,
                    midia: upload.link,
                    // nome_original: upload.originalname,
                    id_tipo_midia: parseInt(type.id)
                }
            }
        )
        // console.log(media)

        prisma.tbl_botao_apoio.createMany({

            data: media
        })
            .then(() => { res.status(201).json() })
            .catch((error) => {

                console.log(error, `-----------then`)

                if (error.code == 'P2003') {

                    res.status(400).json({ message: `Chave estrangeira inválida no campo ${error.meta.field_name}` })

                } else if (error.code == "P2000") {

                    res.status(500).json({ message: `A quantidade máxima de caracteres foi ultrapassada no campo ${error.meta.column_name}.` })

                } else {

                    const argument = error.message.split('Argument')[1]

                    if (argument) {

                        const err = argument.split('\n')[0]

                        res.status(400).json({ "message": err });

                    } else {

                        res.status(500).json({ "message": error });

                    }
                }
            })

    } catch (error) {

        console.log(error, `-----------try`)

        const e = new Error(error)
        console.log(e)
        res.status(500).json(error)
    }
}

exports.delete = async (req, res) => {

    const id = parseInt(req.params.id)

    prisma.tbl_botao_apoio.delete({

        where: {
            id: id
        }

    })
        .then(() => res.status(200).json({ message: 'Registro excluído com sucesso!' }))
        .catch((error) => {

            if (error.code == 'P2003') {

                res.status(400).json({ message: `Chave estrangeira inválida no campo ${error.meta.field_name}` })

            } else {

                const argument = error.message.split('Argument')[1]

                if (argument) {

                    const err = argument.split('\n')[0]

                    res.status(400).json({ "message": err });

                } else {

                    res.status(500).json({ "message": error });

                }
            }

        })
}

exports.get = async (req, res) => {

    const id = parseInt(req.params.id)

    prisma.tbl_botao_apoio.findMany({
        where: {
            id_crianca: id
        },
        select:{
            id:true,
            midia:true,
            // nome_original:true,
            tbl_tipo_midia:{
                select:{
                    tipo:true
                }
            }
        }
    })
        .then((data) => res.status(200).json(data))
        .catch((error) => {

            console.log(error)


            const argument = error.message.split('Argument')[1]

            if (argument) {

                const err = argument.split('\n')[0]

                res.status(400).json({ "message": err });

            } else {

                res.status(500).json({ "message": error });

            }
        })
}


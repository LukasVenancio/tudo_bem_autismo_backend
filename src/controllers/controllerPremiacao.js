'use strict';

const prisma = require('../prismaClient');

exports.get = async (req, res, next) => {

    const id = req.params.id;

    const premiacoes = await prisma.tbl_medalha_crianca.findMany({
        where: {
            id_crianca: parseInt(id)
        },
    })

    if (premiacoes) {

        const medalhas = await prisma.tbl_medalha.findMany()

        if (medalhas) {

            const totalPremiacoesPorMedalha = medalhas.map(

                (medalha) => {

                    const count = premiacoes.filter(

                        (premiacao) => premiacao.id_medalha == medalha.id
                    )
                    return {


                        ...medalha,
                        quantidade: count.length
                    }
                }
            )

            if(totalPremiacoesPorMedalha){

                res.status(200).json(totalPremiacoesPorMedalha)
            
            }else{

                res.status(500).json({message: 'Erro no filter'})
            }

        }else{

            res.status(500).json({message: 'Erro ao buscar as medalahas'})
        }
    
    }else{

        res.status(404).json({message: 'Esta criança não possui premiações'})
    }
}
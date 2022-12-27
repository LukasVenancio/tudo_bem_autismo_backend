'use strict';

const prisma = require('../prismaClient');

exports.post = async(req, res, next) => {

    const data = req.body;

    prisma.tbl_relatorio.create({
        
        data:{
            acertos: data.acertos,
            erros: data.erros,
            data: new Date(data.data),
            id_crianca: parseInt(data.id_crianca),
            id_mini_jogo: parseInt(data.id_mini_jogo)
        },
        select:{
                id: true,
                acertos: true,
                erros: true,
                id_crianca: true
        }

    }).then(

        async (data) => {

            const acertosPorCento = (data.acertos * 100) / (data.acertos + data.erros)

            const medals = await prisma.tbl_medalha.findMany()

            const kidAward = medals.find( medal => acertosPorCento >= medal.criterio)

            if(kidAward){

                const award = await prisma.tbl_medalha_crianca.create({

                    data:{
    
                        id_crianca: data.id_crianca,
                        id_medalha: kidAward.id
                    },
                    select:{
                        
                        id: true
                    
                    }
                })
    
                if(award){
    
                    res.status(200).json(kidAward)
    
                }else{
    
                    res.status(500).json({message: 'Não foi possível gerar a premiação'})
                }

            }else{

                res.status(200).json({message: 'Infelizmente você não ganhou uma medalha desta vez, mas não desista!'})
            }   
        }
    
    ).catch(

        (err) => {
            
            res.status(500).json({message: err})
            
        }
    )
}

exports.list = (req, res, next) => {

    const data = req.body;

    const date = new Date()
    date.setDate(date.getDate() - parseInt(data.periodo))

    prisma.tbl_relatorio.findMany({
        where:{

            id_crianca: parseInt(data.id_crianca),
            id_mini_jogo: parseInt(data.id_mini_jogo),
            data: {
                gte : date
            }
        }

    }).then(

        (result) => {

            res.status(200).json(result)
        }
    
    ).catch(

        (err) => {

            console.log(err)
            
            res.status(500).json({message: err})
            
        }
    )
}
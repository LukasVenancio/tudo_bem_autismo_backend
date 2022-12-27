'use strict';

const prisma = require('../prismaClient');

exports.post = (req, res, next) => {

    const data = req.body;

    const situacoes = data.situacoes.map((situacao) =>{

        const passoCorreto = situacao.passos[0].passo_correto == 1 ? situacao.passos[0] : situacao.passos[1] 
        const passoErrado = situacao.passos[0].passo_correto == 0 ? situacao.passos[0] : situacao.passos[1] 

        let idPassoCorreto = null
        let idPassoErrado = null

        prisma.tbl_passo.create({
            data:{
                imagem:passoCorreto.imagem,
                passo_correto: passoCorreto.passo_correto == 1 ? true : false,
                descricao: passoCorreto.descricao,
                texto: passoCorreto.texto
            },
            select:{
                id: true
            }
        }).then(
            
            (id) =>{

                idPassoCorreto = id.id
                // console.log(idPassoCorreto)
            }
        ).catch(

            (err) =>{
                console.log(err)
            }
        )
        
        prisma.tbl_passo.create({
            data:{
                imagem:passoErrado.imagem,
                passo_correto: passoErrado.passo_correto == 1 ? true : false,
                descricao: passoErrado.descricao,
                texto: passoErrado.texto
            },
            select:{
                id: true
            }
        }).then(
            
            (id) =>{
                idPassoErrado = id.id
                console.log(idPassoErrado)
            }
        ).catch(

            (err) =>{
                console.log(err)
            }
        )

        prisma.tbl_situacao_escolha.create({
            data:{
                ordem: situacao.ordem,
                dialogo: situacao.dialogo,
                imagem_exemplo: situacao.imagem_exemplo,
                cor_fundo: situacao.cor_fundo,
                imagem_fundo: situacao.imagem_fundo,
                id_mini_jogo: situacao.id_mini_jogo,
                id_passo_correto: idPassoCorreto,
                id_passo_errado: idPassoErrado
            },
            select:{
                id: true
            }
        }).then(
            (id) =>{
                res.status(200).json({"id": id})
            }
        ).catch(
            (err) => {
                console.log(err)
            }
        )
    })
}
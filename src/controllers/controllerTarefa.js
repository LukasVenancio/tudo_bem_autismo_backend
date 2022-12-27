'use strict';

const prisma = require('../prismaClient');

exports.post = async (req, res, next) => {

    const data = req.body
    let children = null
    let days = null

    if (typeof (data.id_crianca) == 'object')
        children = data.id_crianca.map(id => { return { id_crianca: parseInt(id) } })
    else
        children = { id_crianca: parseInt(data.id_crianca) }

    if (typeof (data.id_dia_semana) == 'object')
        days = data.id_dia_semana.map(id => { return { id_dia_semana: parseInt(id) } })
    else
        days = { id_dia_semana: parseInt(data.id_dia_semana) }

    prisma.tbl_tarefa.create({
        data: {
            titulo: data.titulo,
            horario: data.horario,
            id_icone: parseInt(data.id_icone),
            tbl_crianca_tarefa: {
                create: children
            },
            tbl_tarefa_dia_semana: {
                create: days
            }
        }
    }).then((tarefa) => { res.status(201).json(tarefa) }
    ).catch((error) => { res.status(500).json({ "message": error }) })
}

exports.get = async (req, res) => {

    try {

        const id = parseInt(req.params.id)

        const result = await prisma.$queryRaw`select 
            cast(tbl_tarefa.id as decimal) as id_tarefa,
            tbl_tarefa.horario,
            tbl_tarefa.titulo,
            cast(tbl_dia_semana.id as decimal) as id_dia_semana,
            tbl_dia_semana.dia,
            tbl_dia_semana.sigla,
            tbl_icone.icone,
            tbl_icone.titulo as titulo_icone,
            cast((select if(tbl_dia_semana.numero = dayofWeek(current_timestamp()), true, false)) as decimal) as hoje,
            cast((select if(date(tbl_realizacao_tarefa.data) = current_date() and hoje = 1, true, false))as decimal) as realizada
        from tbl_tarefa
            inner join tbl_tarefa_dia_semana
                on tbl_tarefa.id = tbl_tarefa_dia_semana.id_tarefa
            inner join tbl_dia_semana
                on tbl_tarefa_dia_semana.id_dia_semana = tbl_dia_semana.id
            inner join tbl_icone
                on tbl_tarefa.id_icone = tbl_icone.id
            inner join tbl_crianca_tarefa
                on tbl_tarefa.id = tbl_crianca_tarefa.id_tarefa
            inner join tbl_crianca
                on tbl_crianca_tarefa.id_crianca = tbl_crianca.id
            left join tbl_realizacao_tarefa
                on tbl_tarefa.id = tbl_realizacao_tarefa.id_tarefa
        where tbl_crianca_tarefa.id_crianca = ${id};`

        res.status(200).send(result)

    } catch (error) {
        const e = new Error(error)
        res.status(500).json(e.message)
    }
}

exports.getById = (req, res, next) => {

    const id = parseInt(req.params.id);

    prisma.tbl_tarefa.findUnique({

        where: {
            id: id
        },
        include: {
            tbl_crianca_tarefa: {
                include: {
                    tbl_crianca: true
                }
            },
            tbl_tarefa_dia_semana: {
                include: {
                    tbl_dia_semana: true
                }
            },
            tbl_icone: true
        }
    }).then((tarefa) => { res.status(201).json(tarefa) }
    ).catch((error) => { res.status(500).json({ error }) })
}

exports.delete = (req, res) => {

    const id = parseInt(req.params.id);

    prisma.tbl_tarefa.delete({
        where: {
            id: id
        }
    }).then(() => res.status(200).json({}))
        .catch((error) => res.status(500).json({ error }))
}

exports.put = async (req, res, next) => {

    try {

        const data = req.body
        let children = null
        let days = null

        if (typeof (data.id_crianca) == 'object')
            children = data.id_crianca.map(id => { return { id_crianca: parseInt(id) } })
        else
            children = { id_crianca: parseInt(data.id_crianca) }

        if (typeof (data.id_dia_semana) == 'object')
            days = data.id_dia_semana.map(id => { return { id_dia_semana: parseInt(id) } })
        else
            days = { id_dia_semana: parseInt(data.id_dia_semana) }

        const id = await prisma.tbl_tarefa.create({
            data: {
                titulo: data.titulo,
                horario: data.horario,
                id_icone: parseInt(data.id_icone),
                tbl_crianca_tarefa: {
                    create: children
                },
                tbl_tarefa_dia_semana: {
                    create: days
                }
            },
            select: {
                id: true
            }
        })

        await prisma.tbl_realizacao_tarefa.updateMany({
            where: {
                id_tarefa: parseInt(data.id_tarefa)
            },
            data: {
                id_tarefa: id.id
            }
        })

        await prisma.tbl_tarefa.delete({
            where: {
                id: parseInt(data.id_tarefa)
            }
        })

        res.status(200).json({})

    } catch (error) {

        const e = new Error(error)
        console.log(e.message)
        res.status(500).json(e.message)

    }
}

exports.completeTask = async (req, res, next) => {

    const data = req.body

    prisma.tbl_realizacao_tarefa.create({
        data: {
            id_crianca: parseInt(data.id_crianca),
            id_tarefa: parseInt(data.id_tarefa),
            data: new Date()
        }
    }).then(() => { res.status(201).json() }
    ).catch((error) => { res.status(500).json({ "message": error }) })
}

exports.getCompletedTasks = async (req, res, next) => {

    const data = req.body
    const date = new Date()
    date.setDate(date.getDate() - parseInt(data.periodo))

    prisma.tbl_realizacao_tarefa.findMany({
        where: {
            id_crianca: parseInt(data.id_crianca),
            data: {
                gte: date
            }
        },
        select: {
            id: true,
            data: true,
            tbl_tarefa: {
                select: {
                    titulo: true,
                    tbl_icone: {
                        select: {
                            icone: true,
                            titulo: true
                        }
                    }
                }
            }
        }
    }).then((data) => { res.status(200).json(data) }
    ).catch((error) => { res.status(500).json({ "message": error }) })
}
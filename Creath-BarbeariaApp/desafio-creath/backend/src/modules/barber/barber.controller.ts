import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../utils/prisma";
import { UpdateScheduleAdminInput, UpdateUserAdminInput } from "./barber.schemas";
import { CreateUserType } from "../user/user.schemas";
import { hashPassword } from "../user/user.utils";

export async function createBarber (  req: FastifyRequest<{ Body: CreateUserType }>, rep: FastifyReply) {
    const { password, ...data } = req.body
  
    try {
      const hashedPassword = await hashPassword(password);
      
      // console.log(hashedPassword)
  
      await prisma.barber.create({
        data: {
          password: hashedPassword,
          phone: data.phone,
          name: data.name || "", // Define um valor padrão para name
        },
      });
  
      return rep.code(201).send({ message: "Barbeiro registrado com sucesso!" });
  
    } catch (error) {
      return rep.code(500).send({ error: "Erro ao criar o barbeiro." });
    }
}

export async function updateBarber (req: FastifyRequest, rep:FastifyReply) {

}

export async function deleteBarber (req: FastifyRequest, rep: FastifyReply) {

}


export async function updateUserAsAdmin (
    req: FastifyRequest<{ Body: UpdateUserAdminInput }>, 
    rep: FastifyReply) {

}

export async function deleteUserAsAdmin (req: FastifyRequest, rep: FastifyReply) {
    try {

        const { phone } = req.params as { phone: string }

         // console.log(phone)

        const user = await prisma.user.delete({
            where: { phone }
        })

        if (user) {
            return rep.code(200).send({ message: "Usuário deletado com sucesso!"})

        } else {
            return rep.code(404).send({ error: "Usuário não encontrado..."})
        }

    } catch(err) {
        console.error(err)
        return rep.code(500).send({ error: "Erro ao deletar o usuário."})
    }
}

export async function updateScheduleAsAdmin (
    req: FastifyRequest<{ Body: UpdateScheduleAdminInput }>, 
    rep: FastifyReply) {
    try {
        const { id, ...data } = req.body as any

        const schedule = await prisma.schedule.update({
            where: { id },
            data: { ...data }
        })

        if (schedule) {
            rep.code(200)
        } else {

        }

    } catch(err) {
        console.error(err)
        rep.code(500).send(err)
    }
}

export async function deleteScheduleAsAdmin (req: FastifyRequest, rep: FastifyReply) {
    try {

        const { id } = req.params as { id: number }

        const user = await prisma.schedule.delete({
            where: { id }
        })

        if (user) {
            return rep.code(200).send({ message: "Agendamento deletado com sucesso!"})
        } else {
            return rep.code(404).send({ message: "Agendamento não existe."})
        }

    } catch(err) {
        console.error(err)
        return rep.code(500).send(err)
    }

    

}

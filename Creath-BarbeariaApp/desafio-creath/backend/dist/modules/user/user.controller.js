"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerOrLoginUser = registerOrLoginUser;
exports.logoutUser = logoutUser;
exports.getUser = getUser;
exports.getUserByPhone = getUserByPhone;
exports.getBarbers = getBarbers;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.createSchedule = createSchedule;
exports.getUserSchedules = getUserSchedules;
exports.updateSchedule = updateSchedule;
exports.deleteSchedule = deleteSchedule;
exports.getAllUsers = getAllUsers;
exports.deleteAllUsers = deleteAllUsers;
exports.deleteAllSchedules = deleteAllSchedules;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const user_utils_1 = require("./user.utils");
// Lógica de cadastro e login.
function registerOrLoginUser(req, rep) {
    return __awaiter(this, void 0, void 0, function* () {
        const { phone, password } = req.body;
        try {
            let user = yield prisma_1.default.user.findUnique({ where: { phone } });
            // Caso não exista um usuário com o telefone inserido, faz o cadastro do mesmo.
            if (!user) {
                const hashedPassword = yield (0, user_utils_1.hashPassword)(password);
                user = yield prisma_1.default.user.create({
                    data: {
                        phone,
                        password: hashedPassword,
                    },
                });
            }
            else {
                // Caso exista o usuário, compara as hashs de senha e gera o access token.
                const correctPassword = yield (0, user_utils_1.comparePassword)(password, user.password);
                if (!correctPassword) {
                    return rep.code(401).send({ error: "Senha incorreta." });
                }
            }
            const payload = {
                id: user.id,
                phone: user.phone,
                name: user.name,
            };
            const token = req.jwt.sign(payload);
            rep.setCookie("access_token", token, {
                path: "/",
                httpOnly: true,
                sameSite: 'lax',
                priority: 'high',
                secure: true,
            });
            return { accessToken: token };
        }
        catch (error) {
            console.error(error);
            return rep.code(500).send({ error: "Erro ao processar a requisição." });
        }
    });
}
// Lógica de logout.
function logoutUser(req, rep) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            rep.clearCookie("access_token");
            return rep.code(200).send({ message: "Usuário deslogado com sucesso!" });
        }
        catch (error) {
            console.error(error);
            return rep.code(500).send({ errror: "Erro ao deslogar usuário." });
        }
    });
}
// Retorna um usuário pelo ID.
function getUser(req, rep) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const user = yield prisma_1.default.user.findUnique({
                where: { id: userId }
            });
            if (!user) {
                return rep.code(404).send({ error: "Usuário não encontrado." });
            }
            return rep.code(200).send(user);
        }
        catch (error) {
            console.error("Erro ao buscar usuário:", error);
            return rep.code(500).send({ error: "Erro ao buscar usuário." });
        }
    });
}
// Retorna um usuário pelo telefone.
function getUserByPhone(req, rep) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { phone } = req.query;
            if (!phone) {
                return rep.code(400).send({ error: "Parâmetro 'phone' é obrigatório." });
            }
            const user = yield prisma_1.default.user.findUnique({
                where: { phone },
                select: {
                    name: true,
                    phone: true,
                    email: true,
                    birthDate: true,
                }
            });
            if (!user) {
                return rep.code(404).send({ error: "Usuário não encontrado..." });
            }
            return rep.code(200).send(user);
        }
        catch (err) {
            console.error(err);
            return rep.code(500).send({ message: "Erro ao encontrar usuário." });
        }
    });
}
// Retorna todos os barbeiros.
function getBarbers(req, rep) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name } = req.query;
            if (name) {
                const barbers = yield prisma_1.default.barber.findMany({
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        schedules: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                    where: {
                        name: {
                            contains: name.toLowerCase(),
                        }
                    }
                });
                return rep.code(200).send(barbers);
            }
            else {
                const barbers = yield prisma_1.default.barber.findMany({
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        schedules: true,
                        createdAt: true,
                        updatedAt: true,
                    }
                });
                return rep.code(200).send(barbers);
            }
        }
        catch (err) {
            console.error(err);
            return rep.code(500).send({ error: "Erro ao encontrar barbeiros." });
        }
    });
}
// Atualiza o usuário baseado nas informações recebidas.
function updateUser(req, rep) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.user.id;
            const data = __rest(req.body, []);
            // Converte a string para Date se existirem
            const updatedData = Object.assign(Object.assign({}, data), (data.birthDate && { birthDate: new Date(data.birthDate) }));
            // console.log(updatedData)
            const updatedUser = yield prisma_1.default.user.update({
                where: { id },
                data: updatedData,
            });
            if (!updatedUser) {
                return rep.code(404).send({ error: "Usuário não encontrado..." });
            }
            return rep.send({ message: "Usuário atualizado com sucesso!" });
        }
        catch (error) {
            return rep.code(500).send({ error: "Erro ao atualizar o usuário." });
        }
    });
}
// Deleta o usuário baseado no seu ID.
function deleteUser(req, rep) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.user.id;
            const user = yield prisma_1.default.user.delete({
                where: { id }
            });
            if (!user) {
                return rep.code(404).send({ message: "Usuário não encontrado..." });
            }
            return rep.code(204).send({ message: "Usuário deletado com sucesso!" });
        }
        catch (error) {
            console.error(error);
            return rep.code(500).send({ error: "Erro ao deletar o usuário." });
        }
    });
}
// Lógica da criação de agendamentos
function createSchedule(req, rep) {
    return __awaiter(this, void 0, void 0, function* () {
        const schedules = req.body;
        if (!Array.isArray(schedules) || schedules.length === 0) {
            return rep.code(400).send({ error: "Nenhum agendamento fornecido." });
        }
        try {
            // Criar múltiplos agendamentos usando uma transação
            yield prisma_1.default.$transaction(schedules.map(schedule => prisma_1.default.schedule.create({
                data: Object.assign({ userId: req.user.id }, schedule)
            })));
            return rep.code(201).send({ message: "Agendamentos criados com sucesso!" });
        }
        catch (error) {
            console.error(error);
            return rep.code(500).send({ error: "Erro ao criar agendamentos." });
        }
    });
}
// Retorna todos os agendamentos do usuário logado.
function getUserSchedules(req, rep) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const schedules = yield prisma_1.default.schedule.findMany({
                where: {
                    userId
                }
            });
            if (!schedules) {
                return rep.code(404).send({ error: "Usuário não tem agendamentos." });
            }
            return rep.code(200).send(schedules);
        }
        catch (error) {
            console.error(error);
            return rep.code(500).send({ error: "Erro ao encontrar agendamentos." });
        }
    });
}
// Lógica de atualizar os agendamentos do usuário.
function updateSchedule(req, rep) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const _a = req.body, { id } = _a, data = __rest(_a, ["id"]);
            const userId = req.user.id;
            // Verifica se o agendamento é do usuário.
            const schedule = yield prisma_1.default.schedule.findUnique({
                where: {
                    id,
                    userId,
                }
            });
            if (!schedule) {
                return rep.code(404).send({ error: "Agendamento não encontrado." });
            }
            yield prisma_1.default.schedule.update({
                where: { id },
                data: Object.assign({}, data),
            });
            return rep.code(200).send({ message: "Agendamento atualizado com sucesso!" });
        }
        catch (error) {
            console.error(error);
            return rep.code(500).send({ error: "Erro ao atualizar agendamento." });
        }
    });
}
// Lógica de deletar os agendamentos do usuário.
function deleteSchedule(req, rep) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.body;
            const userId = req.user.id;
            // Verifica se o agendamento é do usuário.
            const schedule = yield prisma_1.default.schedule.findUnique({
                where: {
                    id,
                    userId
                }
            });
            if (!schedule) {
                return rep.code(404).send({ error: "Agendamento não encontrado." });
            }
            yield prisma_1.default.schedule.delete({ where: { id } });
            return rep.code(204).send({ message: "Agendamento deletado com sucesso!" });
        }
        catch (error) {
            console.error(error);
            return rep.code(500).send({ error: "Erro ao deletar agendamento." });
        }
    });
}
// -- HANDLERS PARA TESTES NO POSTMAN --
function getAllUsers(req, rep) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield prisma_1.default.user.findMany({
                select: {
                    id: true,
                    name: true,
                    phone: true,
                    email: true,
                    schedules: true,
                    createdAt: true,
                    updatedAt: true,
                }
            });
            if (!users) {
                return rep.code(404).send({ error: "Usuário não encontrado..." });
            }
            return rep.code(200).send(users);
        }
        catch (err) {
            console.error(err);
            return rep.code(500).send({ message: "Erro ao encontrar usuários." });
        }
    });
}
function deleteAllUsers(req, rep) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield prisma_1.default.user.deleteMany();
            if (!users) {
                return rep.code(404).send({ error: "Nenhum usuário encontrado." });
            }
            return rep.code(200).send({ message: "Usuários deletados com sucesso!" });
        }
        catch (error) {
            console.error(error);
            return rep.code(500).send({ error: "Erro ao deletar todos os usuários." });
        }
    });
}
function deleteAllSchedules(req, rep) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const schedules = yield prisma_1.default.schedule.deleteMany();
            if (!schedules) {
                return rep.code(404).send({ error: "Nenhum agendamento encontrado." });
            }
            return rep.code(200).send({ message: "Agendamentos deletados com sucesso!" });
        }
        catch (error) {
            console.error(error);
            return rep.code(500).send({ error: "Erro ao deletar todos os agendamentos." });
        }
    });
}
// export async function createUser(
//   req: FastifyRequest<{ Body: CreateUserType }>,
//   rep: FastifyReply
// ) {
//   const { name, phone, password } = req.body
//   try {
//     const hashedPassword = await hashPassword(password);
//     await prisma.user.create({
//       data: {
//         name: name,
//         phone: phone,
//         password: hashedPassword,
//       },
//     });
//     return rep.code(201).send({ message: "Usuário registrado com sucesso!" });
//   } catch (error) {
//     return rep.code(500).send({ error: "Erro ao criar o usuário." });
//   }
// }
// export async function loginUser(
//   req: FastifyRequest<{ Body: LoginUserType }>,
//   rep: FastifyReply
// ) {
//   const { phone, password } = req.body
//   try {
//     const user = await prisma.user.findUnique({ where: { phone } });
//     // Tenta fazer login como um usuário.
//     if (user) {
//       const correctPassword = await comparePassword(password, user.password);
//       if (!correctPassword) {
//         return rep.code(401).send({ error: "Email ou senha inválidos." });
//       }
//       const payload = {
//         id: user.id,
//         phone: user.phone,
//         name: user.name,
//       };
//       const token = req.jwt.sign(payload);
//       rep.setCookie("access_token", token, {
//         path: "/",
//         httpOnly: true,
//         secure: true,
//         expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
//       });
//       return { accessToken: token };
//     } else {
//       // Se não encontrar o usuário, tenta como um barbeiro.
//       const barber = await prisma.barber.findUnique({ where: { phone } });
//       if (barber) {
//         const correctPassword = await comparePassword(password, barber.password);
//       if (!correctPassword) {
//         return rep.code(401).send({ error: "Email ou senha inválidos." });
//       }
//       const payload = {
//         id: barber.id,
//         phone: barber.phone,
//         name: barber.name,
//       };
//       const token = req.jwt.sign(payload);
//       rep.setCookie("access_token", token, {
//         path: "/",
//         httpOnly: true,
//         secure: true,
//         expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
//       });
//       return { accessToken: token };
//       } else {
//         return rep.code(401).send({ error: "Email ou senha inválidos." });
//       } 
//     }
//   } catch (error) {
//     return rep.code(500).send({ error: "Erro ao realizar o login." });
//   }
// }

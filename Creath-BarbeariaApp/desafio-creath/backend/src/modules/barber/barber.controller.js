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
exports.createBarber = createBarber;
exports.updateBarber = updateBarber;
exports.deleteBarber = deleteBarber;
exports.updateUserAsAdmin = updateUserAsAdmin;
exports.deleteUserAsAdmin = deleteUserAsAdmin;
exports.updateScheduleAsAdmin = updateScheduleAsAdmin;
exports.deleteScheduleAsAdmin = deleteScheduleAsAdmin;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const user_utils_1 = require("../user/user.utils");
function createBarber(req, rep) {
    return __awaiter(this, void 0, void 0, function* () {
        const _a = req.body, { password } = _a, data = __rest(_a, ["password"]);
        try {
            const hashedPassword = yield (0, user_utils_1.hashPassword)(password);
            // console.log(hashedPassword)
            yield prisma_1.default.barber.create({
                data: {
                    password: hashedPassword,
                    phone: data.phone,
                    name: data.name || "", // Define um valor padrão para name
                },
            });
            return rep.code(201).send({ message: "Barbeiro registrado com sucesso!" });
        }
        catch (error) {
            return rep.code(500).send({ error: "Erro ao criar o barbeiro." });
        }
    });
}
function updateBarber(req, rep) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
function deleteBarber(req, rep) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
function updateUserAsAdmin(req, rep) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
function deleteUserAsAdmin(req, rep) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { phone } = req.params;
            // console.log(phone)
            const user = yield prisma_1.default.user.delete({
                where: { phone }
            });
            if (user) {
                return rep.code(200).send({ message: "Usuário deletado com sucesso!" });
            }
            else {
                return rep.code(404).send({ error: "Usuário não encontrado..." });
            }
        }
        catch (err) {
            console.error(err);
            return rep.code(500).send({ error: "Erro ao deletar o usuário." });
        }
    });
}
function updateScheduleAsAdmin(req, rep) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const _a = req.body, { id } = _a, data = __rest(_a, ["id"]);
            const schedule = yield prisma_1.default.schedule.update({
                where: { id },
                data: Object.assign({}, data)
            });
            if (schedule) {
                rep.code(200);
            }
            else {
            }
        }
        catch (err) {
            console.error(err);
            rep.code(500).send(err);
        }
    });
}
function deleteScheduleAsAdmin(req, rep) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const user = yield prisma_1.default.schedule.delete({
                where: { id }
            });
            if (user) {
                return rep.code(200).send({ message: "Agendamento deletado com sucesso!" });
            }
            else {
                return rep.code(404).send({ message: "Agendamento não existe." });
            }
        }
        catch (err) {
            console.error(err);
            return rep.code(500).send(err);
        }
    });
}

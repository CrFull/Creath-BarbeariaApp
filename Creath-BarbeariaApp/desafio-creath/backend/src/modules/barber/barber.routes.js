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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = barberRoutes;
const barber_controller_1 = require("./barber.controller");
const user_schemas_1 = require("../user/user.schemas");
const client_1 = require("@prisma/client");
// Criei uma instância global do PrismaClient, get Barbers foi necessario fazer para a pagina selecionarBarbeiros
const prisma = new client_1.PrismaClient();
function barberRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.post("/register", {
            schema: {
                body: user_schemas_1.CreateUserSchema
            }
        }, barber_controller_1.createBarber);
        fastify.get('/barbers', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const barbers = yield prisma.barber.findMany(); // Use prisma diretamente
                reply.send(barbers);
            }
            catch (error) {
                reply.status(500).send({ error: 'Erro ao buscar barbeiros' });
            }
        }));
    });
}

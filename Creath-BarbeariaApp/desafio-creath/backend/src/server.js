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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const jwt_1 = __importDefault(require("@fastify/jwt"));
const cors_1 = __importDefault(require("@fastify/cors"));
const barber_routes_1 = __importDefault(require("./modules/barber/barber.routes"));
const user_routes_1 = __importDefault(require("./modules/user/user.routes"));
const client_1 = require("@prisma/client");
const cookie_1 = __importDefault(require("@fastify/cookie"));
const prisma = new client_1.PrismaClient();
const app = (0, fastify_1.default)({ logger: true }).withTypeProvider();
app.register(cors_1.default, {
    origin: 'http://localhost:5173',
    credentials: true,
});
app.register(jwt_1.default, {
    secret: process.env.FJWT_SECRET || "JWTSECRET",
});
app.register(cookie_1.default, {
    secret: process.env.COOKIES_SECRET || "COOKIESSECRET",
});
// Lógica de autenticação do usuário: Verifica se quem acessa a rota está logado.
app.decorate('authenticator', (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.access_token;
    if (!token) {
        return rep.status(401).send({ error: "Autenticação falhou" });
    }
    try {
        req.user = req.jwt.verify(token);
    }
    catch (error) {
        console.error(error);
        return rep.status(401).send(error);
    }
}));
// Lógica de autenticação do barbeiro: Verifica se quem acessa a rota é um barbeiro.
app.decorate('isBarber', (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.baber) {
        return rep.status(403).send({ error: "Acesso negado." });
    }
}));
app.addHook("preHandler", (req, rep, done) => {
    req.jwt = app.jwt;
    return done();
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        app.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
        app.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
        app.register(barber_routes_1.default, { prefix: "api/barber" });
        app.register(user_routes_1.default, { prefix: "api/user" });
        // app.get('/', (req: FastifyRequest, rep: FastifyReply) => {
        //   rep.send({ message: "Barba, Cabelo e Bigode." });
        // });
        const port = process.env.PORT ? parseInt(process.env.PORT) : 8081;
        const host = process.env.HOST || "0.0.0.0";
        yield app
            .listen({
            port: port,
            host: host,
        })
            .then(() => {
            console.log("Server running at port " + port);
        })
            .catch((err) => {
            console.error(err);
            process.exit(1);
        });
    });
}
main();
// Espera o banco de dados terminar suas ações para fechar o servidor.
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
    process.exit();
}));
process.on("SIGTERM", () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
    process.exit();
}));

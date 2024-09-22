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
const prisma_1 = __importDefault(require("../utils/prisma"));
// Criação de barbeiros genéricos.
function seedBarbers() {
    return __awaiter(this, void 0, void 0, function* () {
        const barbers = [
            { name: 'Alexandre Soares', phone: '999212', password: 'senha1' },
            { name: 'Paula Souza', phone: '123456', password: 'senha2' },
            { name: 'Victor Moreira', phone: '123464566', password: 'senha2' },
            { name: 'Agatha Silva', phone: '124223', password: 'senha2' },
            { name: 'Emanoel Lucas', phone: '12345698', password: 'senha2' },
            { name: 'Karine Barros', phone: '123454555556', password: 'senha2' },
        ];
        for (const barber of barbers) {
            yield prisma_1.default.barber.create({
                data: {
                    name: barber.name,
                    phone: barber.phone,
                    password: barber.password,
                },
            });
        }
    });
}
seedBarbers()
    .then(() => console.log('Barbeiros seedados com sucesso!'))
    .catch((error) => console.error('Erro ao seedar barbeiros:', error))
    .finally(() => process.exit());

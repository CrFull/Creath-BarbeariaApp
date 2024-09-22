"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateScheduleAdminSchema = exports.updateUserAdminSchema = exports.updateServiceSchema = exports.addServiceSchema = void 0;
const zod_1 = require("zod");
exports.addServiceSchema = zod_1.z.object({
    name: zod_1.z.string({
        required_error: "Insira o nome do serviço.",
        invalid_type_error: "Nome de serviço inválido."
    }),
    price: zod_1.z.number({
        required_error: "Insira o preço do serviço.",
        invalid_type_error: "Preço do serviço inválido."
    }).nonnegative({ message: "O preço deve ser positivo." }),
});
exports.updateServiceSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string().optional(),
    price: zod_1.z.number().optional(),
    barberId: zod_1.z.string().optional(),
}).optional();
exports.updateUserAdminSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
}).optional();
exports.updateScheduleAdminSchema = zod_1.z.object({
    dateTime: zod_1.z.date().optional(),
    userId: zod_1.z.string().optional(),
    barberId: zod_1.z.string().optional(),
    serviceId: zod_1.z.string().optional(),
    barberName: zod_1.z.string().optional(),
}).optional();

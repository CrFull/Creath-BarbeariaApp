"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteScheduleSchema = exports.UpdateScheduleSchema = exports.CreateScheduleSchema = exports.PhoneQuerySchema = exports.UserSchema = exports.UpdateUserSchema = exports.LoginUserSchema = exports.CreateUserSchema = void 0;
const zod_1 = require("zod");
// Esquema de validação para criação de um novo usuário
exports.CreateUserSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    phone: zod_1.z
        .string({
        required_error: "Digite seu telefone",
        invalid_type_error: "Telefone inválido",
    }),
    email: zod_1.z
        .string({
        required_error: "Digite seu e-mail",
        invalid_type_error: "E-mail inválido",
    })
        .email()
        .optional(),
    password: zod_1.z
        .string({
        required_error: "Digite sua senha",
    })
        .min(6, "A senha deve ter pelo menos 6 caracteres"),
    birthDate: zod_1.z
        .string({
        invalid_type_error: "Data de nascimento inválida",
    })
        .optional(),
});
// Esquema de validação para realizar o login de um usuário.
exports.LoginUserSchema = zod_1.z.object({
    phone: zod_1.z
        .string({
        required_error: "Digite seu telefone",
        invalid_type_error: "Telefone inválido",
    }),
    password: zod_1.z
        .string({
        required_error: "Digite sua senha",
    })
        .min(6, "A senha deve ter pelo menos 6 caracteres"),
});
// Esquema de validação para atualizar as informações de um usuário.
exports.UpdateUserSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(), // Adiciona o campo email como opcional
    password: zod_1.z.string().optional(),
    birthDate: zod_1.z.string().optional(),
}).optional();
// Esquema de validação para um usuário existente.
exports.UserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Digite seu nome").optional(),
    phone: zod_1.z
        .string({
        required_error: "Digite seu telefone",
        invalid_type_error: "Telefone inválido",
    }),
    password: zod_1.z.string({
        required_error: "Digite sua senha",
        invalid_type_error: "Senha inválida",
    }),
    email: zod_1.z.string({
        invalid_type_error: "Email inválido",
    }).optional(),
    createdAt: zod_1.z.string(),
    updatedAt: zod_1.z.string(),
});
exports.PhoneQuerySchema = zod_1.z.object({
    phone: zod_1.z.string().min(10, "Telefone é obrigatório")
});
// Esquema de validação para criar um agendamento.
exports.CreateScheduleSchema = zod_1.z.object({
    // dateTime é baseada no padrão ISO 8601.
    dateTime: zod_1.z
        .string({
        required_error: "Escolha uma data.",
        invalid_type_error: "Data inválida.",
    }).datetime(),
    userId: zod_1.z
        .string({
        required_error: "Escolha um usuário.",
        invalid_type_error: "ID do usuário inválido."
    }).uuid().optional(),
    barberId: zod_1.z
        .string({
        required_error: "Escolha um barbeiro.",
        invalid_type_error: "ID do barbeiro inválido."
    }).uuid(),
    service: zod_1.z
        .string({
        required_error: "Escolha um serviço.",
        invalid_type_error: "Serviço inválido."
    }),
    serviceValue: zod_1.z
        .string({
        required_error: "Escolha um serviço.",
        invalid_type_error: "Serviço inválido."
    }),
    barberName: zod_1.z
        .string({
        required_error: "Defina um barbeiro.",
        invalid_type_error: "Barbeiro inválido."
    })
});
// Esquema de validação para atualizar um agendamento.
exports.UpdateScheduleSchema = zod_1.z.object({
    id: zod_1.z.number(),
    dateTime: zod_1.z.string().datetime().optional(),
    userId: zod_1.z.string().uuid().optional(),
    barberId: zod_1.z.string().uuid().optional(),
    service: zod_1.z.string().optional(),
    barberName: zod_1.z.string().optional(),
});
// Esquema de validação para deletar um agendamento
exports.DeleteScheduleSchema = zod_1.z.object({
    id: zod_1.z.number().int()
});

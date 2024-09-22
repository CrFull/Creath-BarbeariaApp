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
exports.default = userRoutes;
const user_controller_1 = require("./user.controller");
const user_schemas_1 = require("./user.schemas");
const zod_1 = require("zod");
// Rotas da API no contexto dos usuários.
function userRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.get('/getUser', {
            preHandler: [fastify.authenticator]
        }, user_controller_1.getUser);
        fastify.get("/phone", {
            preHandler: [fastify.authenticator]
        }, user_controller_1.getUserByPhone);
        fastify.post("/register-or-login", {
            schema: {
                body: user_schemas_1.CreateUserSchema
            }
        }, user_controller_1.registerOrLoginUser);
        fastify.get("/barbers:name", user_controller_1.getBarbers);
        fastify.delete("/logout", user_controller_1.logoutUser);
        fastify.put("/update", {
            preHandler: [fastify.authenticator],
            schema: {
                body: user_schemas_1.UpdateUserSchema
            }
        }, user_controller_1.updateUser);
        fastify.delete("/delete", {
            preHandler: [fastify.authenticator]
        }, user_controller_1.deleteUser);
        fastify.post("/create", {
            preHandler: [fastify.authenticator],
            schema: {
                body: zod_1.z.array(user_schemas_1.CreateScheduleSchema)
            }
        }, user_controller_1.createSchedule);
        fastify.get("/schedules", {
            preHandler: [fastify.authenticator],
        }, user_controller_1.getUserSchedules);
        fastify.put("/scheduleupdate", {
            preHandler: [fastify.authenticator],
        }, user_controller_1.updateSchedule);
        fastify.delete("/erase", {
            preHandler: [fastify.authenticator],
            schema: {
                body: user_schemas_1.DeleteScheduleSchema
            }
        }, user_controller_1.deleteSchedule);
        // -- ROTAS PARA TESTES NO POSTMAN --
        fastify.get("/getAll", user_controller_1.getAllUsers);
        fastify.delete("/deleteAllUsers", user_controller_1.deleteAllUsers);
        fastify.delete("/deleteAllSchedules", user_controller_1.deleteAllSchedules);
        // fastify.post("/register", 
        //   {
        //     schema: {
        //       body: CreateUserSchema
        //     }
        //   },
        //   createUser
        // );
        // fastify.post("/login",
        //   {
        //     schema: {
        //       body: LoginUserSchema
        //     }
        //   },
        //   loginUser
        //  )
    });
}

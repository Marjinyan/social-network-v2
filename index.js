import express from "express";
import swaggerUI from "swagger-ui-express";
import cors from "cors";
import loadRoutes from "./config/routes.js";
import path from "path";
import SwaggerParser from "@apidevtools/swagger-parser";
import models from "./config/database/index.js";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
loadRoutes(app);

app.use(express.static("public/uploads"));

const openapiPath = path.resolve("./docs/openapi.yaml");
const bundledSpec = await SwaggerParser.bundle(openapiPath);

app.use("/api", swaggerUI.serve, swaggerUI.setup(bundledSpec));

await models.sequelize.sync({ alter: true });

const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "http://localhost:5173", credentials: true },
});

io.use((socket, next) => {
    try {
        const token =
            socket.handshake.auth && socket.handshake.auth.token
                ? String(socket.handshake.auth.token)
                : "";

        if (!token) return next(new Error("Unauthorized"));

        const secret = process.env.JWT_SECRET;
        if (!secret) return next(new Error("Server misconfigured"));

        const payload = jwt.verify(token, secret);
        const userId = payload && payload.id ? Number(payload.id) : 0;

        if (!userId) return next(new Error("Unauthorized"));

        socket.data.userId = userId;
        next();
    } catch {
        next(new Error("Unauthorized"));
    }
});

io.on("connection", (socket) => {
    socket.on("dm:join", (data) => {
        const chatId = data && data.chatId ? Number(data.chatId) : 0;
        if (!chatId) return;
        socket.join("chat:" + chatId);
    });

    socket.on("dm:leave", (data) => {
        const chatId = data && data.chatId ? Number(data.chatId) : 0;
        if (!chatId) return;
        socket.leave("chat:" + chatId);
    });

    socket.on("dm:message:send", async (data) => {
        try {
            const chatId = data && data.chatId ? Number(data.chatId) : 0;
            const text = String((data && data.text) || "").trim();
            const userId = Number(socket.data.userId);

            if (!chatId || !text || !userId) return;

            const member = await models.Member.findOne({
                where: { chatId, userId },
            });
            if (!member) return;

            const saved = await models.Message.create({ chatId, userId, text });

            io.to("chat:" + chatId).emit("dm:message:new", {
                id: saved.id,
                chatId: saved.chatId,
                userId: saved.userId,
                text: saved.text,
                createdAt: saved.createdAt,
            });
        } catch {
            socket.emit("dm:error", { message: "Failed to send message." });
        }
    });
});

server.listen(4002, () =>
    console.log("Server started on http://localhost:4002/api")
);

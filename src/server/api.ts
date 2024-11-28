// src/server/api.ts

import { remultExpress } from 'remult/remult-express'
import { Task } from "../shared/Task.js"
import { TasksController } from "../shared/TasksController.js"

export const api = remultExpress({
    entities: [Task],
    controllers: [TasksController],
    admin: true, // Enable the Admin UI
})
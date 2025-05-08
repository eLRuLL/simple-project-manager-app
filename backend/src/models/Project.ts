import { z } from 'zod'
import { UserOpenAPISchema } from './User'

export enum ProjectStatus {
  BACKLOG = 'Backlog',
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
}

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  status: z.nativeEnum(ProjectStatus),
  assignee: z
    .object({
      id: z.string(),
      name: z.string(),
      email: z.string().email(),
      avatar: z.string().url().optional(),
    })
    .optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type Project = z.infer<typeof ProjectSchema>

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - status
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier of the project
 *         name:
 *           type: string
 *           description: The name of the project
 *         description:
 *           type: string
 *           description: The description of the project
 *         status:
 *           type: string
 *           enum: [Backlog, To Do, In Progress, Completed]
 *           description: The current status of the project
 *         assignee:
 *           $ref: '#/components/schemas/User'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the project was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the project was last updated
 */
export const ProjectOpenAPISchema = {
  type: 'object',
  required: ['id', 'name', 'status', 'createdAt', 'updatedAt'],
  properties: {
    id: {
      type: 'string',
      description: 'The unique identifier of the project',
    },
    name: {
      type: 'string',
      description: 'The name of the project',
    },
    description: {
      type: 'string',
      description: 'The description of the project',
    },
    status: {
      type: 'string',
      enum: Object.values(ProjectStatus),
      description: 'The current status of the project',
    },
    assignee: {
      $ref: '#/components/schemas/User',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'The date and time when the project was created',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'The date and time when the project was last updated',
    },
  },
}

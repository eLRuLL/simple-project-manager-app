import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().url().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type User = z.infer<typeof UserSchema>

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - email
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user
 *         avatar:
 *           type: string
 *           format: uri
 *           description: The URL of the user's avatar image
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was last updated
 */
export const UserOpenAPISchema = {
  type: 'object',
  required: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
  properties: {
    id: {
      type: 'string',
      description: 'The unique identifier of the user',
    },
    name: {
      type: 'string',
      description: 'The name of the user',
    },
    email: {
      type: 'string',
      format: 'email',
      description: 'The email address of the user',
    },
    avatar: {
      type: 'string',
      format: 'uri',
      description: "The URL of the user's avatar image",
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      description: 'The date and time when the user was created',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'The date and time when the user was last updated',
    },
  },
}

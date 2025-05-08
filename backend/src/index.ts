import express from 'express'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import cors from 'cors'
import {
  Project,
  ProjectSchema,
  ProjectStatus,
  ProjectOpenAPISchema,
} from './models/Project'
import { User, UserOpenAPISchema } from './models/User'

const app = express()
app.use(express.json())
app.use(cors())

const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]
// In-memory storage for projects
let projects: Project[] = [
  {
    id: '1',
    name: 'Project 1',
    description: 'Description 1',
    status: ProjectStatus.BACKLOG,
    assignee: users[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Project 2',
    description: 'Description 2',
    status: ProjectStatus.BACKLOG,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Project 3',
    description: 'Description 3',
    status: ProjectStatus.TODO,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    assignee: users[1],
  },
  {
    id: '4',
    name: 'Project 4',
    description: 'Description 4',
    status: ProjectStatus.IN_PROGRESS,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    assignee: users[2],
  },
  {
    id: '5',
    name: 'Project 5',
    description: 'Description 5',
    status: ProjectStatus.COMPLETED,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    assignee: users[2],
  },
]

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Project Tracker API',
      version: '1.0.0',
      description: 'A simple project tracking API',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Project: ProjectOpenAPISchema,
        User: UserOpenAPISchema,
      },
    },
  },
  apis: ['./src/**/*.ts'],
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Serve raw OpenAPI specification
app.get('/openapi.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Returns all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 */
app.get('/api/projects', (req, res) => {
  res.json(projects)
})

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - status
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Backlog, To Do, In Progress, Completed]
 *               assignee_id:
 *                 type: string
 *                 description: The ID of the user to assign the project to
 *     responses:
 *       201:
 *         description: The created project
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 */
app.post('/api/projects', (req, res) => {
  const {
    name,
    description,
    status = ProjectStatus.BACKLOG,
    assignee_id,
  } = req.body
  const now = new Date().toISOString()

  const project: Project = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    description,
    status,
    assignee: users.find((u) => u.id === assignee_id),
    createdAt: now,
    updatedAt: now,
  }

  projects.push(project)
  res.status(201).json(project)
})

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update a project
 *     tags: [Projects]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the project to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - status
 *               - assignee_id
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Backlog, To Do, In Progress, Completed]
 *               assignee_id:
 *                 type: string
 *                 description: The ID of the user to assign the project to
 *     responses:
 *       200:
 *         description: The updated project
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 */
app.put('/api/projects/:id', (req, res) => {
  const { id } = req.params
  const { name, description, status, assignee_id } = req.body
  const project = projects.find((p) => p.id === id)

  if (!project) {
    return res.status(404).json({ error: 'Project not found' })
  }

  project.name = name
  project.description = description
  project.status = status
  project.assignee = users.find((u) => u.id === assignee_id)
  project.updatedAt = new Date().toISOString()

  res.json(project)
})

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Returns all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
app.get('/api/users', (req, res) => {
  res.json(users)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(
    `API Documentation available at http://localhost:${PORT}/api-docs`,
  )
  console.log(
    `OpenAPI specification available at http://localhost:${PORT}/openapi.json`,
  )
})

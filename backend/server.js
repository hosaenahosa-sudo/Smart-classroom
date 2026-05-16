const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const app = express();

app.use(cors());
app.use(express.json());

// SWAGGER AUTOMATED CONFIGURATION OPTIONS
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart Classroom API Dashboard',
      version: '1.0.0',
      description: 'Production Data Routing Engine for the Black Cat Parent Portal System',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server Instance'
      }
    ],
  },
  apis: ['./server.js'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

let notifications = [
  { time: "10:30 AM", message: "Exam starts Monday" }
];

const parentDatabase = {
  parent01: {
    parentName: "John Doe Senior",
    childName: "Alex Doe",
    grade: "Grade 5-A",
    status: "Present",
    checkInTime: "07:45 AM",
    classroomTemp: "23°C",
    teacherSuggestion: "Alex did an exceptional job on his recent mathematics quiz! Focus a bit more on descriptive English grammar exercises this weekend.",
    exams: [
      { subject: "Mathematics", testName: "Midterm Quiz 1", score: "95/100", date: "May 12" },
      { subject: "Science & Nature", testName: "Lab Practical", score: "88/100", date: "May 10" },
      { subject: "English Literature", testName: "Essay Assignment", score: "82/100", date: "May 08" }
    ]
  },
  parent02: {
    parentName: "Sarah Jenkins",
    childName: "Emily Jenkins",
    grade: "Grade 5-A",
    status: "Present",
    checkInTime: "07:52 AM",
    classroomTemp: "23°C",
    teacherSuggestion: "Emily is highly engaged in class discussions. Keep practicing her spelling lists for the upcoming spelling bee tournament.",
    exams: [
      { subject: "Mathematics", testName: "Midterm Quiz 1", score: "78/100", date: "May 12" },
      { subject: "Science & Nature", testName: "Lab Practical", score: "94/100", date: "May 10" },
      { subject: "English Literature", testName: "Essay Assignment", score: "91/100", date: "May 08" }
    ]
  }
};

/**
 * @openapi
 * /api/parent/{code}:
 * get:
 * summary: Retrieve student tracking matrix by Parent Key Code
 * parameters:
 * - in: path
 * name: code
 * required: true
 * schema:
 * type: string
 * description: Unique key identifier (e.g. parent01)
 * responses:
 * 200:
 * description: Secure mapping object retrieved successfully.
 * 404:
 * description: Key identifier not found.
 */
app.get('/api/parent/:code', (req, res) => {
  const code = req.params.code.toLowerCase();
  if (parentDatabase[code]) {
    res.json(parentDatabase[code]);
  } else {
    res.status(404).json({ error: "Access Code Not Found" });
  }
});

/**
 * @openapi
 * /notifications:
 * get:
 * summary: Retrieve all active notice board stream feeds
 * responses:
 * 200:
 * description: List arrays returned successfully.
 */
app.get('/notifications', (req, res) => {
  res.json(notifications);
});

/**
 * @openapi
 * /notifications:
 * post:
 * summary: Post a new notice broadcast stream
 * requestBody:
 * required: true
 * content:
 * application: json
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * responses:
 * 201:
 * description: Announcement broadcast complete.
 */
app.post('/notifications', (req, res) => {
  const newMessage = req.body.message;
  if (newMessage) {
    const newNotification = {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      message: newMessage
    };
    notifications.unshift(newNotification);
    res.status(201).json({ success: true });
  } else {
    res.status(400).json({ error: "Message content cannot be blank" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend engine active with Swagger Docs support on port ${PORT}`);
});

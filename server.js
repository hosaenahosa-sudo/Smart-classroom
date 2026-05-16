const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let notifications = [
  { time: "08:15 AM", message: "Classroom doors are open." }
];

const parentDatabase = {
  "parent01": {
    parentName: "Abebe Kebede",
    childName: "Nathan Abebe",
    grade: "Grade 3-B",
    status: "Present",
    checkInTime: "08:22 AM",
    classroomTemp: "24°C",
    teacherSuggestion: "Nathan is excelling in math quizzes but should focus on reviewing the English assignment feedback to improve his grammar score.",
    exams: [
      { subject: "Mathematics", testName: "Quiz 2", score: "92/100", date: "May 12" },
      { subject: "Science", testName: "Midterm", score: "88/100", date: "May 10" },
      { subject: "English", testName: "Assignment 1", score: "A", date: "May 08" }
    ]
  },
  "parent02": {
    parentName: "Marta Alula",
    childName: "Elena Yosef",
    grade: "Grade 3-B",
    status: "Absent",
    checkInTime: "--:--",
    classroomTemp: "24°C",
    teacherSuggestion: "Please ensure Elena reviews Chapter 4 in Science over the weekend to prepare for next Tuesday's quiz.",
    exams: [
      { subject: "Mathematics", testName: "Quiz 2", score: "85/100", date: "May 12" },
      { subject: "Science", testName: "Midterm", score: "74/100", date: "May 10" },
      { subject: "English", testName: "Assignment 1", score: "B+", date: "May 08" }
    ]
  }
};

app.get('/notifications', (req, res) => {
  res.json(notifications);
});

app.post('/notifications', (req, res) => {
  const newNote = {
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    message: req.body.message
  };
  notifications.unshift(newNote);
  res.json({ success: true });
});

app.get('/api/parent/:code', (req, res) => {
  const code = req.params.code.toLowerCase();
  if (parentDatabase[code]) {
    res.json(parentDatabase[code]);
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

app.listen(5000, () => {
  console.log('Backend engine active with Exam & Suggestion support on port 5000');
});

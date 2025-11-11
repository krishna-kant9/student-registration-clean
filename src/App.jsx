import React, { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import CourseTypes from "./components/CourseTypes";
import Courses from "./components/Courses";
import CourseOfferings from "./components/CourseOfferings";
import StudentRegistrations from "./components/StudentRegistrations";

const STORAGE_KEY = "srs-data-v1";

export default function App() {
  const [tab, setTab] = useState(0);
  const [toast, setToast] = useState({ open: false, msg: "", severity: "success" });

  const [courseTypes, setCourseTypes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [offerings, setOfferings] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      setCourseTypes(parsed.courseTypes || []);
      setCourses(parsed.courses || []);
      setOfferings(parsed.offerings || []);
      setRegistrations(parsed.registrations || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ courseTypes, courses, offerings, registrations })
    );
  }, [courseTypes, courses, offerings, registrations]);

  const lists = useMemo(
    () => ({ courseTypes, courses, offerings, registrations }),
    [courseTypes, courses, offerings, registrations]
  );

  const actions = {
    toast: (msg, severity = "success") => setToast({ open: true, msg, severity }),

    addCourseType: (name) =>
      setCourseTypes((prev) => [...prev, { id: Date.now(), name: name.trim() }]),
    updateCourseType: (id, name) =>
      setCourseTypes((prev) => prev.map((ct) => (ct.id === id ? { ...ct, name } : ct))),
    deleteCourseType: (id) => {
      setCourseTypes((prev) => prev.filter((ct) => ct.id !== id));
      setOfferings((prev) => prev.filter((o) => o.courseTypeId !== id));
    },

    addCourse: (name) => setCourses((p) => [...p, { id: Date.now(), name: name.trim() }]),
    updateCourse: (id, name) =>
      setCourses((p) => p.map((c) => (c.id === id ? { ...c, name } : c))),
    deleteCourse: (id) => {
      setCourses((p) => p.filter((c) => c.id !== id));
      setOfferings((prev) => prev.filter((o) => o.courseId !== id));
    },

    addOffering: (courseId, courseTypeId) =>
      setOfferings((p) => [
        ...p,
        { id: Date.now(), courseId: Number(courseId), courseTypeId: Number(courseTypeId) },
      ]),
    updateOffering: (id, courseId, courseTypeId) =>
      setOfferings((p) =>
        p.map((o) =>
          o.id === id
            ? { ...o, courseId: Number(courseId), courseTypeId: Number(courseTypeId) }
            : o
        )
      ),
    deleteOffering: (id) => {
      setOfferings((p) => p.filter((o) => o.id !== id));
      setRegistrations((r) => r.filter((reg) => reg.offeringId !== id));
    },

    addRegistration: (studentName, offeringId) =>
      setRegistrations((p) => [
        ...p,
        { id: Date.now(), studentName: studentName.trim(), offeringId: Number(offeringId) },
      ]),
    deleteRegistration: (id) => setRegistrations((p) => p.filter((r) => r.id !== id)),
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Student Registration System</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Tabs
  value={tab}
  onChange={(_, v) => setTab(v)}
  variant="scrollable"
  scrollButtons="auto"
  allowScrollButtonsMobile
  sx={{ mb: 3 }}
>
  <Tab label="Course Types" />
  <Tab label="Courses" />
  <Tab label="Course Offerings" />
  <Tab label="Student Registrations" />
</Tabs>


        <Box hidden={tab !== 0}>
          <CourseTypes lists={lists} actions={actions} />
        </Box>

        <Box hidden={tab !== 1}>
          <Courses lists={lists} actions={actions} />
        </Box>

        <Box hidden={tab !== 2}>
          <CourseOfferings lists={lists} actions={actions} />
        </Box>

        <Box hidden={tab !== 3}>
          <StudentRegistrations lists={lists} actions={actions} />
        </Box>
      </Container>

      <Snackbar
        open={toast.open}
        autoHideDuration={2400}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={toast.severity} variant="filled">
          {toast.msg}
        </Alert>
      </Snackbar>
    </>
  );
}

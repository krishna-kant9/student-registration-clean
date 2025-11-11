import React, { useMemo, useState } from "react";
import {
  Card, CardHeader, CardContent, Button, Stack, IconButton,
  Table, TableHead, TableRow, TableCell, TableBody, TextField, MenuItem
} from "@mui/material";
import { Delete } from "@mui/icons-material";

export default function StudentRegistrations({ lists, actions }) {
  const { courses, courseTypes, offerings, registrations } = lists;

  const [studentName, setStudentName] = useState("");
  const [offeringId, setOfferingId] = useState("");
  const [filterTypeId, setFilterTypeId] = useState("");

  const onAdd = () => {
    const s = studentName.trim();
    if (!s) return actions.toast("Enter student name", "warning");
    if (!offeringId) return actions.toast("Select an offering", "warning");
    actions.addRegistration(s, offeringId);
    actions.toast("Student registered");
    setStudentName("");
    setOfferingId("");
  };

  const offeringLabel = (o) => {
    const c = courses.find((c) => c.id === o.courseId)?.name || "—";
    const t = courseTypes.find((ct) => ct.id === o.courseTypeId)?.name || "—";
    return `${t} — ${c}`;
  };

  const filteredOfferings = useMemo(
    () => (filterTypeId ? offerings.filter((o) => o.courseTypeId === Number(filterTypeId)) : offerings),
    [offerings, filterTypeId]
  );

  const regWithNames = useMemo(
    () =>
      registrations.map((r) => {
        const off = offerings.find((o) => o.id === r.offeringId);
        return {
          ...r,
          course: off ? courses.find((c) => c.id === off.courseId)?.name : "—",
          type: off ? courseTypes.find((ct) => ct.id === off.courseTypeId)?.name : "—",
        };
      }),
    [registrations, offerings, courses, courseTypes]
  );

  return (
    <Stack spacing={3}>
      <Card>
        <CardHeader title="Register Student" />
        <CardContent>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Student name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              fullWidth
            />
            <TextField
              select label="Course Offering"
              value={offeringId}
              onChange={(e) => setOfferingId(e.target.value)}
              fullWidth
            >
              {offerings.map((o) => (
                <MenuItem key={o.id} value={o.id}>{offeringLabel(o)}</MenuItem>
              ))}
            </TextField>
            <Button variant="contained" onClick={onAdd}>Register</Button>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Filter Offerings by Course Type" />
        <CardContent>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              select label="Course Type"
              value={filterTypeId}
              onChange={(e) => setFilterTypeId(e.target.value)}
              fullWidth
            >
              <MenuItem value="">All Types</MenuItem>
              {courseTypes.map((ct) => (
                <MenuItem key={ct.id} value={ct.id}>{ct.name}</MenuItem>
              ))}
            </TextField>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Registered Students" />
        <CardContent>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Student</TableCell>
                <TableCell>Course Type</TableCell>
                <TableCell>Course</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {regWithNames.map((r, idx) => (
                <TableRow key={r.id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{r.studentName}</TableCell>
                  <TableCell>{r.type}</TableCell>
                  <TableCell>{r.course}</TableCell>
                  <TableCell align="right">
                    <IconButton color="error" onClick={() => actions.deleteRegistration(r.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {regWithNames.length === 0 && (
                <TableRow><TableCell colSpan={5}>No registrations yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Stack>
  );
}

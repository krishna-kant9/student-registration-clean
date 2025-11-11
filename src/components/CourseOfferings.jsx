import React, { useState } from "react";
import {
  Card, CardHeader, CardContent, Button, Stack, IconButton,
  Table, TableHead, TableRow, TableCell, TableBody, MenuItem, TextField
} from "@mui/material";
import { Delete, Edit, Save } from "@mui/icons-material";

export default function CourseOfferings({ lists, actions }) {
  const { courses, courseTypes, offerings } = lists;

  const [courseId, setCourseId] = useState("");
  const [courseTypeId, setCourseTypeId] = useState("");
  const [editId, setEditId] = useState(null);
  const [editCourseId, setEditCourseId] = useState("");
  const [editTypeId, setEditTypeId] = useState("");

  const onAdd = () => {
    if (!courseId || !courseTypeId)
      return actions.toast("Select both course and type", "warning");

    if (offerings.some(o => o.courseId === Number(courseId) && o.courseTypeId === Number(courseTypeId)))
      return actions.toast("Offering already exists", "warning");

    actions.addOffering(courseId, courseTypeId);
    actions.toast("Offering added");
    setCourseId("");
    setCourseTypeId("");
  };

  const startEdit = (o) => {
    setEditId(o.id);
    setEditCourseId(String(o.courseId));
    setEditTypeId(String(o.courseTypeId));
  };
  const saveEdit = () => {
    if (!editCourseId || !editTypeId)
      return actions.toast("Select both fields", "warning");
    actions.updateOffering(editId, editCourseId, editTypeId);
    actions.toast("Offering updated");
    setEditId(null);
  };

  return (
    <Stack spacing={3}>
      <Card>
        <CardHeader title="Create Course Offering" />
        <CardContent>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField select label="Course" value={courseId} onChange={(e) => setCourseId(e.target.value)} fullWidth>
              {courses.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </TextField>

            <TextField select label="Course Type" value={courseTypeId} onChange={(e) => setCourseTypeId(e.target.value)} fullWidth>
              {courseTypes.map((ct) => <MenuItem key={ct.id} value={ct.id}>{ct.name}</MenuItem>)}
            </TextField>

            <Button variant="contained" onClick={onAdd}>Add</Button>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Offerings" />
        <CardContent>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Course Type</TableCell>
                <TableCell>Course</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {offerings.map((o, idx) => (
                <TableRow key={o.id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>
                    {editId === o.id ? (
                      <TextField select size="small" value={editTypeId} onChange={(e) => setEditTypeId(e.target.value)}>
                        {courseTypes.map((ct) => <MenuItem key={ct.id} value={ct.id}>{ct.name}</MenuItem>)}
                      </TextField>
                    ) : (
                      courseTypes.find((ct) => ct.id === o.courseTypeId)?.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editId === o.id ? (
                      <TextField select size="small" value={editCourseId} onChange={(e) => setEditCourseId(e.target.value)}>
                        {courses.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                      </TextField>
                    ) : (
                      courses.find((c) => c.id === o.courseId)?.name
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {editId === o.id ? (
                      <IconButton onClick={saveEdit}><Save /></IconButton>
                    ) : (
                      <IconButton onClick={() => startEdit(o)}><Edit /></IconButton>
                    )}
                    <IconButton color="error" onClick={() => actions.deleteOffering(o.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {offerings.length === 0 && (
                <TableRow><TableCell colSpan={4}>No offerings yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Stack>
  );
}

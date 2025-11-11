import React, { useState } from "react";
import {
  Card, CardHeader, CardContent, TextField, Button,
  Table, TableHead, TableRow, TableCell, TableBody, Stack, IconButton
} from "@mui/material";
import { Delete, Edit, Save } from "@mui/icons-material";

export default function Courses({ lists, actions }) {
  const { courses } = lists;
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  const onAdd = () => {
    const n = name.trim();
    if (!n) return actions.toast("Enter a course name", "warning");
    if (courses.some((c) => c.name.toLowerCase() === n.toLowerCase()))
      return actions.toast("Course already exists", "warning");

    actions.addCourse(n);
    actions.toast("Course added");
    setName("");
  };

  const startEdit = (c) => {
    setEditId(c.id);
    setEditName(c.name);
  };
  const saveEdit = () => {
    const n = editName.trim();
    if (!n) return actions.toast("Name cannot be empty", "warning");
    actions.updateCourse(editId, n);
    actions.toast("Course updated");
    setEditId(null);
    setEditName("");
  };

  return (
    <Stack spacing={3}>
      <Card>
        <CardHeader title="Add Course" />
        <CardContent>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Course name (e.g., English)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <Button variant="contained" onClick={onAdd}>Add</Button>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Existing Courses" />
        <CardContent>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((c, idx) => (
                <TableRow key={c.id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>
                    {editId === c.id ? (
                      <TextField
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        size="small"
                      />
                    ) : (
                      c.name
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {editId === c.id ? (
                      <IconButton onClick={saveEdit}><Save /></IconButton>
                    ) : (
                      <IconButton onClick={() => startEdit(c)}><Edit /></IconButton>
                    )}
                    <IconButton color="error" onClick={() => actions.deleteCourse(c.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {courses.length === 0 && (
                <TableRow><TableCell colSpan={3}>No courses yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Stack>
  );
}

import React, { useState } from "react";
import {
  Card, CardContent, CardHeader, TextField, Button,
  Table, TableHead, TableRow, TableCell, TableBody, Stack, IconButton
} from "@mui/material";
import { Delete, Edit, Save } from "@mui/icons-material";

export default function CourseTypes({ lists, actions }) {
  const { courseTypes } = lists;
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  const onAdd = () => {
    const n = name.trim();
    if (!n) return actions.toast("Enter a course type name", "warning");
    if (courseTypes.some((ct) => ct.name.toLowerCase() === n.toLowerCase()))
      return actions.toast("Type already exists", "warning");

    actions.addCourseType(n);
    actions.toast("Course type added");
    setName("");
  };

  const startEdit = (ct) => {
    setEditId(ct.id);
    setEditName(ct.name);
  };
  const saveEdit = () => {
    const n = editName.trim();
    if (!n) return actions.toast("Name cannot be empty", "warning");
    actions.updateCourseType(editId, n);
    actions.toast("Course type updated");
    setEditId(null);
    setEditName("");
  };

  return (
    <Stack spacing={3}>
      <Card>
        <CardHeader title="Add Course Type" />
        <CardContent>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Type name (e.g., Individual)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <Button variant="contained" onClick={onAdd}>Add</Button>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Existing Course Types" />
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
              {courseTypes.map((ct, idx) => (
                <TableRow key={ct.id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>
                    {editId === ct.id ? (
                      <TextField
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        size="small"
                      />
                    ) : (
                      ct.name
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {editId === ct.id ? (
                      <IconButton onClick={saveEdit}><Save /></IconButton>
                    ) : (
                      <IconButton onClick={() => startEdit(ct)}><Edit /></IconButton>
                    )}
                    <IconButton color="error" onClick={() => actions.deleteCourseType(ct.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {courseTypes.length === 0 && (
                <TableRow><TableCell colSpan={3}>No course types yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Stack>
  );
}

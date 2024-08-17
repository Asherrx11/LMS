import React, { useState, useEffect } from 'react';
import CourseForm from './CourseForm';

const ManageCourses = () => {
    const [courses, setCourses] = useState([]);
    const [editingCourse, setEditingCourse] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/courses')
            .then(response => response.json())
            .then(data => setCourses(data))
            .catch(error => console.error('Error fetching courses:', error));
    }, []);

    const handleSubmit = (courseData) => {
        const method = editingCourse ? 'PATCH' : 'POST';
        const url = editingCourse ? `http://localhost:5000/courses/${editingCourse._id}` : 'http://localhost:5000/courses';

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(courseData)
        })
        .then(response => response.json())
        .then(data => {
            setCourses(editingCourse ? courses.map(c => c._id === data._id ? data : c) : [...courses, data]);
            setEditingCourse(null); // Reset the form
        })
        .catch(error => console.error('Error:', error));
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
    };

    const handleDelete = (id) => {
        fetch(`http://localhost:5000/courses/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                setCourses(courses.filter(c => c._id !== id));
            }
        })
        .catch(error => console.error('Error:', error));
    };

    return (
        <div>
            <h1>Manage Courses</h1>
            <CourseForm course={editingCourse} handleSubmit={handleSubmit} />
            <h2>Existing Courses</h2>
            <ul>
                {courses.map(course => (
                    <li key={course._id}>
                        <h3>{course.title}</h3>
                        <button onClick={() => handleEdit(course)}>Edit</button>
                        <button onClick={() => handleDelete(course._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageCourses;

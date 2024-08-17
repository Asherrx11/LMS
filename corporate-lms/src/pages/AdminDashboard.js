import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminDashboard.css'; // Import the CSS file

const AdminDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [instructorName, setInstructorName] = useState('');
    const [instructorBio, setInstructorBio] = useState('');
    const [instructorContact, setInstructorContact] = useState('');
    const [syllabus, setSyllabus] = useState([]);
    const [videoUrl, setVideoUrl] = useState('');
    const [message, setMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editCourseId, setEditCourseId] = useState(null);

    const fetchCourses = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('http://localhost:5000/api/courses', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCourses(data);
        } catch (error) {
            console.error('Error fetching courses', error);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const addSyllabusItem = () => {
        setSyllabus([...syllabus, { week: '', topic: '', materialsUrl: '' }]);
    };

    const handleSyllabusChange = (index, field, value) => {
        const updatedSyllabus = [...syllabus];
        updatedSyllabus[index][field] = value;
        setSyllabus(updatedSyllabus);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const course = {
                title,
                description,
                instructor: { name: instructorName, bio: instructorBio, contact: instructorContact },
                syllabus,
                videoUrl
            };
            const token = localStorage.getItem('token');

            if (editCourseId) {
                await axios.patch(`http://localhost:5000/api/courses/${editCourseId}`, course, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setMessage('Course updated successfully!');
            } else {
                await axios.post('http://localhost:5000/api/courses', course, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setMessage('Course created successfully!');
            }

            setShowForm(false);
            setEditCourseId(null);
            setTitle('');
            setDescription('');
            setInstructorName('');
            setInstructorBio('');
            setInstructorContact('');
            setSyllabus([]);
            setVideoUrl('');
            fetchCourses(); // Refresh the course list
        } catch (error) {
            setMessage('Error creating course');
            console.error(error);
        }
    };

    const handleEdit = (course) => {
        setTitle(course.title);
        setDescription(course.description);
        setInstructorName(course.instructor.name);
        setInstructorBio(course.instructor.bio);
        setInstructorContact(course.instructor.contact);
        setSyllabus(course.syllabus);
        setVideoUrl(course.videoUrl);
        setEditCourseId(course._id);
        setShowForm(true);
    };

    const handleDelete = async (courseId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/courses/${courseId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setMessage('Course deleted successfully!');
            fetchCourses(); // Refresh the course list
        } catch (error) {
            setMessage('Error deleting course');
            console.error(error);
        }
    };

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <button className="create-course-button" onClick={() => setShowForm(true)}>
                Create Course
            </button>
            {showForm && (
                <form className="course-form" onSubmit={handleSubmit}>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Course Title" required />
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Course Description" required />
                    <input type="text" value={instructorName} onChange={(e) => setInstructorName(e.target.value)} placeholder="Instructor Name" required />
                    <textarea value={instructorBio} onChange={(e) => setInstructorBio(e.target.value)} placeholder="Instructor Bio" required />
                    <input type="email" value={instructorContact} onChange={(e) => setInstructorContact(e.target.value)} placeholder="Instructor Contact" required />
                    <button type="button" onClick={addSyllabusItem}>Add Syllabus Item</button>
                    {syllabus.map((item, index) => (
                        <div key={index}>
                            <input type="number" value={item.week} onChange={(e) => handleSyllabusChange(index, 'week', e.target.value)} placeholder="Week" required />
                            <input type="text" value={item.topic} onChange={(e) => handleSyllabusChange(index, 'topic', e.target.value)} placeholder="Topic" required />
                            <input type="url" value={item.materialsUrl} onChange={(e) => handleSyllabusChange(index, 'materialsUrl', e.target.value)} placeholder="Materials URL" required />
                        </div>
                    ))}
                    <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="Video URL" required />
                    <button type="submit">{editCourseId ? 'Update Course' : 'Create Course'}</button>
                    <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                </form>
            )}
            {message && <p className="message">{message}</p>}
            <h2>Courses</h2>
            <ul className="course-list">
                {courses.map(course => (
                    <li key={course._id} className="course-item">
                        <h3>{course.title}</h3>
                        <p>{course.description}</p>
                        <button className="edit-button" onClick={() => handleEdit(course)}>Edit</button>
                        <button className="delete-button" onClick={() => handleDelete(course._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminDashboard;

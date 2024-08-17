import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get('http://localhost:5000/api/courses', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setCourses(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching courses', error);
                setError('Failed to load courses.');
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Course List</h1>
            <ul>
                {courses.map(course => (
                    <li key={course._id}>
                        <Link to={`/courses/${course._id}`}>{course.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CourseList;

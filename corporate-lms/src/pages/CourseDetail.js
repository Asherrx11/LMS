import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
import DiscussionComponent from '../components/DiscussionComponent';
import { useParams } from 'react-router-dom';
import '../styles/CourseDetail.css';

const CourseDetail = () => {
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('home');
    const { courseId } = useParams();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`http://localhost:5000/api/courses/${courseId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setCourse(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching course details', error);
                setError('Failed to load course details.');
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId]);

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return (
                    <div className="tab-content">
                        <h2>Introduction</h2>
                        <p>{course.description}</p>
                        <div className="course-instructor">
                            <h2>Instructor Information</h2>
                            <p><strong>{course.instructor.name}</strong></p>
                            <p>{course.instructor.bio}</p>
                            <p>Email: <a href={`mailto:${course.instructor.contact}`}>{course.instructor.contact}</a></p>
                        </div>
                    </div>
                );
            case 'syllabus':
                return (
                    <div className="tab-content">
                        <h2>Course Syllabus</h2>
                        <table className="course-table">
                            <thead>
                                <tr>
                                    <th>Week</th>
                                    <th>Topic</th>
                                    <th>Materials</th>
                                </tr>
                            </thead>
                            <tbody>
                                {course.syllabus.map((item, index) => (
                                    <tr key={index}>
                                        <td>Week {item.week}</td>
                                        <td>{item.topic}</td>
                                        <td><a href={item.materialsUrl} download>Download</a></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'videos':
                return (
                    <div className="tab-content">
                        <h2>Course Videos</h2>
                        <div className="course-video">
                            <ReactPlayer url={course.videoUrl} playing controls width="100%" height="auto" />
                        </div>
                    </div>
                );
            case 'room':
                return (
                    <div className="tab-content">
                        <h2>Discussion Room</h2>
                        <DiscussionComponent roomId={courseId} />
                    </div>
                );
            default:
                return null;
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="course-detail-container">
            <header className="course-header">
                <h1>{course.title}</h1>
                <nav className="course-menu">
                    <ul>
                        <li className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>Home</li>
                        <li className={activeTab === 'syllabus' ? 'active' : ''} onClick={() => setActiveTab('syllabus')}>Syllabus</li>
                        <li className={activeTab === 'videos' ? 'active' : ''} onClick={() => setActiveTab('videos')}>Videos</li>
                        <li className={activeTab === 'room' ? 'active' : ''} onClick={() => setActiveTab('room')}>Room</li>
                    </ul>
                </nav>
            </header>

            <div className="course-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default CourseDetail;

import React, { useState, useEffect } from 'react';
import FileUploadComponent from '../FileUploadComponent'; // Import your FileUploadComponent

const CourseForm = ({ course, handleSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        instructor: '',
        syllabus: '',
        videoUrl: '',
        grade: '',
        materials: '' // Assuming you want to upload course materials
    });

    useEffect(() => {
        if (course) {
            setFormData({ ...formData, ...course });
        }
    }, [course]);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onFileUpload = (fileUrl, fieldName) => {
        setFormData({ ...formData, [fieldName]: fileUrl });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        handleSubmit(formData);
    };

    return (
        <form onSubmit={onSubmit}>
            <input
                type="text"
                name="title"
                value={formData.title}
                onChange={onChange}
                placeholder="Title"
                required
            />
            <textarea
                name="description"
                value={formData.description}
                onChange={onChange}
                placeholder="Description"
                required
            />
            <input
                type="text"
                name="instructor"
                value={formData.instructor}
                onChange={onChange}
                placeholder="Instructor"
                required
            />
            <FileUploadComponent label="Upload Syllabus" fieldName="syllabus" onFileUpload={onFileUpload} />
            <FileUploadComponent label="Upload Video" fieldName="videoUrl" onFileUpload={onFileUpload} />
            <FileUploadComponent label="Upload Materials" fieldName="materials" onFileUpload={onFileUpload} />
            <input
                type="number"
                name="grade"
                value={formData.grade}
                onChange={onChange}
                placeholder="Grade Level"
                required
            />
            <button type="submit">Submit</button>
        </form>
    );
};

export default CourseForm;

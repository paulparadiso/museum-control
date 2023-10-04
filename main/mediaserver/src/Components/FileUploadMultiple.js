import { ChangeEvent, useState } from 'react';

const FileUploadMultiple = () => {

    const [fileList, setFileList] = useState();

    const handleFileChange = e => {
        setFileList(e.target.files);
    }

    const handleUploadClick = () => {
        if(!fileList) {
            return;
        }

        const data = new FormData();
        files.forEach((file, i) => {
            data.append(`file-${i}`, file, file.name);
        });

        fetch('http://localhost:3005/upload', {
            method: 'POST',
            body: data,
            mode: 'cors',
        })
            .then((res) => res.json())
            .then((data) => console.log(data))
            .catch((err) => console.error(err));
    }

    const files = fileList ? [...fileList] : [];

    return (
        <div>
            <input type="file" onChange={handleFileChange} multiple />

            <ul>
                {files.map((file, i) => (
                    <li key={i}>
                        {file.name} - {file.type}
                    </li>
                ))}
            </ul>

            <button onClick={handleUploadClick}>Upload</button>
        </div>
    )

}

export default FileUploadMultiple;
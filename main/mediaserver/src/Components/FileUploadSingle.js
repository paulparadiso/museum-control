import { ChangeEvent, useState } from "react";

const FileUploadSingle = () => {

    const [file, setFile] = useState();

    const handleFileChange = e => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUploadClick = () => {
        if (!file) {
            return;
        }

        console.log(file);

        const data = new FormData();
        data.append(file.name, file);

        fetch('http://localhost:3005/upload', {
            method: 'POST',
            body: data,
            mode: 'cors',
        })
            .then((res) => res.json())
            .then((data) => console.log(data))
            .catch((err) => console.error(err));
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />

            <div>{file && `${file.name} - ${file.type}`}</div>

            <button onClick={handleUploadClick}>Upload</button>

        </div>
    )
}

export default FileUploadSingle;
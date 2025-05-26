import React, { useState } from 'react';
import { Modal, Descriptions, Tag, List, Upload, Button, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import Pako from "pako";

const TaskInfoModal = ({ visible, onCancel, task, users }) => {
  const [fileList, setFileList] = useState([]);

  const assignedUsers = task.assigned_users?.map(userId => {
    const user = users.find(user => user.id === userId);
    return user ? user.fio : userId;
  }).join(', ');

  const decompressFile = async (file) => {
    try {
      const compressedData = atob(file.data);
      const charData = compressedData.split('').map(function (char) {
        return char.charCodeAt(0);
      });
      const compressedUint8Array = new Uint8Array(charData);
      const decompressed = Pako.ungzip(compressedUint8Array);

      const blob = new Blob([decompressed], { type: file.type });
      const url = URL.createObjectURL(blob);

      return {
        uid: file.name,
        name: file.name,
        status: 'done',
        url: url,
      };
    } catch (error) {
      message.error('Error decompressing file');
      return null;
    }
  };

  React.useEffect(() => {
    const loadFiles = async () => {
      if (task.files) {
        const files = await Promise.all(task.files.map(decompressFile));
        setFileList(files.filter(file => file !== null));
      }
    };

    loadFiles();
  }, [task.files]);

  return (
    <Modal
      title="Task Information"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Descriptions column={1}>
        <Descriptions.Item label="Title">{task.title}</Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={task.status === 'created' ? 'blue' : task.status === 'in progress' ? 'orange' : 'green'}>
            {task.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Description">{task.description}</Descriptions.Item>
        <Descriptions.Item label="Assigned Users">{assignedUsers}</Descriptions.Item>
        <Descriptions.Item label="Files">
          {fileList.length > 0 && (
            <Upload
              fileList={fileList}
              listType="text"
              onPreview={async (file) => {
                window.open(file.url, '_blank');
              }}
            >
              {/* <Button icon={<InboxOutlined />}>Upload</Button> */}
            </Upload>
          )}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default TaskInfoModal;


 
// import React, { useState, useEffect } from 'react';
// import { Modal, Descriptions, Tag, Upload, Button, message, Input, Form, Row, Typography } from 'antd';
// import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
// import Pako from "pako";
// import axios from 'axios';

// const { TextArea } = Input;

// const TaskInfoModal = ({ visible, onCancel, task, users, onUpdateTask }) => {
//   const [form] = Form.useForm();
//   const [fileList, setFileList] = useState([]);
//   const [processFiles, setProcessFiles] = useState([]);
//   const [resultFiles, setResultFiles] = useState([]);
//   const [processDescription, setProcessDescription] = useState(task.process_description || '');
//   const [resultDescription, setResultDescription] = useState(task.result_description || '');
//   const [isEditprocessDescription, setIsEditProcessDescription] = useState(false);
//   const [isEditresultDescription, setIsEditResultDescription] = useState(false);

//   const assignedUsers = task.assigned_users?.map(userId => {
//     const user = users.find(user => user.id === userId);
//     return user ? user.fio : userId;
//   }).join(', ');

//   const compressFile = async (file) => {
//     console.log(file);

//       const actualFile = file.originFileObj;

//       if (!actualFile) {
//         throw new Error('File object not found');
//       }

//       const arrayBuffer = await actualFile.arrayBuffer();
//       const compressed = Pako.gzip(new Uint8Array(arrayBuffer));

//       let compressedFile = '';
//       for (let i = 0; i < compressed.length; i++) {
//         compressedFile += String.fromCharCode(compressed[i]);
//       }
//       compressedFile = btoa(compressedFile);

//       return { data: compressedFile, name: actualFile.name, type: actualFile.type };
//     };

//   const decompressFile = async (file) => {
//     try {
//       const compressedData = atob(file.data);
//       const charData = compressedData.split('').map(function (char) {
//         return char.charCodeAt(0);
//       });
//       const compressedUint8Array = new Uint8Array(charData);
//       const decompressed = Pako.ungzip(compressedUint8Array);

//       const blob = new Blob([decompressed], { type: file.type });
//       const url = URL.createObjectURL(blob);

//       return {
//         uid: file.name,
//         name: file.name,
//         status: 'done',
//         url: url,
//       };
//     } catch (error) {
//       message.error('Error decompressing file');
//       return null;
//     }
//   };

//   useEffect(() => {
//     const loadFiles = async () => {
//       if (task.files) {
//         const files = await Promise.all(task.files.map(decompressFile));
//         setFileList(files.filter(file => file !== null));
//       }
//       if (task.process_files) {
//         const processFiles = await Promise.all(task.process_files.map(decompressFile));
//         setProcessFiles(processFiles.filter(file => file !== null));
//       }
//       if (task.result_files) {
//         const resultFiles = await Promise.all(task.result_files.map(decompressFile));
//         setResultFiles(resultFiles.filter(file => file !== null));
//       }
//     };

//     loadFiles();
//   }, [task.files, task.process_files, task.result_files]);

//   const handleFileUpload = async (file, fileList, setFileList) => {
//     try {
//       const compressedFile = await compressFile(file);
//       setFileList([...fileList, compressedFile]);
//     } catch (error) {
//       message.error('Error compressing file');
//     }
//   };

//   const handleFileRemove = (file, fileList, setFileList) => {
//     const newFileList = fileList.filter((item) => item.uid !== file.uid);
//     setFileList(newFileList);
//   };

//   const handleSave = async () => {
//     try {
//       const updatedTask = {
//         ...task,
//         process_description: processDescription,
//         result_description: resultDescription,
//         process_files: processFiles.map(file => ({
//           data: file.url,
//           name: file.name,
//           type: file.type,
//         })),
//         result_files: resultFiles.map(file => ({
//           data: file.url,
//           name: file.name,
//           type: file.type,
//         })),
//       };

//       await axios.patch(`http://127.0.0.1:8090/api/collections/Tasks/records/${task.id}`, updatedTask);
//       message.success('Task updated successfully');
//       onUpdateTask();
//     } catch (error) {
//       message.error('Error updating task');
//     }
//   };

//   const onChangeProcessFiles = ({ fileList: newFileList }) => {
//     setProcessFiles(newFileList);
//   };
//   const onChangeResultFiles = ({ fileList: newFileList }) => {
//     setResultFiles(newFileList);
//   };

//   const onPreview = async (file) => {
//     let src = file.url;
//     if (!src) {
//       src = await new Promise((resolve) => {
//         const reader = new FileReader();
//         reader.readAsDataURL(file.originFileObj);
//         reader.onload = () => resolve(reader.result);
//       });
//     }
//     const image = new Image();
//     image.src = src;
//     const imgWindow = window.open(src);
//     imgWindow?.document.write(image.outerHTML);
//   };

//   return (
//     <Modal
//       width={screen.width - 200}
//       title="Task Information"
//       visible={visible}
//       onCancel={onCancel}
//       onOk={handleSave}
//       okText="Сохранить"
//       cancelText="Закрыть"
//     >
//       <Form form={form} layout="vertical">
//         <Descriptions column={1} title="Input Data">
//           <Descriptions.Item label="Title">{task.title}</Descriptions.Item>
//           <Descriptions.Item label="Status">
//             <Tag color={task.status === 'created' ? 'blue' : task.status === 'in progress' ? 'orange' : 'green'}>
//               {task.status}
//             </Tag>
//           </Descriptions.Item>
//           <Descriptions.Item label="Description">{task.description}</Descriptions.Item>
//           <Descriptions.Item label="Assigned Users">{assignedUsers}</Descriptions.Item>
//           <Descriptions.Item label="Files">
//             {fileList.length > 0 && (
//               <Upload
//                 fileList={fileList}
//                 listType="text"
//                 onRemove={(file) => handleFileRemove(file, fileList, setFileList)}
//               >
//                 <Button icon={<UploadOutlined />}>Upload</Button>
//               </Upload>
//             )}
//           </Descriptions.Item>
//         </Descriptions>

//         <Descriptions column={1} title="Process">
//           <Descriptions.Item label="Description">
//             <TextArea
//               value={processDescription}
//               onChange={(e) => setProcessDescription(e.target.value)}
//             />
//           </Descriptions.Item>
//           <Descriptions.Item label="Files">
//             <Upload
//               beforeUpload={(file) => handleFileUpload(file, processFiles, setProcessFiles)}
//               fileList={processFiles}
//               listType="text"
//               onRemove={(file) => handleFileRemove(file, processFiles, setProcessFiles)}
//             >
//               <Button icon={<UploadOutlined />}>Upload</Button>
//             </Upload>
//           </Descriptions.Item>
//         </Descriptions>

//         <Descriptions column={1} title="Result">
//           <Descriptions.Item label="Description">
//             <TextArea
//               value={resultDescription}
//               onChange={(e) => setResultDescription(e.target.value)}
//             />
//           </Descriptions.Item>
//           <Descriptions.Item label="Files">
//             <Upload
//               beforeUpload={(file) => handleFileUpload(file, resultFiles, setResultFiles)}
//               fileList={resultFiles}
//               listType="text"
//               onRemove={(file) => handleFileRemove(file, resultFiles, setResultFiles)}
//             >
//               <Button icon={<UploadOutlined />}>Upload</Button>
//             </Upload>
//           </Descriptions.Item>
//         </Descriptions>
//       </Form>
//     </Modal>
//   );
// };

// export default TaskInfoModal;


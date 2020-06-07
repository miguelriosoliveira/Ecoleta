import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

import './styles.css';

interface Props {
	onUpload: (file: File) => void;
}

const Dropzone: React.FC<Props> = ({ onUpload }) => {
	const [selectedFileUrl, setSelectedFileUrl] = useState('');

	const onDrop = useCallback(
		acceptedFiles => {
			const file = acceptedFiles[0];
			const fileUrl = URL.createObjectURL(file);
			setSelectedFileUrl(fileUrl);
			onUpload(file);
		},
		[onUpload],
	);
	const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

	return (
		<div className="dropzone" {...getRootProps()}>
			<input {...getInputProps()} multiple={false} accept="image/*" />

			{selectedFileUrl ? (
				<img src={selectedFileUrl} alt="Foto do ponto de coleta" />
			) : (
				<p>
					<FiUpload />
					Imagem do estabelecimento
				</p>
			)}
		</div>
	);
};

export default Dropzone;

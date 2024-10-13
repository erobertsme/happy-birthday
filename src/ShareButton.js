import React, { useState, useEffect, useRef } from 'react';
import './ShareButton.css';

const ShareButton = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [generatedURL, setGeneratedURL] = useState('');
    const modalRef = useRef(null);
	const [formData, setFormData] = useState({
		name: '',
		url: '',
		maxClicks: 5,
	});

	const handleButtonClick = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setGeneratedURL('');
	};

    const handleBack = () => {
        setGeneratedURL('');
    };

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (!modalRef.current || modalRef.current.contains(event.target)) return;
            handleCloseModal();
		};

		if (isModalOpen) document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isModalOpen]);

	const handleChange = e => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = e => {
		e.preventDefault();

		// Generate the URL based on the form data
		const baseURL = window.location.origin;
		const queryString = [
			formData.maxClicks && formData.maxClicks !== 5 && `m=${btoa(formData.maxClicks).replace(/=+$/, '')}`,
			formData.name && `bd=${btoa(formData.name).replace(/=+$/, '')}`,
			formData.url && `rw=${btoa(formData.url).replace(/=+$/, '')}`,
		]
			.filter(Boolean)
			.join('&');
		const generatedURL = `${baseURL}/?${queryString}`;

		setGeneratedURL(generatedURL);
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(generatedURL);
	};

	return (
		<>
			<button className="share-button" onClick={handleButtonClick}>
				Share
			</button>

			{isModalOpen && (
				<div className="modal-overlay">
					<div className="modal-content" ref={modalRef}>
                        <span className="close" onClick={handleCloseModal}>&times;</span>
						<h3>Share this page with a friend!</h3>

						{!generatedURL ? (
							<form onSubmit={handleSubmit}>
								<label>
									Name
									<input
										type="text"
										name="name"
										value={formData.name}
										onChange={handleChange}
									/>
								</label>
								<label>
									URL
									<input
										type="url"
										name="url"
										value={formData.url}
										onChange={handleChange}
									/>
								</label>
								<label>
									Max Clicks
									<input
										type="number"
										name="maxClicks"
										value={formData.maxClicks}
										onChange={handleChange}
									/>
								</label>
								<button type="submit">Generate URL</button>
							</form>
						) : (
							<div>
								<p>Generated URL</p>
								<input
									type="text"
									value={generatedURL}
									readOnly
								/>
								<button onClick={handleCopy}>Copy URL</button>
								<button
									type="button"
									onClick={handleBack}>
									Back
								</button>
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
};

export default ShareButton;

import React, { useState, useEffect, useRef } from 'react';
import './ShareButton.css';
import { encodeShareOptions } from './linkUtils';

const ShareButton = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [generatedURL, setGeneratedURL] = useState('');
	const [isCopied, setIsCopied] = useState(false);
	const modalRef = useRef(null);
	const [formData, setFormData] = useState({
		name: '',
		hideName: false,
		url: '',
		maxClicks: 5,
	});

	const handleButtonClick = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setGeneratedURL('');
		setIsCopied(false);
	};

	const handleBack = () => {
		setGeneratedURL('');
		setIsCopied(false);
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
		const { name, type, checked, value } = e.target;
		setFormData({
			...formData,
			[name]: type === 'checkbox' ? checked : value,
		});
	};

	const handleSubmit = e => {
		e.preventDefault();

		// Generate the URL based on the form data
		const baseURL = window.location.origin;
		const shareData = encodeShareOptions({
			url: formData.url,
			maxClicks: formData.maxClicks,
			name: formData.hideName ? formData.name : undefined,
		});
		const queryString = [
			!formData.hideName && formData.name && `name=${encodeURIComponent(formData.name)}`,
			shareData && `d=${shareData}`,
		]
			.filter(Boolean)
			.join('&');
		const generatedURL = queryString ? `${baseURL}/?${queryString}` : `${baseURL}/`;

		setGeneratedURL(generatedURL);
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(generatedURL);
		setIsCopied(true);
		setTimeout(() => setIsCopied(false), 1500);
	};

	return (
		<>
			<div className="share-button-corner">
				<button className="share-button" onClick={handleButtonClick}>
					<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
						<circle cx="18" cy="5" r="3"></circle>
						<circle cx="6" cy="12" r="3"></circle>
						<circle cx="18" cy="19" r="3"></circle>
						<line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
						<line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
					</svg>
					Share
				</button>
			</div>

			{isModalOpen && (
				<div className="modal-overlay">
					<div className="modal-content" ref={modalRef}>
						<span className="close" onClick={handleCloseModal}>
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
								<line x1="4" y1="4" x2="20" y2="20"></line>
								<line x1="20" y1="4" x2="4" y2="20"></line>
							</svg>
						</span>
						<h3>Share the Surprise 🎉</h3>

						{!generatedURL ? (
							<form onSubmit={handleSubmit}>
								<label>
									Name
									<input
										type="text"
										name="name"
										placeholder="e.g. Jamie"
										value={formData.name}
										onChange={handleChange}
									/>
								</label>
								<label className="checkbox-label">
									<input
										type="checkbox"
										name="hideName"
										checked={formData.hideName}
										onChange={handleChange}
									/>
									Hide name in link
								</label>

								<details className="advanced-options">
									<summary>More options</summary>
									<label>
										Redirect link
										<input
											type="url"
											name="url"
											placeholder="https://example.com"
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
								</details>

								<button type="submit" className="primary">Create Link</button>
							</form>
						) : (
							<div className="generated-url">
								<p className="modal-subtext">Here's the link to share:</p>
								<input
									type="text"
									value={generatedURL}
									readOnly
								/>
								<div className="generated-url-actions">
									<button type="button" className={`primary${isCopied ? ' copied' : ''}`} onClick={handleCopy}>
										{isCopied ? 'Copied! ✓' : 'Copy Link'}
									</button>
									<button
										type="button"
										className="ghost"
										onClick={handleBack}>
										Back
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
};

export default ShareButton;

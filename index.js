document.addEventListener("DOMContentLoaded", () => {
	// DOM Elements
	const passwordOutput = document.getElementById("password-output");
	const copyBtn = document.getElementById("copy-btn");
	const copied = document.querySelector(".copied");
	const sliderContainer = document.querySelector(".slider-container");
	const sliderValue = document.getElementById("slider-value");
	const checkboxes = document.querySelectorAll('input[type="checkbox"]');
	const strengthText = document.getElementById("password-strength-text");
	const strengthBars = document.querySelectorAll(".lvl-bar");
	const generateButton = document.getElementById("generate-password-btn");
	const track = document.querySelector(".slider-track");
	const range = document.querySelector(".slider-range");
	const thumb = document.querySelector(".slider-thumb");

	// Character sets and colors
	const charSets = {
		uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
		lowercase: "abcdefghijklmnopqrstuvwxyz",
		numbers: "0123456789",
		symbols: "!@#$%^&*()_+[]|,.?/~`",
	};

	const colors = {
		red: "#F64a4a",
		orange: "#Fb7c58",
		yellow: "#F8Cd65",
		green: "#A4FFAF",
		offWhite: "#e6e5ea",
	};

	// Slider Configuration
	const trackRect = track.getBoundingClientRect();
	const trackWidth = trackRect.width;
	const max = parseInt(sliderContainer.getAttribute("max"), 10);
	const min = parseInt(sliderContainer.getAttribute("min"), 10);

	// Helper: Update slider position
	const updateSlider = (position) => {
		const clampedPosition = Math.max(0, Math.min(position, trackWidth));
		const percentage = (clampedPosition / trackWidth) * 100;
		const sliderVal = Math.round((percentage / 100) * (max - min) + min);

		thumb.style.left = `${percentage}%`;
		range.style.width = `${percentage}%`;
		sliderValue.textContent = sliderVal;
	};

	// Helper: Evaluate password strength
	const evaluatePasswordStrength = (password) => {
		let score = 0;
		if (/[A-Z]/.test(password)) score++;
		if (/[a-z]/.test(password)) score++;
		if (/[0-9]/.test(password)) score++;
		if (/[^A-Za-z0-9]/.test(password)) score++;
		if (password.length >= 10) score++;

		// Reset bars
		strengthBars.forEach((bar) => {
			bar.style.backgroundColor = "transparent";
			bar.style.borderColor = colors.offWhite;
		});

		// Update bars and strength text
		const strengthLevels = ["TOO WEAK!", "Weak", "Medium", "Strong"];
		const strengthColors = [
			colors.red,
			colors.orange,
			colors.yellow,
			colors.green,
		];

		let level = Math.min(score, 4);
		strengthText.textContent = strengthLevels[level - 1] || "TOO WEAK!";
		for (let i = 0; i < level; i++) {
			strengthBars[i].style.backgroundColor = strengthColors[level - 1];
			strengthBars[i].style.borderColor = strengthColors[level - 1];
		}
	};

	// Generate Password
	const generatePassword = () => {
		const length = parseInt(sliderValue.textContent, 10);
		let selectedCharSet = "";

		checkboxes.forEach((checkbox) => {
			if (checkbox.checked)
				selectedCharSet += charSets[checkbox.value.toLowerCase()];
		});

		if (!selectedCharSet) {
			passwordOutput.value = "Select from options";
			return;
		}

		let password = "";
		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * selectedCharSet.length);
			password += selectedCharSet[randomIndex];
		}

		passwordOutput.value = password;
		evaluatePasswordStrength(password);
	};

	// Copy to Clipboard
	function copyToClipboard() {
		// Select the text field
		passwordOutput.select();
		passwordOutput.setSelectionRange(0, 99999); // For mobile devices

		// Copy the text inside the text field
		navigator.clipboard.writeText(passwordOutput.value);

		// Check if there's an error case first
		if (passwordOutput.value === "Select from options") {
			alert("Select from options");
		} else if (passwordOutput.value === "") {
			alert("Generate a password first");
		} else {
			// Show the "Copied" message
			console.log("Copied the text: " + passwordOutput.value);
			copied.style.display = "block"; // Ensure it's visible
			setTimeout(() => {
				copied.classList.remove("fade-out");
				copied.classList.add("fade-in");
			}, 100);
			// Fade out after 3 seconds
			setTimeout(() => {
				copied.classList.remove("fade-in");
				copied.classList.add("fade-out");
			}, 1500); // After 1.5 seconds, start fading out

			// Hide the element completely after fade-out completes
			setTimeout(() => {
				copied.style.display = "none"; // Completely hide it
			}, 1600); // Total delay: fade-out duration (500ms) + initial delay (1500ms)
		}
	}

	// Dragging Slider Thumb
	const startDragging = (startEvent) => {
		startEvent.preventDefault();

		const moveEventType =
			startEvent.type === "mousedown" ? "mousemove" : "touchmove";
		const endEventType =
			startEvent.type === "mousedown" ? "mouseup" : "touchend";

		const onMove = (moveEvent) => {
			const clientX = moveEvent.clientX || moveEvent.touches[0].clientX;
			updateSlider(clientX - trackRect.left);
		};

		const onStop = () => {
			document.removeEventListener(moveEventType, onMove);
			document.removeEventListener(endEventType, onStop);
		};

		document.addEventListener(moveEventType, onMove);
		document.addEventListener(endEventType, onStop);
	};

	// Event Listeners
	thumb.addEventListener("mousedown", startDragging);
	thumb.addEventListener("touchstart", startDragging, { passive: false });
	generateButton.addEventListener("click", generatePassword);
	copyBtn.addEventListener("click", copyToClipboard);

	checkboxes.forEach((checkbox) => {
		checkbox.addEventListener("change", () => {
			console.log(
				`${checkbox.id} is ${checkbox.checked ? "checked" : "unchecked"}`
			);
		});
	});

	// Initialize slider
	updateSlider(0);
});

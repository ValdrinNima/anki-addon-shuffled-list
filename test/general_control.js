function onPageLoad(revisionInputValues, parameters) {
	// -------------------------------------------------------------
	// OBJECT questionAnswer:
	// JavaScript object containing question names as the key and
	// the correct answer as the corresponding value.
	// -------------------------------------------------------------
	const questionAnswer = {
		"first-question": "1",
		"second-question": "2",
		"third-question": "3",
		"fourth-question": "30",
		"fifth-question": "Car;Boat;",
		"sixth-question": "Bus;",
	};

	console.log(revisionInputValues);

	const controlQuestionList = document.getElementById("control-questions");

	const questionNames = Object.keys(questionAnswer);
	const controlQuestions = controlQuestionList.children;

	const inputId = "question-input";
	const labelId = "question-label";
	const buttonId = "question-button";
	const dropdownId = "question-dropdown";

	// Iterate over list items and add all necessary attributes
	for (let i = 0; i < controlQuestions.length; i++) {
		// Each list item which contains all elements of a question will be identified
		// by an id with the name of the question e.g. the first list item gets an id of "first-question".
		let name = `${questionNames[i]}_submit-1`;
		controlQuestions[i].id = name;

		controlQuestions[i].setAttribute("data-errorcount", "0");

		const inputType = controlQuestions[i].getAttribute("data-input-type");

		// If intput type is "text"
		if (inputType == "number" || inputType == "text") {
			// TODO: Should we set the name and label automatically?
			let inputElem = document.querySelector(`#${name} > div.input-group > input`);
			inputElem.id = `${inputId}-${i}`;
			inputElem.setAttribute("name", name);

			let label = document.querySelector(`#${name} > label`);
			// console.log(`${labelId}-${i}`);
			label.id = `${labelId}-${i}`;
			label.setAttribute("for", name);

			let button = document.querySelector(`#${name} > div.input-group > button`);
			button.id = `${buttonId}-${i}`;
			button.setAttribute("href", `#collapse-${dropdownId}-${i}-info`);

			let dropdownInfo = document.querySelector(`#${name} > div.collapse`);
			dropdownInfo.id = `collapse-${dropdownId}-${i}-info`;
		} else if (inputType == "textarea") {
			let inputElem = document.querySelector(`#${name} > div.input-group > textarea`);
			inputElem.id = `${inputId}-${i}`;
			inputElem.setAttribute("name", name);

			let label = document.querySelector(`#${name} > label`);
			label.id = `${labelId}-${i}`;
			label.setAttribute("for", name);

			let button = document.querySelector(`#${name} > label > a`);
			button.id = `${buttonId}-${i}`;
			button.setAttribute("href", `#collapse-${dropdownId}-${i}-info`);

			let dropdownInfo = document.querySelector(`#${name} > div.collapse`);
			dropdownInfo.id = `collapse-${dropdownId}-${i}-info`;
		} else if (inputType == "radio") {
			let button = document.querySelector(`#${name} > label > a`);
			button.id = `${buttonId}-${i}`;
			button.setAttribute("href", `#collapse-${dropdownId}-${i}-info`);

			let dropdownInfo = document.querySelector(`#${name} > div.collapse`);
			dropdownInfo.id = `collapse-${dropdownId}-${i}-info`;

			const formChecks = document.querySelectorAll(`#${name} > .form-check`);

			// Set the name for the input and label elements
			for (const formCheck of formChecks) {
				const inputElem = formCheck.children[0];
				inputElem.name = name;
				inputElem.id = `${inputId}-${i}`;

				const label = formCheck.children[1];
				label.id = `${labelId}-${i}`;
				label.setAttribute("for", name);
			}
		} else if (inputType == "checkbox") {
			let button = document.querySelector(`#${name} > label > a`);
			button.id = `${buttonId}-${i}`;
			button.setAttribute("href", `#collapse-${dropdownId}-${i}-info`);

			let dropdownInfo = document.querySelector(`#${name} > div.collapse`);
			dropdownInfo.id = `collapse-${dropdownId}-${i}-info`;

			const formChecks = document.querySelectorAll(`#${name} > .form-check`);

			let checkboxInputIndex = 1;
			// Set the name for the input and label elements
			for (const formCheck of formChecks) {
				const inputElem = formCheck.children[0];
				inputElem.name = `checkbox-${checkboxInputIndex}_${name}`;
				inputElem.id = `${inputId}-${i}`;

				const label = formCheck.children[1];
				label.id = `${labelId}-${i}`;
				label.setAttribute("for", `checkbox-${checkboxInputIndex}_${name}`);
				checkboxInputIndex++;
			}
		} else if (inputType == "range") {
			let button = document.querySelector(`#${name} > label > a`);
			button.id = `${buttonId}-${i}`;
			button.setAttribute("href", `#collapse-${dropdownId}-${i}-info`);

			let dropdownInfo = document.querySelector(`#${name} > div.collapse`);
			dropdownInfo.id = `collapse-${dropdownId}-${i}-info`;

			const inputElem = document.querySelector(`#${name} > .range-wrap > input`);
			inputElem.id = `${inputId}-${i}`;
			inputElem.setAttribute("name", name);

			const label = document.querySelector(`#${name} > label`);
			label.id = `${labelId}-${i}`;
			label.setAttribute("for", name);
		} else if (inputType == "select") {
			let button = document.querySelector(`#${name} > label > a`);
			button.id = `${buttonId}-${i}`;
			button.setAttribute("href", `#collapse-${dropdownId}-${i}-info`);

			let dropdownInfo = document.querySelector(`#${name} > div.collapse`);
			dropdownInfo.id = `collapse-${dropdownId}-${i}-info`;

			const inputElem = document.querySelector(`#${name} > select`);
			inputElem.id = `${inputId}-${i}`;
			inputElem.setAttribute("name", name);

			const label = document.querySelector(`#${name} > label`);
			label.id = `${labelId}-${i}`;
			label.setAttribute("for", name);
		}
	}

	const rangeInputElements = document.querySelectorAll('input[type="range"]');
	for (rangeInputElem of rangeInputElements) {
		rangeInputElem.setAttribute("data-activated", "0");

		const rangeWrap = rangeInputElem.parentElement;

		const output = rangeWrap.querySelector("output");
		if (output) {
			output.classList.add("d-none");
		}

		rangeWrap.classList.add("opacity-50");
		rangeInputElem.addEventListener("mousedown", (event) => {
			const rangeInputEventElem = event.target;
			const rangeWrapEventElem = rangeInputEventElem.parentElement;
			rangeInputEventElem.setAttribute("data-activated", "1");
			rangeWrapEventElem.classList.remove("opacity-50");
			rangeWrapEventElem.style.setProperty("--slider-thumb-opacity", "100%");
			rangeInputEventElem.classList.remove("pulse");
			const output = rangeWrap.querySelector("output");
			if (output) {
				output.classList.remove("d-none");
			}
		});

		rangeInputElem.addEventListener("touchstart", (event) => {
			const rangeInputEventElem = event.target;
			const rangeWrapEventElem = rangeInputEventElem.parentElement;
			rangeInputEventElem.setAttribute("data-activated", "1");
			rangeWrapEventElem.classList.remove("opacity-50");
			rangeWrapEventElem.style.setProperty("--slider-thumb-opacity", "100%");
			rangeInputEventElem.classList.remove("pulse");
			const output = rangeWrap.querySelector("output");
			if (output) {
				output.classList.remove("d-none");
			}
		});
	}

	const allSingleRanges = document.querySelectorAll(".range-wrap");

	for (const rangeWrap of allSingleRanges) {
		rangeWrap.querySelector("output").classList.add("d-none");
	}

	allSingleRanges.forEach((wrap) => {
		const range = wrap.querySelector(".range");
		const bubble = wrap.querySelector(".bubble");

		range.addEventListener("input", () => {
			setBubble(range, bubble);
		});
		setBubble(range, bubble);
	});

	function setBubble(range, bubble) {
		const val = range.value;
		const min = range.min ? range.min : 0;
		const max = range.max ? range.max : 100;
		const newVal = Number(((val - min) * 100) / (max - min));
		bubble.innerHTML = val;

		bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
	}
}

function customValidateForm(inputValues, parameters) {
	////////////////////////////////////////////////////
	// OBJECT questionAnswer:
	// JavaScript object containing question names as the key and
	// the correct answer as the corresponding value.
	const questionAnswer = {
		"first-question": "1",
		"second-question": "2",
		"third-question": "3",
		"fourth-question": "30",
		"fifth-question": "Car;Boat;",
		"sixth-question": "Bus;",
	};
	// PARAMETER maxErrorCount:
	// Defines the maximum number of errors per question until the solution information is displayed.
	const MAX_ERROR_COUNT = 3;
	////////////////////////////////////////////////////

	const inputId = "question-input";
	const labelId = "question-label";
	const buttonId = "question-button";
	const dropdownId = "question-dropdown";
	const controlQuestionList = document.getElementById("control-questions");
	const controlQuestions = controlQuestionList.children;
	const questionNames = Object.keys(questionAnswer);

	// Flag which shows is set to true if at least one question has been answered incorrectly
	// and determines if user can be redirected to the next page
	let isWrong = false;
	console.log(inputValues);

	function modifyInputValuesForCheckbox(inputValues, submitCount) {
		let newInputValues = {};
		let checkboxQuestions = new Set();
		for (const question in inputValues) {
			if (question.includes("checkbox")) {
				checkboxQuestions.add(question.split("_").slice(1).join("_"));
			}
		}

		// Filter out all checkbox questions
		let inputValuesWithoutCheckbox = Object.entries(inputValues).filter(([question, value]) => {
			return !question.includes("checkbox");
		});
		inputValuesWithoutCheckbox = Object.fromEntries(inputValuesWithoutCheckbox);

		for (const checkboxQuestion of checkboxQuestions) {
			let checkboxQuestionValue = "";
			for (const question in inputValues) {
				if (question.includes(checkboxQuestion)) {
					checkboxQuestionValue += inputValues[question] + ";";
				}
			}
			newInputValues[checkboxQuestion] = checkboxQuestionValue;
		}
		return Object.assign({}, newInputValues, inputValuesWithoutCheckbox);
	}

	// ***** FUNCTIONS *****
	function displaySolution() {
		const solutionInfoElements = document.querySelectorAll("#solution-info");
		let solutionModal = new bootstrap.Modal(document.getElementById("solution-modal"), { backdrop: "static" });
		solutionModal.show();
		for (let solutionInfoElem of solutionInfoElements) {
			solutionInfoElem.classList.remove("d-none");
		}
	}

	function addInputDataToDOM(controlQuestions) {
		for (let i = 0; i < controlQuestions.length; i++) {
			const inputName = controlQuestions[i].id;
			let questionAnswerInputName = inputName.split("_")[0];
			// Only add input data to DOM if the answer is incorrect
			if (inputValues[inputName] != questionAnswer[questionAnswerInputName]) {
				const newInputElem = document.createElement("input");
				newInputElem.name = inputName;
				newInputElem.value = inputValues[inputName];
				newInputElem.type = "hidden";
				experimentDataElem.appendChild(newInputElem);
			}
		}
	}

	function resetInputStyling(inputName) {
		for (let input of document.querySelectorAll(`#${inputName} > div > input`)) {
			input.classList.remove("is-invalid", "is-valid");
		}
	}

	let experimentDataElem = document.getElementById("experiment-data");
	let submitCount = parseInt(experimentDataElem.getAttribute("data-submitcount"));
	inputValues = modifyInputValuesForCheckbox(inputValues, submitCount);
	submitCount += 1;
	experimentDataElem.setAttribute("data-submitcount", `${submitCount}`);

	for (let i = 0; i < controlQuestions.length; i++) {
		const inputType = controlQuestions[i].getAttribute("data-input-type");

		const inputName = controlQuestions[i].id;

		// Get collapsed status of the dropdown
		const dropdownInfo = document.querySelector(`#collapse-${dropdownId}-${i}-info`);
		const isCollapsed = dropdownInfo.classList.contains("show");

		// Get info button element
		const button = document.querySelector(`#${buttonId}-${i}`);

		// Get input element
		const inputElem = document.querySelector(`#${inputId}-${i}`);

		// Remove the styling from the previous submit. This way we don't add the same class twice
		// or have to check whether the class has already been added
		if (inputType == "text" || inputType == "number") {
			button.classList.remove("btn-secondary", "btn-danger");
			inputElem.classList.remove("green-border", "red-border");
		} else if (inputType == "textarea") {
			// TEXTAREA
			inputElem.classList.remove("green-border", "red-border");
		} else if (inputType == "radio") {
			resetInputStyling(inputName);
		} else if (inputType == "checkbox") {
			resetInputStyling(inputName);
		} else if (inputType == "range") {
			inputElem.classList.remove("green-slider", "red-slider");
			const outputElem = inputElem.nextElementSibling.children[0];
			outputElem.classList.remove("green-slider", "red-slider");
		} else if (inputType == "select") {
			inputElem.classList.remove("is-valid", "is-invalid");
		}

		// Get the first solution info span
		const solutionInfoElem = document.querySelector("#solution-info");

		// Every input name has the submit count appended e.g. "_submit-2".
		// Extract only the question name so that we can compare it to the questionAnswer object
		let questionAnswerInputName = inputName.split("_")[0];

		// If the answer is incorrect add all the necessary styling to the inputs and dropdowns
		if (inputValues[inputName] != questionAnswer[questionAnswerInputName]) {
			isWrong = true;

			if (inputType == "text" || inputType == "number") {
				button.classList.add("btn-danger");
				inputElem.classList.add("red-border");
			} else if (inputType == "textarea") {
				inputElem.classList.add("red-border");
			} else if (inputType == "radio") {
				// If no radio button is selected, the input value will be undefined
				// and the element cannot be found. But this should not be considered because the user has to select a radio button.
				let inputElem = document.querySelector(`#${inputName} > div > input[value="${inputValues[inputName]}"]`);
				inputElem.classList.add("is-invalid");
			} else if (inputType == "checkbox") {
				const formChecks = document.querySelectorAll(`#${inputName} > .form-check`);

				for (const formCheck of formChecks) {
					const inputElem = formCheck.children[0];
					const label = formCheck.children[1];
					const correctCheckboxAnswer = questionAnswer[questionAnswerInputName];
					if (inputElem.checked && correctCheckboxAnswer.includes(inputElem.value)) {
						inputElem.classList.add("is-valid");
					} else if (inputElem.checked && !correctCheckboxAnswer.includes(inputElem.value)) {
						inputElem.classList.add("is-invalid");
					}
				}
			} else if (inputType == "range") {
				inputElem.classList.add("red-slider");
				const outputElem = inputElem.nextElementSibling.children[0];
				outputElem.classList.add("red-slider");
			} else if (inputType == "select") {
				inputElem.classList.add("is-invalid");
			}

			// Update error count
			let listElem = controlQuestions[i];
			let oldErrorCount = parseInt(listElem.getAttribute("data-errorcount"));
			listElem.setAttribute("data-errorcount", (oldErrorCount + 1).toString());

			// If dropdown isn't collapsed collapse it
			if (!isCollapsed) {
				button.click();
			}

			// Display solution information after max number of errors is reached.
			// Check whether the solutionInfoElem has already been updated (does not have a "d-none" class)
			// so that displaySolution is called only once because the modal should appear only one time.
			if (parseInt(oldErrorCount) + 1 >= MAX_ERROR_COUNT && solutionInfoElem.classList.contains("d-none")) {
				displaySolution();
			}
			// If the answer is correct
		} else {
			// Add the success styling.
			// TODO: Find a better way to conditionally update each input type...
			if (inputType == "text" || inputType == "number") {
				button.classList.add("btn-success");
				inputElem.classList.add("green-border");
			} else if (inputType == "textarea") {
				inputElem.classList.add("green-border");
			} else if (inputType == "radio") {
				let label = document.querySelector(`#${inputName} > div > input[value="${inputValues[inputName]}"]`);
				label.classList.add("is-valid");
			} else if (inputType == "checkbox") {
				const formChecks = document.querySelectorAll(`#${inputName} > .form-check`);

				for (const formCheck of formChecks) {
					const inputElem = formCheck.children[0];
					const label = formCheck.children[1];
					const correctCheckboxAnswer = questionAnswer[questionAnswerInputName];
					if (inputElem.checked && correctCheckboxAnswer.includes(inputElem.value)) {
						inputElem.classList.add("is-valid");
					}
				}
			} else if (inputType == "range") {
				inputElem.classList.add("green-slider");
				const outputElem = inputElem.nextElementSibling.children[0];
				outputElem.classList.add("green-slider");
			} else if (inputType == "select") {
				inputElem.classList.add("is-valid");
			}

			// Close the dropdown if the answer is correct because the user does not need the additional
			// information to be shown.
			if (isCollapsed) {
				button.click();
			}
		}
	}

	addInputDataToDOM(controlQuestions);

	// Update the name of each input with the new submit index for the next submit
	for (let i = 0; i < controlQuestions.length; i++) {
		const inputType = controlQuestions[i].getAttribute("data-input-type");

		let name = `${questionNames[i]}_submit-${submitCount}`;
		if (inputType == "number" || inputType == "text") {
			controlQuestions[i].id = name;

			let inputElem = document.querySelector(`#${inputId}-${i}`);
			inputElem.setAttribute("name", name);

			let label = document.querySelector(`#${labelId}-${i}`);
			label.setAttribute("for", name);
		} else if (inputType == "textarea") {
			let name = `${questionNames[i]}_submit-${submitCount}`;
			controlQuestions[i].id = name;

			let inputElem = document.querySelector(`#${inputId}-${i}`);
			inputElem.setAttribute("name", name);

			let label = document.querySelector(`#${labelId}-${i}`);
			label.setAttribute("for", name);
		} else if (inputType == "radio") {
			let name = `${questionNames[i]}_submit-${submitCount}`;
			controlQuestions[i].id = name;

			let inputElem = document.querySelector(`#${inputId}-${i}`);
			inputElem.setAttribute("name", name);

			let label = document.querySelector(`#${labelId}-${i}`);
			label.setAttribute("for", name);

			const formChecks = document.querySelectorAll(`#${name} > .form-check`);

			// Set the name for the input and label elements
			for (const formCheck of formChecks) {
				const inputElem = formCheck.children[0];
				inputElem.name = name;
				inputElem.id = `${inputId}-${i}`;

				const label = formCheck.children[1];
				label.id = `${labelId}-${i}`;
				label.setAttribute("for", name);
			}
		} else if (inputType == "checkbox") {
			let name = `${questionNames[i]}_submit-${submitCount}`;
			controlQuestions[i].id = name;

			let inputElem = document.querySelector(`#${inputId}-${i}`);
			inputElem.setAttribute("name", name);

			let label = document.querySelector(`#${labelId}-${i}`);
			label.setAttribute("for", name);

			const formChecks = document.querySelectorAll(`#${name} > .form-check`);

			let checkboxInputIndex = 1;
			// Set the name for the input and label elements
			for (const formCheck of formChecks) {
				const inputElem = formCheck.children[0];
				inputElem.name = `checkbox-${checkboxInputIndex}_${name}`;
				inputElem.id = `${inputId}-${i}`;

				const label = formCheck.children[1];
				label.id = `${labelId}-${i}`;
				label.setAttribute("for", `checkbox-${checkboxInputIndex}_${name}`);
				checkboxInputIndex++;
			}
		} else if (inputType == "range") {
			let name = `${questionNames[i]}_submit-${submitCount}`;
			controlQuestions[i].id = name;

			let inputElem = document.querySelector(`#${inputId}-${i}`);
			inputElem.setAttribute("name", name);

			let label = document.querySelector(`#${labelId}-${i}`);
			label.setAttribute("for", name);
		} else if (inputType == "select") {
			let name = `${questionNames[i]}_submit-${submitCount}`;
			controlQuestions[i].id = name;

			let inputElem = document.querySelector(`#${inputId}-${i}`);
			inputElem.setAttribute("name", name);

			let label = document.querySelector(`#${labelId}-${i}`);
			label.setAttribute("for", name);
		}
	}
	// The errorcount data is saved inside hidden input elements.
	for (let i = 0; i < controlQuestions.length; i++) {
		const errorCount = parseInt(controlQuestions[i].getAttribute("data-errorcount"));
		const newInputElem = document.createElement("input");
		newInputElem.name = `${questionNames[i]}-errorcount`;
		newInputElem.value = errorCount;
		newInputElem.type = "hidden";
		experimentDataElem.appendChild(newInputElem);
	}

	// If there is at least one incorrect answer do not proceed to the next page.
	if (isWrong) {
		return false;
	} else {
		return true;
	}
}

install:
	npm ci
correctMessages:
	node index.js ./replacement.json https://raw.githubusercontent.com/thewhitesoft/student-2023-assignment/main/data.json

import { GoogleGenAI, Image, Type } from '@google/genai';

export async function evaluateEssay(
	token: string,
	sourceText: string,
	essay: string
) {
	const ai = new GoogleGenAI({ apiKey: token });
	const config = {
		responseMimeType: 'application/json',
		responseSchema: {
			type: Type.OBJECT,
			required: [
				'K1',
				'K2',
				'K3',
				'K4',
				'K5',
				'K6',
				'K7',
				'K8',
				'K9',
				'K10',
				'K1_comment',
				'K2_comment',
				'K3_comment',
				'K4_comment',
				'K5_comment',
				'K6_comment',
				'K7_comment',
				'K8_comment',
				'K9_comment',
				'K10_comment',
				'totalScore',
				'remark',
			],
			properties: {
				K1: {
					type: Type.INTEGER,
					description:
						'Понимание и изложение позиции автора: 0 — нет или искажено; 1 — чётко отражена позиция автора',
				},
				K1_comment: {
					type: Type.STRING,
					description: 'Комментарий по критерию, в чем ошибка',
				},
				K2: {
					type: Type.INTEGER,
					description:
						'Комментарий к позиции автора: 0 — отсутствует или не по существу; 1 — есть общий комментарий без деталей; 2 — комментарий с детализацией (примеры из текста); 3 — развёрнутый, аргументированный анализ позиции автора',
				},
				K2_comment: {
					type: Type.STRING,
					description: 'Комментарий по критерию, в чем ошибка',
				},
				K3: {
					type: Type.INTEGER,
					description:
						'Выражение собственного отношения к позиции автора: 0 — нет собственного отношения; 1 — выражено без аргументации; 2 — выражено и аргументировано',
				},
				K3_comment: {
					type: Type.STRING,
					description: 'Комментарий по критерию, в чем ошибка',
				},
				K4: {
					type: Type.INTEGER,
					description:
						'Фактические ошибки: 0 — допущены (искажают смысл); 1 — отсутствуют',
				},
				K4_comment: {
					type: Type.STRING,
					description: 'Комментарий по критерию, в чем ошибка',
				},
				K5: {
					type: Type.INTEGER,
					description:
						'Логичность рассуждения: 0 — рассуждения не связаны / противоречат; 1 — есть незначительные логические сбои; 2 — рассуждение чёткое и последовательное',
				},
				K5_comment: {
					type: Type.STRING,
					description: 'Комментарий по критерию, в чем ошибка',
				},
				K6: {
					type: Type.INTEGER,
					description:
						'Этические нормы: 0 — нарушены (оскорбления, недопустимые высказывания); 1 — соблюдены',
				},
				K6_comment: {
					type: Type.STRING,
					description: 'Комментарий по критерию, в чем ошибка',
				},
				K7: {
					type: Type.INTEGER,
					description:
						'Орфографические нормы: 0 — 4+ ошибок; 1 — 3 ошибки; 2 — 1–2 ошибки; 3 — без ошибок',
				},
				K7_comment: {
					type: Type.STRING,
					description: 'Комментарий по критерию, в чем ошибка',
				},
				K8: {
					type: Type.INTEGER,
					description:
						'Пунктуационные нормы: 0 — 4+ ошибок; 1 — 3 ошибки; 2 — 1–2 ошибки; 3 — без ошибок',
				},
				K8_comment: {
					type: Type.STRING,
					description: 'Комментарий по критерию, в чем ошибка',
				},
				K9: {
					type: Type.INTEGER,
					description:
						'Грамматические нормы: 0 — 4+ ошибок; 1 — 3 ошибки; 2 — 1–2 ошибки; 3 — без ошибок',
				},
				K9_comment: {
					type: Type.STRING,
					description: 'Комментарий по критерию, в чем ошибка',
				},
				K10: {
					type: Type.INTEGER,
					description:
						'Речевые нормы: 0 — 4+ речевых ошибок (канцеляризмы, тавтологии и т.д.); 1 — 3 ошибки; 2 — 1–2 ошибки; 3 — без речевых ошибок',
				},
				K10_comment: {
					type: Type.STRING,
					description: 'Комментарий по критерию, в чем ошибка',
				},
				totalScore: {
					type: Type.INTEGER,
					description:
						'Сумма баллов по всем критериям (автоматически вычисляется, макс. 22)',
				},
				remark: {
					type: Type.STRING,
					description:
						'Общий комментарий по работе, совет что улучшить, в чем ошибки (или похвала, если работа идеальная на 22 балла)',
				},
			},
		},
		systemInstruction: [
			{
				text: `Представь, что ты эксперт ЕГЭ по русскому языку в 2025 году. Твоя задача максимально строго проверить данное сочинение по 10 критериям. Однако не докапывайся до литературного аргумента или аргумента из жизни по К4 - достаточно их наличие и отсутствие грубых ошибок. При этом не требуй излишней конкретики, ведь работа рассчитана на 150-200 слов.
input structure:
{
"type": "object",
  "properties": {
    "source_text": {
      "type": "string",
      "description": "Исходный текст, по которому нужно написать сочинение"
    },
    "essay": {
      "type": "string",
      "description": "Работа ученика к проверке"
    },
}`,
			},
		],
	};
	const model = 'gemini-2.0-flash';

	const response = await ai.models.generateContent({
		model,
		config,
		contents: JSON.stringify({ source_text: sourceText, essay }),
	});

	return response.text;
}

export async function extractText(token: string, ...images: Image[]) {
	const ai = new GoogleGenAI({
		apiKey: token,
	});

	const config = {
		responseMimeType: 'application/json',
		responseSchema: {
			type: Type.OBJECT,
			properties: {
				extracted_essay: {
					type: Type.STRING,
				},
			},
		},
		systemInstruction: [
			{
				text: `Extract essay text from photos, ignore all misc info`,
			},
		],
	};

	const model = 'gemini-2.0-flash';
	const uploadedImages = await Promise.all(
		images.map(image => ai.files.upload({ file: image }))
	);

	const contents = [
		{
			role: 'user',
			parts: uploadedImages.map(image => ({
				fileData: {
					fileUri: image.uri,
					mimeType: image.mimeType,
				},
			})),
		},
	];

	const response = await ai.models.generateContent({
		model,
		config,
		contents,
	});

	return await JSON.parse(response.text || '').extracted_essay;
}

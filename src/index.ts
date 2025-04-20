import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { evaluateEssay, extractText } from './ai';

type Bindings = {
	GEMINI_API_TOKEN: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
	'*',
	cors({
		origin: ['https://unwanation.github.io'],
	})
);

app.post('/extract', async c => {
	const body = await c.req.parseBody();

	return c.json({
		text: await extractText(c.env.GEMINI_API_TOKEN, body['file']),
	});
});

app.post('/evaluate', async c => {
	const body = await c.req.json();
	return c.json(
		await evaluateEssay(c.env.GEMINI_API_TOKEN, body.sourceText, body.essay)
	);
});

export default app;

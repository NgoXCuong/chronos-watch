export async function generateGroqResponse(systemInstruction, userMessage, history = []) {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(15000),
        body: JSON.stringify({
            model: process.env.GROQ_MODEL || 'qwen/qwen3.8-27b',
            temperature: 0.2,
            max_completion_tokens: 1200,
            messages: [
                { role: 'system', content: systemInstruction },
                ...history.filter(message => ['user', 'assistant'].includes(message.role)
                    && typeof message.content === 'string')
                    .slice(-10).map(({ role, content }) => ({ role, content })),
                { role: 'user', content: userMessage },
            ],
        }),
    });
    // Never log request headers or provider bodies: they may contain sensitive data.
    if (!response.ok) throw new Error(`Groq HTTP ${response.status}`);
    const result = await response.json();
    const content = result.choices?.[0]?.message?.content;
    if (typeof content !== 'string' || !content.trim()) throw new Error('Groq trả về nội dung rỗng');
    return content;
}

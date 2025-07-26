export async function sendDiscordWebhook(message: string): Promise<void> {
  try {
    const response = await fetch('/api/discord', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    
    if (!response.ok) {
      const error = await response.text().catch(() => 'Failed to read error');
      throw new Error(`Discord API error: ${response.status}`);
    }
  } catch (error) {
    throw new Error('Failed to send notification');
  }
}

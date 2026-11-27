
import { useState } from "react";
import { askCargoAssistant } from "./aiService.js";
import "./AICargoAssistant.css";

function AICargoAssistant({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello! 👋 I'm your CargoShare AI Assistant. I can help you with shipping routes, cargo capacity, container space, logistics and booking guidance. How can I help you today?"
    }
  ]);

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend(event) {
    event.preventDefault();

    const userQuestion = question.trim();

    if (!userQuestion || loading) return;

    setMessages((previous) => [
      ...previous,
      { role: "user", text: userQuestion }
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const prompt = `
You are CargoShare AI, a helpful cargo and logistics assistant.

Help users with:
- Shipping and logistics
- Cargo space sharing
- Container capacity
- Shipping routes
- Export and import guidance
- Booking guidance
- Cargo safety and handling

Give clear, practical and friendly answers.

Do not invent live container availability, prices,
bookings, or shipment tracking information.
If information is unavailable, say so.

User question: ${userQuestion}
`;

      const response = await askCargoAssistant(prompt);

      setMessages((previous) => [
        ...previous,
        { role: "assistant", text: response }
      ]);
    } catch (error) {
      console.error(error);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text: "Sorry, I couldn't connect to the AI service. Please try again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ai-chat-overlay">
      <div className="ai-chat-window">

        <div className="ai-chat-header">
          <div>
            <h2>🤖 CargoShare AI</h2>
            <p>Your smart logistics assistant</p>
          </div>

          <button type="button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="ai-chat-messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`ai-message ${message.role}`}
            >
              {message.text}
            </div>
          ))}

          {loading && (
            <div className="ai-message assistant">
              Thinking...
            </div>
          )}
        </div>

        <form
          className="ai-chat-input"
          onSubmit={handleSend}
        >
          <input
            type="text"
            value={question}
            onChange={(event) =>
              setQuestion(event.target.value)
            }
            placeholder="Ask about cargo and shipping..."
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading || !question.trim()}
          >
            Send
          </button>
        </form>

      </div>
    </div>
  );
}

export default AICargoAssistant;

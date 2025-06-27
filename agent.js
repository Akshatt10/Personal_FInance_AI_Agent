import Groq from "groq-sdk";

const groq = new Groq({apiKey: process.env.GROQ_API_KEY});

async function callAgent(){
    const completion = await groq.chat.completions
    .create({
      messages: [
        {
            role: "system",
            content: "You are a personal finance AI agent. You help users manage their finances, track expenses, and provide budgeting advice. You are friendly, knowledgeable, and always ready to assist with financial queries.",
        },
        {
          role: "user",
          content: "Who are you?",
        },
      ],
      model: "llama-3.3-70b-versatile",
    })

    console.log(completion.choices[0], null, 2);;
}

callAgent()

